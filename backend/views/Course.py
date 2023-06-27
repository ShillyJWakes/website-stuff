import jwt
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow.fields import Nested
from sqlalchemy import text
from sqlalchemy.orm import session
from flask_mail import Message

from helpers.Filter import json_filter
from models.CourseModel import Course, Requirement
from models.SpecializationModel import Specialization, SpecializationCourse
from flask_restful import Resource
from flask import request, make_response, render_template
import sys
import json

from models.UserModel import User, UserRole
from models.db import db, mail

from schemas.CourseSchema import course_schema, courses_schema, RequirementSchema
from schemas.SpecializationSchema import specialization_schema, specializations_schema
from schemas.UserSchema import user_schema, users_schema


class CoursesApi(Resource):
    """Class for retrieving courses from database and inserting custom courses.

    Args:
        Resource : Convert to API resource (endpoint - /api/courses)
    """
    @jwt_required()
    def get(self):
        """Priamry function of the class, fetching all courses for course tables.

        Raises:
            e: 500 Internal Server Error

        Returns:
            JSON: JSON of all courses within filter, ordered accordingly. 200 response code
        """
        try:
            get_filters = json.loads(request.args.get('filter', default='*', type=str))
            get_order = json.loads(request.args.get('order', default='*', type=str))
            query = db.session.query(Course)
            results = json_filter(filters=get_filters, model=Course, query=query).order_by(text(get_order))
            return courses_schema.dump(results.all()), 200
        except Exception as e:
            raise e

    @jwt_required()
    def post(self):
        """Function to handle creation of courses either by admin or student.

        Raises:
            e: 500 Internal Server Error

        Returns:
            Response Code: 200
        """
        try:
            body = request.get_json()
            request_url = request.environ['HTTP_ORIGIN']
            course = course_schema.load(body)
            db.session.add(course)
            db.session.commit()
            current_user = get_jwt_identity()
            student = User.query.get_or_404(current_user)
            user_obj = user_schema.dump(student)
            role_list = [value for user_role in user_obj['roles']
                         for value in user_role['role'].values()]
            #If user who submitted is a student,
            if 'student' in role_list:
                admins = User.query. \
                    join(User.roles, aliased=True). \
                    join(UserRole.role, aliased=True). \
                    filter_by(role='admin').all()
                subject = "Custom Course Needs Approval"
                msg = Message(subject=subject, sender='pow.sis.mail@gmail.com', recipients=[admin['email'] for admin in users_schema.dump(admins)])
                msg.html = render_template('/emails/custom-course-approve.html',
                                           user=user_obj['first_name'] + ' ' + user_obj['last_name'],
                                           url=request_url + '/admin/course-mgmt/course/' + str(course.id),
                                           )
                mail.send(msg)

            return 200
        except Exception as e:
            raise e


class CourseApi(Resource):
    """Class to handle viewing, updating, and changing singular courses.

    Args:
        Resource : Convert to API Resource (endpoint - /api/course/<course_id>)
    """
    @jwt_required()
    def get(self, course_id):
        """Function to retrieve single course. Used when viewing a courses attributes in course table.

        Args:
            course_id (int): Unique ID for the course in the course table of the database

        Returns:
            JSON: JSON containing course information to be formatted and displayed. 200 response code
        """
        course = Course.query.get_or_404(course_id)
        course_to_return = course_schema.dump(course)
        return course_to_return, 200

    @jwt_required()
    def put(self, course_id):
        """Function for updating the attributes of a course

        Args:
            course_id (int): Unique ID for the course in the course table of the database

        Raises:
            e: 500 Internal Server Error

        Returns:
            course_id: Unique ID for the course in the course table of the database
            Response Code: 200
        """

        body = request.get_json()
        course_to_be_updated = Course.query.get_or_404(course_id)

        try:
            course_to_be_updated.course_profile = body.get("course_profile")
            course_to_be_updated.number_of_credits = body.get("number_of_credits")
            course_to_be_updated.course_description = body.get("course_description")
            course_to_be_updated.course_number = body.get("course_number")
            course_to_be_updated.department = body.get("department")
            course_to_be_updated.active = body.get("department")
            db.session.add(course_to_be_updated)
            db.session.commit()

            return self.get(course_id), 200
        except Exception as e:
            raise e

    @jwt_required()
    def patch(self, course_id):
        """Function for adding/updating pre- and co-requesites for a course

        Args:
            course_id (int): Unique ID for the course in the course table of the database

        Raises:
            e: 500 Internal Server Error

        Returns:
            JSON: JSON with the newly updated requisite information. 200 response code
        """
        try:
            body = request.get_json()
            requisites = body["requisite_parent"]
            del body["requisite_parent"]
            course = course_schema.load(body, instance=Course.query.get_or_404(course_id), partial=True)
            db.session.commit()
            for req in Requirement.query.filter(Requirement.parent_course_id == course_id):
                db.session.delete(req)
                db.session.commit()
            req_schema = RequirementSchema()
            for new_req in requisites:
                req = req_schema.load(new_req)
                db.session.add(req)
                db.session.commit()
            return course_schema.dump(course), 200
        except Exception as e:
            raise e

    @jwt_required()
    def delete(self, course_id):
        """Deleting a course from the database

        Args:
            course_id (int): Unique ID for the course in the course table of the database

        Raises:
            e: 500 Internal Server Error

        Returns:
            Response Code: 200
        """
        course_to_delete = Course.query.get_or_404(course_id)
        try:

            # removing relationships
            for relationship in db.session.query(SpecializationCourse).filter_by(course_id=course_id).all():
                db.session.delete(relationship)

            db.session.commit()

            db.session.delete(course_to_delete)
            db.session.commit()
            return 200
        except Exception as e:
            raise e
