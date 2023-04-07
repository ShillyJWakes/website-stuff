import json
import random
from flask_mail import Message

from io import TextIOWrapper
import csv
import pandas as pd

from flask import request, render_template, abort
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import text

from helpers.Filter import json_filter
from models.UserModel import User, UserRole, StudentAdviser
from flask_restful import Resource

from schemas.UserSchema import user_schema, UserSchema, StudentAdviserSchema

from models.db import db, mail



def role_check(record):
	role1 = record[1]
	if record[2] == None:
		return [role1]
	else:
		role2 = record[2]
		if record[3] == None:
			return [role1, role2]
		else:
			role3 = record[3]
			return [role1, role2, role3]

# secure call to get logged in user's personal information
# returns user info as JSON object'
# for /me
class MeApi(Resource):
    @jwt_required()
    def get(self):
        try:
            current_user = get_jwt_identity()
            user = User.query.get_or_404(current_user)
            return user_schema.dump(user), 200
        except Exception as e:
            raise e

#Endpoint that handles user management such as retrieving and editing
class UsersApi(Resource):
    @jwt_required()
    def get(self):
        try:
            get_filters = json.loads(request.args.get('filter', default='*', type=str))
            get_order = json.loads(request.args.get('order', default='*', type=str))
            query = db.session.query(User)
            results = json_filter(filters=get_filters, model=User, query=query).order_by(text(get_order))
            all_users = UserSchema(many=True, exclude=("password",))
            return all_users.dump(results.all()), 200
        except Exception as e:
            raise e

    @jwt_required()
    def post(self):
        try:
            body = request.get_json()
            roles = body["roles"]
            url = body["url"]
            del body["roles"]
            del body["url"]

            new_user_schema = UserSchema(exclude=("password",))
            user = new_user_schema.load(body, session=db.session)
            temp_password = random.randint(100000,999999)
            user.password = str(temp_password)
            user.hash_password(user.password)
            db.session.add(user)
            db.session.commit()
            for role in roles:
                role["user_id"] = user.id
                user_role = UserRole(**role)
                db.session.add(user_role)
                db.session.commit()


            receiver_first_name = user.first_name
            reciever_temp_password = temp_password
            receiver_email = user.email
            subject = "SIS Portal - Hello " + receiver_first_name +", You've Been Added To The SIS Portal!"
            msg = Message(subject=subject, sender='pow.sis.mail@gmail.com', recipients=[receiver_email])
            msg.html = render_template('/emails/user-creation-notification.html', url=url, password=reciever_temp_password, email=receiver_email)
            mail.send(msg)
            return new_user_schema.dump(user), 200
        except Exception as e:
            raise e

#Endpoint that handles user management such as retrieving, editing, and deleting on specific users
class UserApi(Resource):
    @jwt_required()
    def get(self, user_id):
        try:
            user = User.query.get_or_404(user_id)
            user_get_schema = UserSchema(exclude=("password",))
            return user_get_schema.dump(user), 200
        except Exception as e:
            raise e

    @jwt_required()
    def delete(self, user_id):
        try:
            user = User.query.get_or_404(user_id)
            db.session.delete(user)
            db.session.commit()
            return {}, 200
        except Exception as e:
            raise e

    @jwt_required()
    def patch(self, user_id):
        try:
            patch_schema = UserSchema(exclude=("password",))
            user = patch_schema.load(request.get_json(), instance=User.query.get_or_404(user_id), partial=True)
            db.session.commit()
            return patch_schema.dump(user), 200
        except Exception as e:
            raise e


class AdviserApi(Resource):
    @jwt_required()
    def get(self, adviser_id):
        try:
            students = StudentAdviser.query.filter(StudentAdviser.adviser_id == adviser_id).all()
            adviser_student_schema = StudentAdviserSchema(many=True, exclude=("adviser",))
            return adviser_student_schema.dump(students), 200
        except Exception as e:
            raise e


class AdviserStudentApi(Resource):
    @jwt_required()
    def delete(self, adviser_id, student_id):
        try:
            student = StudentAdviser.query.filter(StudentAdviser.adviser_id == adviser_id)\
                .filter(StudentAdviser.student_id == student_id).first()
            db.session.delete(student)
            db.session.commit()
            return {}, 200
        except Exception as e:
            raise e


class AdvisersApi(Resource):
    @jwt_required()
    def post(self):
        try:
            body = request.get_json()
            adviser_schema = StudentAdviserSchema(exclude=("adviser", "student"))
            student_adviser = adviser_schema.load(body)
            db.session.add(student_adviser)
            db.session.commit()
            return {"id": student_adviser.id}, 200
        except Exception as e:
            raise e

#Endpoint used for multiple user uploads via a csv file upload
# This function has been re-written, I will keep the legacy code on hand,
# but I don't see a case in which we need to revert back 
# especially as it didn't work and was poorly optimized.
class UploadUsersApi(Resource):
    @jwt_required()
    def post(self):
        try:
            #finds the file based on the field name in the request
            csv_file = request.files['file']

            #determines the url in which the request was send
            url = request.form["url"]

            #Reading CSV file into dataframe for manipulating and extracting info
            data = pd.read_csv(csv_file, header=None)

            new_users_list = []

            existing_users = UserSchema(many=True, exclude=(
                    "id",
            		"email",
                    "first_name",
                    "middle_name",
                    "last_name",
                    "password",
                    "address",
                    "address2",
                    "city",
                    "state",
                    "zip_code",
                    "country",
                    "telephone",
                    "active",
                    "roles"
                ))

            recorded_users = existing_users.dump(User.query.all())

            new_access_ids = data[0].tolist()

            already_user = [user for user in data[0] if user not in recorded_users]
            #Checking to see if there are any duplicate access IDs within the file that was provided
            length_x = len(new_access_ids)
            length_y = len(set(new_access_ids))
                      
            if length_x != length_y:
                abort(500, description="Duplicate Entries in File")
            
            extract_roles = data.apply(role_check, axis=1)
            #Creating the users from the csv file
            i = 0
            for record in data[0]:
                initial_password = random.randint(100000,999999)

                user_roles = extract_roles[i]
        
                body = {
                    "email": record + "@wayne.edu",
                    "active":True,
                    "access_id": record,
                    "password": str(initial_password)
                }

                new_user = UserSchema(exclude=(
                    "id", 
                    "middle_name", 
                    "address", 
                    "city",
                    "state", 
                    "zip_code", 
                    "country", 
                    "telephone", 
                    "roles", 
                    "token", 
                ))
                my_user = new_user.load(body)

                added_user_credentials = {
                    "email":my_user.email,
                    "password":my_user.password
                }

                new_users_list.append(added_user_credentials)

                my_user.hash_password(body.get('password'))

                db.session.add(my_user)
                db.session.commit();

                user = User.query.filter(User.access_id == record).all()
                user_get_schema = UserSchema(exclude=("password",))
                user_id = user_get_schema.dump(user[0])["id"]

                #for role in row[1:]:
                 #    roles.append(role)

                #giving the new users that have been added the roles specified in the file
                for new_role in user_roles:
                    if(new_role == "student"):
                        new_user_role = UserRole(user_id = user_id, role_id=1)
                        db.session.add(new_user_role)
                    elif(new_role == "admin"):
                        new_user_role = UserRole(user_id = user_id, role_id=2)
                        db.session.add(new_user_role)
                    elif(new_role == "adviser"):
                        new_user_role = UserRole(user_id = user_id, role_id=3)
                        db.session.add(new_user_role)

                i +=1
                db.session.commit() 


            #Keeping a mail connection open in order to send multiple emails to multiple people
            # While mail connection is open, send emails to the recipients recorded from the csv file            
            with mail.connect() as connection:
                for user in new_users_list:
                    reciever_temp_password = user["password"]
                    receiver_email = user["email"]
                    subject = "SIS Portal - You've Been Added To The SIS Portal!"
                    msg = Message(subject=subject, sender='pow.sis.mail@gmail.com', recipients=[user["email"]])
                    msg.html = render_template('/emails/user-creation-notification.html', url=url, password=reciever_temp_password, email=receiver_email)

                    connection.send(msg)
            return "Success", 200
        except Exception as e:
            raise e

#Endpoint that handles editing user roles
class UserRoleApi(Resource):
    @jwt_required()
    def patch(self, user_id):
        try:
            body = request.get_json()
            body_roles = body.get("roles")

            user = User.query.get_or_404(user_id)

            #if a user has a role, change the status of the role to whatever was sent through the request
            #if the user does not have the role specified, create a new user role record in the user role table
            for role in body_roles:
                has_role = False
                for existing_role in user.roles:
                    if(existing_role.role_id == role["role_id"]):
                        has_role = True
                        if(existing_role.active != role["role_active"]):
                            existing_role.active = role["role_active"]
                            
                
                if(has_role == False):
                    if(role["role_active"] == True):
                        new_user_role = UserRole(user_id = user_id, role_id=role["role_id"])
                        db.session.add(new_user_role)

            user_return_schema = UserSchema(exclude=("password",))
            
            db.session.commit()
            return user_return_schema.dump(user), 200
        except Exception as e:
            raise e

class UserPasswordApi(Resource):
    @jwt_required()
    def patch(self, user_id):
        try:
            patch_schema = UserSchema()
            return_schema = UserSchema(exclude=("password",))
            user = patch_schema.load(request.get_json(), instance=User.query.get_or_404(user_id), partial=True)
            user.hash_password(user.password)
            db.session.commit()
            return return_schema.dump(user), 200
        except Exception as e:
            raise e