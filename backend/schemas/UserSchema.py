from flask_marshmallow import fields
from marshmallow import post_load

from models.db import ma
from models.UserModel import User, Role, UserRole, StudentAdviser

#Defines the Role schema that will be used to represent the entity's fields and it's relations to other entities
class RoleSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        fields = ("id", "role")
        model = Role


# defines user information to be returned from the db
# returns the user information from User Table
class UserSchema(ma.SQLAlchemyAutoSchema):
    roles = ma.Nested(lambda: UserRoleSchema(many=True, only=("id", "role", "active")))

    class Meta:
        load_instance = True
        fields = ("id", "first_name", "middle_name", "last_name","active", "access_id", "email", "address", "address2", "city",
                  "secondary_email", "linkedin","state", "zip_code", 
                  "country", "telephone", "roles", "token", "password")
        model = User


# Returns the roles from the UserRoleSwap Table
class UserRoleSchema(ma.SQLAlchemyAutoSchema):
    role = ma.Nested(RoleSchema)
    user = ma.Nested(UserSchema,
                     only=("id", "first_name", "middle_name", "last_name", "access_id", "email", "address", "address2",
                           "city", "state", "zip_code", "country", "telephone"))

    class Meta:
        fields = ("id", "user_id", "role_id", "role", "user", "properties", "active")
        model = UserRole


class StudentAdviserSchema(ma.SQLAlchemyAutoSchema):
    student = ma.Nested(UserRoleSchema)
    adviser = ma.Nested(UserRoleSchema)

    class Meta:
        load_instance = True
        fields = ("id", "student_id", "adviser_id", "student", "adviser")
        model = StudentAdviser


user_schema = UserSchema()
users_schema = UserSchema(many=True)
