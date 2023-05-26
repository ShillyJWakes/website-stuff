from flask_marshmallow import fields
from marshmallow import post_load

from models.MessageModel import Message
from models.db import ma
from models.CompletedCourseModel import CompletedCourse, Grade
from schemas.CourseSchema import CourseSchema
from schemas.PowSchema import StudentPOWSchema
from schemas.UserSchema import UserRoleSchema, UserSchema

#Defines the Message schema that will be used to represent the entity's fields and it's relations to other entities
class MessageSchema(ma.SQLAlchemyAutoSchema):
    sender = ma.Nested(UserSchema)
    pow = ma.Nested(StudentPOWSchema)

    class Meta:
        fields = ("id", "sender_id", "pow_id", "message", "sender", "send_time", "pow")
        model = Message
        load_instance = True



message_schema = MessageSchema()
messages_schema = MessageSchema(many=True)
