import os
from functools import wraps
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, enumClts, enumProf, enumInfo, Users, Professionals, Administrators, Favourites, Info_activity, Activities, Inscriptions, Reports, Reviews, Clients
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select, delete, and_, or_
from sqlalchemy.exc import IntegrityError, DataError
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime
from rapidfuzz import process, fuzz
from flask_mail import Message
from api.mail.mailer import send_email


api = Blueprint('api', __name__)

CORS(api)

#Definición de @admin_required para comprobar si el usuario que realiza el request es un admin
def admin_required(check_admin):
    @wraps(check_admin)
    def wrapper(*args, **kwargs):
        id = get_jwt_identity()
        stmt = select(Administrators).where(Administrators.user_id == id)
        admin = db.session.execute(stmt).scalar_one_or_none()
        if not admin:
            return jsonify({"error": "Forbidden: Admins only."}), 403
        return check_admin(*args, **kwargs)
    return wrapper

#Enpoints para tabla Users
@api.route('/users', methods=['GET'])
@jwt_required()
@admin_required
def get_users():
    stmt = select(Users)
    users = db.session.execute(stmt).scalars().all()
    response_body = [user.serialize() for user in users]
    
    return jsonify(response_body), 200

@api.route('/users/', methods=['POST'])
def check_possible():
    data = request.json
    name = data["name"]
    stmt = select(Clients).where(Clients.username == name)
    user = db.session.execute(stmt).scalar_one_or_none()
    
    if user is not None:
        return jsonify({"error": "User already exists"}), 400
    return jsonify({"success": True})

@api.route('/users/<int:id>', methods=['GET'])
@jwt_required()
def get_one_user(id):
    user_id = int(get_jwt_identity())

    if(user_id != id):
        return jsonify({"error": "Forbidden access"}), 403
    
    stmt = select(Users).where(Users.id == id)
    user = db.session.execute(stmt).scalar_one_or_none()
    if user is None:
        return jsonify({"Error": "User not found"}), 404
    return jsonify(user.serialize()),200

@api.route('/user/', methods=['GET'])
@jwt_required()
def get_one_user_by_token():
    user_id = int(get_jwt_identity())
    stmt = select(Users).where(Users.id == user_id)
    user = db.session.execute(stmt).scalar_one_or_none()
    if user is None:
        return jsonify({"Error": "User not found"}), 404
    
    response_body = user.serialize()
    if user.client is None:
        response_body = {**response_body, "needs_filling": True}
    return jsonify({**response_body, "success": True}),200

@api.route('/signup', methods=['POST'])
def create_user():
    try:
        admin = db.session.execute(select(Administrators)).scalars()

        user = Users(email=request.form.get("email"), password=generate_password_hash(request.form.get("password")))
        db.session.add(user)
        db.session.commit()
        
        if not admin:
            new_admin = Administrators(user_id = user.id)
            db.session.add(new_admin)
            db.session.commit()
            
    except IntegrityError as e:
        db.session.rollback()
        return jsonify({"error": True, "response": e.message}), 409
    except DataError as e:
        db.session.rollback()
        return jsonify({"error": "Algunos valores superan los límites especificados"}), 422
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "No se pudo crear el usuario"}), 500
    
    return jsonify({"success": True}), 200

@api.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data or ("email" not in data and "username" not in data) or "password" not in data:
        return jsonify({"error":"Missing fields for login"}), 400
    if "email" in data:
        stmt = select(Users).where(and_(Users.email == data["email"], Users.is_active == True))
    elif "username" in data:
        stmt = select(Users).join(Clients).where(and_(Clients.username == data["username"], Users.is_active == True))
    user = db.session.execute(stmt).scalar_one_or_none()

    if not user:
        return jsonify({"error":"User not found"}), 404
    if not check_password_hash(user.password, data["password"]):
        return jsonify({"error":"Email/Password don't match"}), 401
    
    token = create_access_token(identity=str(user.id),expires_delta=False)
    userData = user.serialize()
    if user.client is not None:
        response_body = {
            "needs_filling": False
        }
    else:
        response_body = {
            "needs_filling": True
        }
    return jsonify({**userData, **response_body, "id": user.id, "success": True, "token": token}), 200

@api.route('/users/<int:id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_user(id):
    stmt = select(Users).where(Users.id == id)
    user = db.session.execute(stmt).scalar_one_or_none()
    if not user:
        return jsonify({"error":"User not found"}), 404
    user.is_active = not user.is_active
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error":"Couldn't delete user"})
    return jsonify({"success": True, "user": user.serialize()}), 200
    
@api.route('/users/<int:id>', methods=["PUT"])
@jwt_required()
def edit_user(id):
    user_id = get_jwt_identity()
    if int(id) != int(user_id):
        return jsonify({"error": "Forbidden access"}), 403
    
    stmt = select(Users).where(Users.id == id)
    user = db.session.execute(stmt).scalar_one_or_none()
    if not user:
        return jsonify({"error": "User not found"}), 404
    prof = db.session.execute(select(Professionals).where(Professionals.user_id == user.id)).scalar_one_or_none()

    data = request.json
    if not "is_professional" in data and data["is_professional"] == "true" and not prof:
        return jsonify({"error": "Profile info not found"}), 404

    if "birthdate" in data:
        fecha_iso = data['birthdate']
        data["birthdate"] = datetime.fromisoformat(fecha_iso.replace("Z", "+00:00"))

    if 'avatar' in request.files:
        avatar = request.files.get("avatar")
        avatar.filename = f"{user.id}.jpg"
        filepath = f"public/avatar/{avatar.filename}"
        avatar.save(os.path.join(filepath))
        user.avatar_url = avatar.filename
    db.session.commit()

    user_cells = ["username", "email", "telephone", "avatar_url", "name", "surname", "NID","address", "city", "birthdate"]
    prof_cells = ["bio", "business_name", "tax_address", "nuss"]

    if "gender" in data:
        setattr(user, "gender", enumClts(data["gender"]))
    if "type" in data:
        setattr(prof, "type", enumProf(data["type"]))

    for cell in user_cells:
        if cell in data:
            setattr(user, cell, data[cell])
    for cell in prof_cells:
        if cell in data:
            setattr(prof, cell, data[cell])

    try:
        db.session.commit()
    except IntegrityError as e:
        db.session.rollback()
        error = str(e).lower()
        message = "Unknown error"
        if "unique" in error:
            if "email" in error:
                message = "Email already exists in database"
            elif "nid" in error:
                message = "NID already exists in database"
            elif "username" in error:
                message = "User already exists in database"
            elif "telephone" in error:
                message = "Telephone already exists in database"
        return jsonify({"error": message}), 409
    except DataError as e:
        db.session.rollback()
        return jsonify({"error": "Provided data is out of bounds"}), 422
    except Exception:
        db.session.rollback()
        return jsonify({"error": "Couldn't update user"}), 500
    return jsonify({"success": True, "user": user.serialize()}), 200

#Endpoints para Client
@api.route('/clients', methods=['POST'])
@jwt_required()
def create_client():
    try:
        user_id = int(get_jwt_identity())
        user = db.session.execute(select(Users).where(Users.id == user_id)).scalar_one_or_none()
        if not user:
            return jsonify({"error": "User not found"}), 404

        client = Clients(user_id = user_id, username=request.form.get("username"), name=request.form.get("name"), surname=request.form.get("surname"), telephone=request.form.get("telephone"),
                        NID=request.form.get("NID"), address=request.form.get("address"), city=request.form.get("city"), country=request.form.get("country"),
                        gender=enumClts(request.form.get("gender")))

        avatar = request.files.get("avatar")
        if not avatar:
            client.avatar_url="0.jpg"
        else:
            avatar.filename = f"{user.id}.jpg"
            filepath = f"public/avatar/{avatar.filename}"
            avatar.save(os.path.join(filepath))
            client.avatar_url = avatar.filename
        
        fecha_iso = request.form.get('birthdate')
        if fecha_iso is not None:
            fecha_dt = datetime.fromisoformat(fecha_iso.replace("Z", "+00:00"))
            client.birthdate = fecha_dt
        
        db.session.add(client)
        db.session.commit()
    except Exception as e:
        print(e)
        return jsonify({"error": "Error desconocido"})
    return jsonify({"success": True, "user": user.serialize()})

@api.route('/users', methods=['PUT'])
@jwt_required()
def edit_client():
    try:
        user_id = int(get_jwt_identity())
        client = db.session.execute(select(Clients).where(Clients.user_id == user_id)).scalar_one_or_none()
        if not client:
            return jsonify({"error": "User not found"}), 404

        client_cells = ["telephone", "name", "surname", "NID","address", "city", "country"]
        client.gender= enumClts(request.form.get("gender"))
        
        username = request.form.get("username")
        if username:
            client.username = username

        for cell in client_cells:
            setattr(client, cell, request.form.get(cell))

        avatar = request.files.get("avatar")
        if avatar:
            avatar.filename = f"{client.user_id}.jpg"
            filepath = f"public/avatar/{avatar.filename}"
            avatar.save(os.path.join(filepath))
            client.avatar_url = avatar.filename
        
        fecha_iso = request.form.get('birthdate')
        print(fecha_iso)
        if fecha_iso is not None:
            fecha_dt = datetime.fromisoformat(fecha_iso.replace("Z", "+00:00"))
            client.birthdate = fecha_dt

        is_professional = request.form.get("is_professional")
        if is_professional:
            print("ENTRADA __----____---__--")
            prof = db.session.execute(select(Professionals).where(Professionals.user_id == user_id)).scalar_one_or_none()
            if not prof:
                return jsonify({"error": "Professional profile not found"}), 404
            prof_cells =["bio", "nuss", "business_name", "tax_address"]
            prof.type = enumProf(request.form.get("type"))
            for cell in prof_cells:
                setattr(prof, cell, request.form.get(cell))


        db.session.commit()
    except Exception as e:
        print(e)
        return jsonify({"error": "Error desconocido"})
    return jsonify({"success": True, "user": client.user.serialize()})

#Endpoints para Professional
@api.route('/professionals', methods=['GET'])
def get_professionals():
    stmt = select(Professionals)
    professionals = db.session.execute(stmt).scalars().all()
    response_body = [professional.serialize() for professional in professionals]

    return jsonify(response_body), 200

@api.route('/professionals/<int:id>', methods=['GET'])
def get_one_professional(id):
    stmt = select(Professionals).where(Professionals.user_id == id)
    professional = db.session.execute(stmt).scalar_one_or_none()
    if professional is None:
        return jsonify({"Error": "User not found"}), 404
    response_body = professional.serialize()
    del response_body["tax_address"]
    del response_body["nuss"]
    return jsonify(response_body),200

@api.route('/professionals', methods=['POST'])
@jwt_required()
def create_professional():
    try:
        user_id = int(get_jwt_identity())
        data = request.json
        if not data or "bio" not in data or "type" not in data or "business_name" not in data or "tax_address" not in data or "nuss" not in data:
            return jsonify({"error": "Missing fields to create professional"}), 400
        prof = Professionals(user_id=user_id, bio=data["bio"], type=enumProf(data["type"]), business_name=data["business_name"], tax_address=data["tax_address"], nuss=data["nuss"])
        db.session.add(prof)
        db.session.commit()
    except Exception as e:
        print(e)
        return jsonify({"error": "Couldn't create professional"}), 500
    return jsonify({"success": True, "user": prof.user.serialize()})

#endpoints favoritos
@api.route('/favs/<int:id>', methods=['POST'])
@jwt_required()
def add_fav(id):
    user_id = get_jwt_identity()
    if int(id) != int(user_id):
        return jsonify({"error": "Forbidden access"}), 403
    
    data = request.json # data["info_activity_id"]
    fav = Favourites(user_id=id, info_activity_id=data["info_activity_id"])
    db.session.add(fav)
    try:
        db.session.commit()
    except Exception as e:
        print(e)
        return jsonify({"error":"Couldn't create fav"}), 500
    return jsonify({"success": True})

@api.route('/favs/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_fav(id):
    user_id = get_jwt_identity()
    if int(id) != int(user_id):
        return jsonify({"error": "Forbidden access"}), 403
    
    data = request.json
    stmt = select(Favourites).where(and_(Favourites.user_id==id,Favourites.info_activity_id==data["info_activity_id"]))
    fav = db.session.execute(stmt).scalar_one_or_none()
    db.session.delete(fav)
    try:
        db.session.commit()
    except Exception as e:
        return jsonify({"error":"Couldn't delete fav"}), 500
    return jsonify({"success": True})

#Endpoints para Activities

@api.route('/activities', methods=['GET'])
def get_activities():
    stmt = select(Activities)
    activities = db.session.execute(stmt).scalars().all()
    if activities is None:
        return jsonify({"error": "Activities not found"}), 404
    response_body = [activity.serialize() for activity in activities]
    return jsonify(response_body), 200

@api.route('/activities/<int:id>', methods=['GET'])
def get_one_activity(id):
    stmt = select(Activities).where(Activities.id == id)
    activity= db.session.execute(stmt).scalar_one_or_none()
    if activity is None:
        return jsonify({"error": "Activity not found"}), 404
    return jsonify(activity.serialize()), 200

@api.route('/activities', methods=['POST'])
@jwt_required()
def create_activity():
    data = request.json
    if not data or "info_id" not in data or "price" not in data or "slots" not in data or "start_date" not in data or "end_date" not in data or "meeting_point" not in data:
        return jsonify({"error": "Missing fields for creating activity."}), 400
    
    prof_id = get_jwt_identity()
    stmt = select(Professionals).where(Professionals.user_id == int(prof_id))
    prof = db.session.execute(stmt).scalar_one_or_none()
    if prof is None:
        return jsonify({"error": "Given token doesn't match any professional in the database"}), 404
    stmt = select(Info_activity).where(and_(Info_activity.id == data["info_id"],Info_activity.professional_id == prof.user_id))
    info = db.session.execute(stmt).scalar_one_or_none()
    if info is None:
        return jsonify({"error": "Given info_id doesn't match any info in the database or you aren't the owner"}), 404

    if float(data["price"]) < 0:
        return jsonify({"error": "Price can't be negative"})
    elif int(data["slots"]) < 0:
        return jsonify({"error": "Slots can't be negative"})
    date_s = data["start_date"].split("/")
    date_e = data["end_date"].split("/")
    date_s = datetime(int(date_s[0]), int(date_s[1]), int(date_s[2]))
    date_e = datetime(int(date_e[0]), int(date_e[1]), int(date_e[2]))
    if date_s > date_e:
        return jsonify({"error": "Start date can't be greater than end date"})

    try:
        activity = Activities(info_id=info.id,price=data["price"], slots=data["slots"], start_date=date_s, end_date=date_e, meeting_point=data["meeting_point"])
        db.session.add(activity)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Couldn't create activity"}), 500
    
    return jsonify({"success": True, "activity": activity.serialize()}), 200

@api.route('/activities/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_activity(id):
    prof_id = int(get_jwt_identity())
    stmt = select(Activities).where(Activities.id == id)
    activity = db.session.execute(stmt).scalar_one_or_none()
    if not activity:
        return jsonify({"error": "Activity not found"}), 404
    if activity.info_activity.professional_id != prof_id:
        return jsonify({"error": "Forbidden access"}), 403
    activity.is_active = not activity.is_active
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error":"Couldn't delete activity"}), 500
    return jsonify({"success": True, "activity": activity.serialize()}), 200

@api.route('/activities/<int:id>', methods=['PUT'])
@jwt_required()
def edit_activity(id):
    prof_id = int(get_jwt_identity())
    stmt = select(Activities).where(Activities.id == id)
    activity = db.session.execute(stmt).scalar_one_or_none()
    if not activity:
        return jsonify({"error": "Activity not found"}), 404
    elif activity.info_activity.professional_id != prof_id:
        return jsonify({"error": "Forbidden access"}), 403
    
    data = request.json
    activity_cells = ["price", "slots", "start_date", "end_date", "is_finished", "meeting_point"]
    for cell in activity_cells:
        if cell in data:
            setattr(activity, cell, data[cell])

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Couldn't edit data"}), 500
    return jsonify({"success": True, "activity": activity.serialize()}), 200

#Enpoints para info_activity
@api.route('/info_activities', methods=['GET'])
def get_activities_info():
    stmt = select(Info_activity)
    infos = db.session.execute(stmt).scalars().all()
    if infos is None:
        return jsonify({"error":"Info activities not found"})
    response_body = [info.serialize() for info in infos]
    return jsonify(response_body), 200

@api.route('/info_activities/<int:id>', methods=['GET'])
def get_one_activity_inf(id):
    stmt = select(Info_activity).where(Info_activity.id == id)
    activity_info= db.session.execute(stmt).scalar_one_or_none()
    if activity_info is None:
        return jsonify({"error": "Info activity not found"}), 404
    return jsonify(activity_info.serialize()), 200

@api.route('/info_activities', methods=['POST'])
@jwt_required()
def create_info_activity():
    data = request.json
    if not data or "name" not in data or "desc" not in data or "type" not in data or "location" not in data or "price" not in data or "slots" not in data or "start_date" not in data or "end_date" not in data or "meeting_point" not in data:
        return jsonify({"error": "Missing fields for creating activity."}), 400
    prof_id = int(get_jwt_identity())
    stmt = select(Professionals).where(Professionals.user_id == prof_id)
    prof = db.session.execute(stmt).scalar_one_or_none()
    if prof is None:
        return jsonify({"error": "Given token doesn't match any professional in the database"}), 404
    if float(data["price"]) < 0:
        return jsonify({"error": "Price can't be negative"})
    elif int(data["slots"]) < 0:
        return jsonify({"error": "Slots can't be negative"})
    date_s = data["start_date"].split("/")
    date_e = data["end_date"].split("/")
    date_s = datetime(int(date_s[0]), int(date_s[1]), int(date_s[2]))
    date_e = datetime(int(date_e[0]), int(date_e[1]), int(date_e[2]))
    if date_s > date_e:
        return jsonify({"error": "Start date can't be greater than end date"})
    try:
        info_activity = Info_activity(professional_id = prof_id, name=data["name"], desc=data["desc"], type = enumInfo(data["type"]), location=data["location"])
        db.session.add(info_activity)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error":"Couldn't create info activity"})

    try:
        activity = Activities(info_id=info_activity.id,price=data["price"], slots=data["slots"], start_date=date_s, end_date=date_e, meeting_point=data["meeting_point"])
        db.session.add(activity)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Couldn't create activity"}), 500
    
    return jsonify({"success": True, "activity": activity.serialize()}), 200

# Endpoints para inscriptions
@api.route('/inscriptions', methods=['GET'])
@jwt_required()
def get_inscriptions():
    user_id = int(get_jwt_identity())
    stmt = select(Inscriptions).where(Inscriptions.user_id == user_id)
    ins = db.session.execute(stmt).scalars().all()
    if ins is None:
        return jsonify({"error":"Inscriptions not found"})
    response_body = [i.serialize() for i in ins]
    return jsonify(response_body), 200

@api.route('/inscriptions/<int:id>', methods=['GET'])
@jwt_required()
def get_inscription_for_one_user(id):
    user_id = int(get_jwt_identity())
    stmt = select(Inscriptions).where(and_(Inscriptions.id == id,Inscriptions.user_id == user_id))
    ins = db.session.execute(stmt).scalar_one_or_none()
    if ins is None:
        return jsonify({"error": "Inscription not found"}), 404
    return jsonify(ins.serialize()), 200

@api.route('/inscriptions/', methods=['POST'])
@jwt_required()
def create_inscription():
    user_id = int(get_jwt_identity())
    data = request.json
    if not data or not "activity_id" in data:
        return jsonify({"error": "Missing fields for creating inscription"}), 403
    
    stmt = select(Activities).where(Activities.id == data["activity_id"])
    activity = db.session.execute(stmt).scalar_one_or_none()
    if not activity:
        return jsonify({"error": "Activity not found"}), 404
    if activity.is_active == False or activity.is_finished == True:
        return jsonify({"error": "You can't join this activity"}), 400
    elif len(activity.inscriptions) >= activity.slots:
        return jsonify({"error": "This activity is full"}), 400
    elif activity.info_activity.professional_id == user_id:
        return jsonify({"error": "You can't join an activity you've created"}), 400

    inscription = Inscriptions(user_id=user_id, activity_id=data["activity_id"])
    db.session.add(inscription)
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error":"Couldn't create inscription"}), 500
    return jsonify({"success": True, "inscription": inscription.serialize()}), 200

@api.route('/inscriptions/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_inscription(id):
    user_id = int(get_jwt_identity())
    stmt = select(Inscriptions).where(and_(Inscriptions.id == id, Inscriptions.user_id == user_id))
    inscription = db.session.execute(stmt).scalar_one_or_none()

    if not inscription:
        return jsonify({"error": "Inscription not found"}), 404
    inscription.is_active = not inscription.is_active
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Couldn't delete inscription"}), 500
    return jsonify({"success": True, "inscription": inscription.serialize()}), 200

# Endpoints para reports
@api.route('/reports', methods=['GET'])
@jwt_required()
@admin_required
def get_reports():
    stmt = select(Reports)
    reports = db.session.execute(stmt).scalars().all()
    if reports is None:
        return jsonify({"error":"Reports not found"}), 404
    response_body = [rep.serialize() for rep in reports]
    return jsonify(response_body), 200

@api.route('/reports/<int:id>', methods=['GET'])
@jwt_required()
@admin_required
def get_one_report(id):
    stmt = select(Reports).where(Reports.id == id)
    report = db.session.execute(stmt).scalar_one_or_none()
    if report is None:
        return jsonify({"error":"Reports not found"}), 404
    return jsonify(report.serialize()), 200

@api.route('/reports', methods=['POST'])
@jwt_required()
def create_report():
    user_id = int(get_jwt_identity())
    data = request.json
    if not data or not "message" in data or not "activity_target_id" in data or not "professional_target_id" in data or (data["activity_target_id"] is None and data["professional_target_id"] is None):
        return jsonify({"error": "Missing fields to create report"}), 400

    report = Reports(user_id=user_id, message=data["message"], activity_target_id=data["activity_target_id"], professional_target_id=data["professional_target_id"])
    db.session.add(report)
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Couldn't create report"}), 500
    return jsonify({"success": True, "report": report.serialize()}),200

@api.route('/reports/<int:id>', methods=['DELETE'])
@jwt_required()
@admin_required
def check_report(id):
    stmt = select(Reports).where(Reports.id == id)
    report = db.session.execute(stmt).scalar_one_or_none()
    if report is None:
        return jsonify({"error": "Report not found"}), 404
    report.is_checked = not report.is_checked
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Couldn't toggle report"}), 500
    return jsonify({"success": True, "report": report.serialize()})

# Endpoints para reviews
@api.route('/reviews', methods=['GET'])
def get_reviews():
    stmt = select(Reviews).join(Clients).join(Users).where(Users.is_active)
    reviews = db.session.execute(stmt).scalars().all()
    if reviews is None:
        return jsonify({"error": "No reviews found"})
    response_body = [rev.serialize() for rev in reviews]
    return jsonify(response_body), 200

@api.route('/reviews/<int:id>', methods=['GET'])
def get_one_review(id):
    stmt = select(Reviews).where(Reviews.id == id)
    review = db.session.execute(stmt).scalar_one_or_none()
    if review is None:
        return jsonify({"error": "No reviews found"})
    return jsonify(review.serialize()), 200

@api.route('/reviews/', methods=['POST'])
@jwt_required()
def create_review():
    user_id = int(get_jwt_identity())
    data = request.json
    if not data or "info_activity_id" not in data or "professional_id" not in data or "professional_rating" not in data or "activity_rating" not in data or "professional_message" not in data or "activity_message" not in data:
        return jsonify({"error": "Missing fields to create review"}), 400
    
    review = db.session.execute(select(Reviews).where(and_(Reviews.info_activity_id == data["info_activity_id"], Reviews.user_id == user_id))).scalar_one_or_none()
    if review is not None:
        return jsonify({"error": "This activity has already been reviewed"}), 400

    review = Reviews(user_id = user_id, info_activity_id = data["info_activity_id"], professional_id = data["professional_id"], professional_rating = data["professional_rating"], activity_rating = data["activity_rating"], professional_message = data["professional_message"], activity_message = data["activity_message"])
    db.session.add(review)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Couldn't create review"})
    return jsonify({"success": True, "review": review.serialize()}), 200

@api.route('/reviews/<int:id>', methods=['PUT'])
@jwt_required()
def edit_review(id):
    user_id = int(get_jwt_identity())
    data = request.json
    if not data or "info_activity_id" not in data:
        return jsonify({"error": "Missing fields to edit review"}), 404

    stmt = select(Reviews).where(and_(Reviews.id == id, Reviews.user_id == user_id, Reviews.info_activity_id == data["info_activity_id"]))
    review = db.session.execute(stmt).scalar_one_or_none()
    if review is None:
        return jsonify({"error": "Review couldn't be found"}), 404
    
    review_cells = ["professional_rating", "activity_rating", "professional_message", "activity_message"]
    for cell in review_cells:
        if cell in data:
            setattr(review, cell, data[cell])
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Couldn't edit review"}), 500
    return jsonify({"success": True, "review": review.serialize()}), 200

# endpoint de búsqueda
@api.route('/search/<string:value>', methods=['GET'])
def search_word(value):
    if len(value) < 3:
        return jsonify({"error": "Search value must have at least 3 characters"}), 400

    profs = db.session.execute(select(Professionals).join(Professionals.user).join(Users.client)).scalars().all()
    activities = db.session.execute(select(Activities).join(Activities.info_activity)).scalars().all()

    prof_strings = [f"{prof.user.client.username} {prof.user.client.name} {prof.user.client.surname}" for prof in profs]
    act_strings = [f"{a.info_activity.name} {a.info_activity.location} {a.meeting_point}" for a in activities]

    prof_results = process.extract(
        value,
        prof_strings,
        scorer=fuzz.partial_ratio,
        processor=None,
        limit=5
    )
    act_results = process.extract(
        value,
        act_strings,
        scorer=fuzz.partial_ratio,
        processor=None,
        limit = 5
    )

    if len(prof_results) == 0 and len(act_results) == 0:
        return jsonify({"error": "Search couldn't find matches"}), 404
    
    thresold = 30
    response_body = {"professionals": [{"user_id": profs[result[2]].user_id, "username": profs[result[2]].user.client.username, "name": profs[result[2]].user.client.name, "surname": profs[result[2]].user.client.surname} for result in prof_results if result[1] > thresold], "activities": [{"id": activities[result[2]].id, "name": activities[result[2]].info_activity.name, "location": activities[result[2]].meeting_point } for result in act_results if result[1] > thresold]}
    return jsonify(response_body), 200

# Reset y cambio de contraseña
@api.route("/reset_password", methods=['POST'])
def check_mail():
    try:
        data = request.json
        user = db.session.execute(select(Users).where(Users.email == data["email"])).scalar_one_or_none()
        if not user:
            return jsonify({'success': False, 'error': 'User with given email not found'}),404
        
        token = create_access_token(identity=str(user.id))
        result = send_email(data['email'], token, f"{user.client.name} {user.client.surname}")
        return jsonify({'success': True}), 200
    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': 'something went wrong'})

@api.route('/password', methods=['PUT'])
@jwt_required()
def password_update():
    try:
        data = request.json
        id = get_jwt_identity()
        user = db.session.execute(select(Users).where(Users.id == id)).scalar_one_or_none()
        user.password = generate_password_hash(data['password'])
        
        db.session.commit()
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({'success': False, "error": "Error al cambiar la contraseña"}), 500
    return jsonify({'success': True}), 200

# put reviews

@api.route("/test")
def test():
    try:
        result = send_email("pabloherresp@gmail.com", "aaaaaaaaaaaaaaaaa")
    except Exception as e:
        print(e)
        return jsonify({"error": "No se pudo enviar el correo"})
    return jsonify({"success": True})
