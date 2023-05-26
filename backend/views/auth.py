import sys

from flask import request, render_template
from flask_jwt_extended import create_access_token
from flask_mail import Message

from helpers.Error import UnauthorizedError, InternalServerError
from models.UserModel import User, UserRole
from flask_restful import Resource
import datetime

from models.db import db, mail
from schemas.UserSchema import user_schema


class SignupApi(Resource):
    """Class for handling user sign up and insertion into database.

    Args:
        Resource : Converting to API resource (endpoint - /api/auth/signup)
    """
    def post(self):
        """Retrieves new user info and inserts info into user and user_role tables.

        Raises:
            e: Error passing, raises which ever corresponding error, typically 500.

        Returns:
            dict: dict containing the user.id and a 200 response code.
        """
        try:
            body = request.get_json()
            roles = body["roles"]
            del body["roles"]
            user = user_schema.load(body)
            user.hash_password(body.get('password'))
            db.session.add(user)
            db.session.commit()
            for role in roles:
                role["user_id"] = user.id
                user_role = UserRole(**role)
                db.session.add(user_role)
                db.session.commit()
            return {'id': str(user.id)}, 200
        except Exception as e:
            raise e



class LoginApi(Resource):
    """Login for users, verifying credentials and issuing authorization token.

    Args:
        Resource : Convert to API resource (endpoint - /api/auth/login).
    """
    def post(self):
        """Check user input against database to authorize login.

        Raises:
            UnauthorizedError: Input credentials do not match any records in database
            InternalServerError: Problem querying the database

        Returns:
            JSON: JSON with authorization token and relevant user info, 200 response
        """
        try:
            body = request.get_json()
            user = User.query.filter_by(email=body.get('email')).first()
            authorized = user.check_password(body.get('password'))
            if not authorized:
                raise UnauthorizedError
            expires = datetime.timedelta(days=7)
            access_token = create_access_token(identity=str(user.id), expires_delta=expires)
            return {'token': access_token, 'user': user_schema.dump(user)}, 200
        except UnauthorizedError:
            raise UnauthorizedError
        except Exception as e:
            raise InternalServerError


class ForgotPasswordApi(Resource):
    """Process for requesting a new temporary password for users.

    Args:
        Resource : Converting to API resource (endpoint - /api/auth/forgot-password)
    """
    def post(self):
        """Verifies user email in database, sends temporary password to the email entered/on record.

        Raises:
            Exception: Email entered does not correspond to any user in the database
            Exception: _description_

        Returns:
            _type_: _description_
        """
        try:
            body = request.get_json()
            user = User.query.filter_by(email=body.get('email')).first()
            # Once secondary_email is implemented, will need to also query/check
            # if email entered here is their secondary. Dennis, Ask Tim
            if not user: 
                raise Exception("User does not exist.")
            return_url = body.get('return_url')
            expires = datetime.timedelta(minutes=15)
            access_token = create_access_token(identity=str(user.id), expires_delta=expires)
            msg = Message('Confirm Password Change', sender='pow.sis.mail@gmail.com', recipients=[user.email])
            main_url = return_url + "?email=" + user.email + "&token=" + access_token
            msg.html = render_template('/emails/forgot-password-notification.html', return_url=main_url,
                                       name=user.first_name)
            mail.send(msg)
            return {"message": "Please check your email."}, 200
        except Exception as e:
            raise Exception("")


class UpdatePasswordApi(Resource):
    """Resource for updating password after recieving temp password.

    Args:
        Resource : Converting to API resource (endpoint - /api/auth/update-password).
    """
    # @jwt_required()
    def post(self):
        """Fetches user info, checks password validity, updates database with new password.

        Raises:
            Exception: Entered email does not match any user.
            Exception: Old password matches new password.
            Exception: Catch all, typically 500 server errors.

        Returns:
            JSON: JSON of success message, 200 status.
        """
        try:
            body = request.get_json()
            # user = get_jwt_identity()
            user = User.query.filter_by(email=body.get('email')).first()
            if not user:
                raise Exception("")

            authorized = user.check_password(body.get('password'))
            if authorized:
                raise Exception("old_password and new_password is same.")

            #user.password = body.get('password')
            user.hash_password(body.get('password'))
            db.session.commit()
            msg = Message('Password Changed', sender='pow.sis.mail@gmail.com', recipients=[user.email])
            msg.body = "Hello,\n Updated your password."
            mail.send(msg)
            return {"message": "Successfully updated new password."}, 200
        except Exception as e:
            raise Exception("")
