from functools import wraps
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, enumClts, enumProf, enumInfo, Users, Professionals, Administrators, Favourites, Info_activity, Activities, Inscriptions, Reports, Reviews
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select, delete, and_
from sqlalchemy.exc import IntegrityError, DataError
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime

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
def get_users():
    stmt = select(Users)
    users = db.session.execute(stmt).scalars().all()
    response_body = [user.serialize() for user in users]
    
    return jsonify(response_body), 200

@api.route('/users/<int:id>', methods=['GET'])
def get_one_user(id):
    stmt = select(Users).where(Users.id == id)
    user = db.session.execute(stmt).scalar_one_or_none()
    if user is None:
        return jsonify({"Error": "User not found"}), 404
    return jsonify(user.serialize()),200

@api.route('/signup', methods=['POST'])
def create_user():
    data = request.json
    if not data or "email" not in data or "password" not in data or "username" not in data or "name" not in data or "surname" not in data or "telephone" not in data or "avatar_url" not in data or "city" not in data or "address" not in data or "birthdate" not in data or "gender" not in data or "is_professional" not in data or data["is_professional"] == "true" and ("bio" not in data or "type" not in data or "business_name" not in data or "tax_address" not in data or "nuss" not in data):
        return jsonify({"error": "Missing fields for creating user."}), 400

    try:
        date = data["birthdate"].split("/") #para tener por separado cada uno de los campos de la fecha
        user = Users(email=data["email"], password=generate_password_hash(data["password"]), username=data["username"], name=data["name"], surname=data["surname"], NID=data["NID"], telephone=data["telephone"], avatar_url=data["avatar_url"],city=data["city"], address=data["address"], birthdate=datetime(int(date[0]), int(date[1]), int(date[2])), gender=enumClts(data["gender"]))
        db.session.add(user)
        db.session.commit()
    except IntegrityError as e:
        db.session.rollback()
        error = str(e.__cause__).lower()
        message = "Unknown error"
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
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Couldn't create user"}), 500
    
    try:
        if data["is_professional"] == "true":
            prof = Professionals(user_id=user.id, bio=data["bio"], type=enumProf(data["type"]), business_name=data["business_name"], tax_address=data["tax_address"], nuss=data["nuss"])
            db.session.add(prof)
        db.session.commit()
    except Exception as e:
        db.session.delete(user)
        db.session.rollback()
        return jsonify({"error": "Couldn't create user"}), 500

    return jsonify(user.serialize()), 200

@api.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data or ("email" not in data and "username" not in data) or "password" not in data:
        return jsonify({"error":"Missing fields for login"}), 400
    if "email" in data:
        stmt = select(Users).where(Users.email == data["email"])
    elif "username" in data:
        stmt = select(Users).where(Users.username == data["username"])
    user = db.session.execute(stmt).scalar_one_or_none()

    if not user:
        return jsonify({"error":"User not found"}), 404
    if not check_password_hash(user.password, data["password"]):
        return jsonify({"error":"Email/Password don't match"}), 401
    
    token = create_access_token(identity=str(user.id),expires_delta=False)
    response_body = {
        "id": user.id,
        "success": True,
        "token": token
    }
    return jsonify(response_body), 200

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
        return jsonify({"success": True, "is_active": user.is_active})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error":"Couldn't delete user"})
    
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
        date = data["birthdate"].split("/")
        data["birthdate"] = datetime(int(date[0]), int(date[1]), int(date[2]))

    user_cells = ["username", "email", "telephone", "avatar_url", "name", "surname", "NID","address", "city", "gender", "birthdate"]
    prof_cells = ["bio", "type", "business_name", "tax_address", "nuss"]

    for cell in user_cells:
        if cell in data:
            setattr(user, cell, data[cell])
    for cell in prof_cells:
        if cell in data:
            setattr(prof, cell, data[cell])

    try:
        db.session.commit()
        return jsonify(user.serialize()), 200
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
    #response_body = [user.serialize() for user in user_by_id]
    if professional is None:
        return jsonify({"Error": "User not found"}), 404
    return jsonify(professional.serialize()),200

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

#Endpoints para actividades
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
    
    return jsonify(activity.serialize()), 200

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
    
    return jsonify(activity.serialize()), 200

# Endpoints para inscriptions
@api.route('/inscriptions', methods=['GET'])
@jwt_required()
def get_inscriptions():
    stmt = select(Inscriptions)
    ins = db.session.execute(stmt).scalars().all()
    if ins is None:
        return jsonify({"error":"Inscriptions not found"})
    response_body = [i.serialize() for i in ins]
    return jsonify(response_body), 200

@api.route('/inscriptions/<int:id>', methods=['GET'])
@jwt_required()
def get_inscription_for_one_user(id):
    stmt = select(Inscriptions).where(Inscriptions.id == id)
    ins= db.session.execute(stmt).scalar_one_or_none()
    if ins is None:
        return jsonify({"error": "Inscription not found"}), 404
    return jsonify(ins.serialize()), 200

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

# Endpoints para reviews
@api.route('/reviews', methods=['GET'])
def get_reviews():
    stmt = select(Reviews)
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


# put, delete acitivites, info_activity
# get, post, put, delete inscriptions
# get, post reports
# get, post, put reviews
# search