import json
import sys

from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import text

from models.UserModel import User, UserRole
from flask_restful import Resource

from schemas.UserSchema import UserRoleSchema

from models.db import db

class RolesApi(Resource):
    """Class for inserting new role into the user_role table

    Args:
        Resource (): Convert to API resource (endpoint - /api/roles)

    Raises:
        e: 500 Internal Server Error

    Returns:
        JSON: JSON of user_role_id and 200 response code
    """
    @jwt_required()
    def post(self):
        try:
            body = request.get_json()
            user_role_schema = UserRoleSchema()
            user_role = user_role_schema.load(body)
            db.session.add(user_role)
            db.session.commit()
            return {"id": user_role.id}, 200
        except Exception as e:
            raise e

class RoleApi(Resource):
    """class for updating and removing roles based on role_id. 
        ENDPOINT NOT IN USE

    Args:
        Resource : Convert to API resource
    """
    @jwt_required()
    def patch(self, user_role_id):
        try:
            body = request.get_json()
            user_role_schema = UserRoleSchema()
            user_role = user_role_schema.load(body, instance=UserRole.query.get_or_404(user_role_id), partial=True)
            db.session.commit()
            return user_role_schema.dump(user_role), 200
        except Exception as e:
            raise e

    @jwt_required()
    def delete(self, user_role_id):
        try:
            user_role = UserRole.query.get_or_404(user_role_id)
            db.session.delete(user_role)
            db.session.commit()
            return {}, 200
        except Exception as e:
            raise e