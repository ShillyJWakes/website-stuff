import json
import sys

from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import text

from helpers.Filter import json_filter
from models.CompletedCourseModel import Grade, CompletedCourse
from models.MessageModel import Message
from models.TermModel import Term, TermCourse
from models.UserModel import User, UserRole, StudentAdviser
from flask_restful import Resource

from schemas.CompletedCourseSchema import GradeSchema, CompletedCourseSchema
from schemas.MessageSchema import MessageSchema, message_schema, messages_schema
from schemas.TermSchema import TermSchema
from schemas.UserSchema import user_schema, users_schema, UserSchema, StudentAdviserSchema

from models.db import db

import datetime


class MessagesApi(Resource):
    """Retrieving messages associated with a POW

    Args:
        Resource : Convert to API resource (endpoint - /api/messages/<pow_id>)

    Raises:
        e: 500 Internal Server Error

    Returns:
        JSON: JSON containing the messages and associated metadata. 200 response code
    """
    @jwt_required()
    def get(self, pow_id):
        try:
            message = Message.query.filter(Message.pow_id == pow_id).all()
            all_messages = []
            message_user = UserSchema(exclude=("password","telephone", "country","city","zip_code","state", "address" ))

            #Constructing the response
            for m in message:
                this_message = {
                    "message_id":m.id,
                    "sender_id":m.sender_id,
                    "pow_id": m.pow_id, 
                    "message":m.message, 
                    "send_time": m.send_time,
                    "sender":message_user.dump(User.query.get_or_404(m.sender_id)),
                    #"receiver":message_user.dump(User.query.get_or_404(m.receiver_id))
                }
                all_messages.append(this_message)

            #Making sure the messages return bottom to top to show the most recent message on the bottom
            sorted_messages = sorted(all_messages, key = lambda thismessage: thismessage["send_time"])
                
            return messages_schema.dump(sorted_messages), 200
        except Exception as e:
            raise e


class MessageApi(Resource):
    """Class responsible for creating new messages.

    Args:
        Resource : Convert to API resource (endpoint - /api/message)

    Raises:
        e: 500 Internal Server Error

    Returns:
        JSON: Message ID, response code 200
    """
    @jwt_required()
    def post(self):
        try:

            body = request.get_json()
            message = message_schema.load(body)
            db.session.add(message)
            db.session.commit()
            return {"id": message.id}, 200

        except Exception as e:
            raise e

