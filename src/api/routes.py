"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, enumClts, enumProf, Users, Clients, Profesionals
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select, delete, and_
from datetime import datetime

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/users', methods=['GET'])
def get_users():
    stmt = select(Users)
    users = db.session.execute(stmt).scalars().all()
    if not users:
        return jsonify({"error": "No users found"}), 404
    response_body = [user.serialize() for user in users]

    return jsonify(response_body), 200

@api.route('/signup', methods=['POST'])
def create_user():
    data = request.json
    if not data or "email" not in data or "password" not in data:
        return jsonify({"error": "Missing fields for creating user."}), 400
    
    user = Users(email=data["email"], password=data["password"], username=data["username"], name=data["name"], surname=data["surname"], NID=data["NID"], telephone=data["telephone"], avatar_url=data["avatar_url"])
    db.session.add(user)
    try:
        db.session.commit()
    except Exception as e:
        return jsonify({"error": "Couldn't create user"}), 400
    
    date = data["birthdate"].split("/")
    client = Clients(user_id=user.id, city=data["city"], address=data["address"], birthdate=datetime(int(date[0]), int(date[1]), int(date[2])), gender=enumClts(data["gender"]))     
    db.session.add(client)

    if "is_profesional" in data:
        prof = Profesionals(user_id=user.id, bio=data["bio"], type=enumProf(data["type"]), business_name=data["business_name"], tax_address=data["tax_address"], nuss=data["nuss"])
        db.session.add(prof)

    db.session.commit()

    return jsonify(user.serialize()), 200