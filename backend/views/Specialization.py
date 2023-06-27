import json

from flask_jwt_extended import jwt_required
from marshmallow.fields import Nested
from sqlalchemy import text
from sqlalchemy.orm import session

from helpers.Filter import json_filter
from models.CourseModel import Course
from models.SpecializationModel import Specialization, SpecializationCourse
from flask_restful import Resource
from flask import request, make_response
import sys

from models.db import db

from schemas.CourseSchema import course_schema, courses_schema
from schemas.SpecializationSchema import specialization_schema, specializations_schema, specializations_courses_schema, \
    specialization_course_schema

#Returns and creates new specializations to the specialization table
class SpecializationsApi(Resource):
    """Retrieves and Creates new specializations

    Args:
        Resource : Convert to API resource (endpoint - /api/specializations)
    """
    @jwt_required()
    def get(self):
        """Retrieve all specializations from specializations table

        Raises:
            e: 500 Internal Server Error

        Returns:
            JSON: JSON containing specializations info, 200 response code
        """
        try:
            get_filters = json.loads(request.args.get('filter', default='*', type=str))
            get_order = json.loads(request.args.get('order', default='*', type=str))
            query = db.session.query(Specialization)
            results = json_filter(filters=get_filters, model=Specialization, query=query)\
                .order_by(text(get_order))
            return specializations_schema.dump(results.all()), 200
        except Exception as e:
            raise e

    @jwt_required()
    def post(self):
        """Function for creating new specialization and inserting into the specialization table

        Raises:
            e: 500 Internal Server Error

        Returns:
            JSON: specialization ID and 200 response code
        """
        try:
            body = request.get_json()
            courses = body["courses"]
            del body["courses"]
            new_specialization = Specialization(**body)
            db.session.add(new_specialization)
            db.session.commit()
            for course in courses:
                course["specialization_id"] = new_specialization.id
                new_spec_course = SpecializationCourse(**course)
                db.session.add(new_spec_course)
                db.session.commit()
            return {'id': new_specialization.id}, 200
        except Exception as e:
            raise e

#Main endpoint that is used for creating, editing, and deleting specializations
class SpecializationApi(Resource):
    """Class for editing and deleting specializations

    Args:
        Resource: Convert to API resource (endpoint - /api/specialization/<specialization_id>)
    """
    @jwt_required()
    def get(self, specialization_id):
        """Retrieve data about a specific specialization

        Args:
            specialization_id (int): Unique ID associated with a specialization

        Raises:
            e: 500 Internal Server Error

        Returns:
            JSON: JSON containing info about the specialization
        """
        try:
            specialization = Specialization.query.get_or_404(specialization_id)
            return specialization_schema.dump(specialization), 200
        except Exception as e:
            raise e

    @jwt_required()
    def put(self, specialization_id):
        """Function for updating a specialization

        Args:
            specialization_id (int): unique ID associated with a specialization

        Raises:
            e: 500 Internal Server Error

        Returns:
            JSON: Specialization ID and 200 response code
        """

        body = request.get_json()
        specialization_to_be_updated = Specialization.query.get_or_404(specialization_id)

        try:
            specialization_to_be_updated.specialization = body.get("specialization")
            specialization_to_be_updated.active = body.get("active")
            specialization_to_be_updated.course_types = body.get("course_types")

            if body.get("courses"):

                # removing relationships
                for relationship in db.session.query(SpecializationCourse).filter_by(
                        specialization_id=specialization_id).all():
                    db.session.delete(relationship)

                # adding relationships
                for course in body.get("courses"):
                    new_relationship = SpecializationCourse(
                        course_id=course.get("course_id"),
                        specialization_id=specialization_id,
                        course_type=course.get("course_type")
                    )
                    db.session.add(new_relationship)

                db.session.commit()

            db.session.add(specialization_to_be_updated)

            db.session.commit()

            return self.get(specialization_id), 200
        except Exception as e:
            raise e

    @jwt_required()
    def patch(self, specialization_id):
        """Function for editing aspects of a specialization

        Args:
            specialization_id (int): Unique ID associated with the specialization

        Raises:
            e: 500 Internal Server Error

        Returns:
            JSON: JSON of edited specialization info, 200 resposne code
        """
        try:
            specialization = specialization_schema.load(
                request.get_json(), instance=Specialization.query.get_or_404(specialization_id), partial=True)
            db.session.commit()
            return specialization_schema.dump(specialization), 200
        except Exception as e:
            raise e

    @jwt_required()
    def delete(self, specialization_id):
        """Deleting a specialization from the specialization table

        Args:
            specialization_id (int): Unique ID associated with the specialization

        Raises:
            e: 500 Internal Server Error 

        Returns:
            Response Code: 200
        """
        specialization_to_delete = Specialization.query.get_or_404(specialization_id)
        try:

            # removing relationships
            for relationship in db.session.query(SpecializationCourse).filter_by(
                    specialization_id=specialization_id).all():
                db.session.delete(relationship)

            db.session.commit()

            db.session.delete(specialization_to_delete)
            db.session.commit()
            return 200
        except Exception as e:
            raise e


#Endpoint that handles the SpecializaitonCourse entity and it's relationship between the specializations and its singular records
class SpecializationCoursesApi(Resource):
    """Class that handles the SpecializationCourse entity and the relationship between courses and specializations

    Args:
        Resource: Convert to API resource (endpoint - /api/specialization-courses)
    """
    @jwt_required()
    def get(self):
        try:
            get_filters = json.loads(request.args.get('filter', default='*', type=str))
            get_order = json.loads(request.args.get('order', default='*', type=str))
            query = db.session.query(SpecializationCourse)
            results = json_filter(filters=get_filters, model=SpecializationCourse, query=query).order_by(
                text(get_order))
            return specializations_courses_schema.dump(results.all()), 200
        except Exception as e:
            raise e

    @jwt_required()
    def post(self):
        try:
            body = request.get_json()
            course = SpecializationCourse(**body)
            db.session.add(course)
            db.session.commit()
            return {'id': course.id}, 200
        except Exception as e:
            raise e


#Endpoint that handles the SpecializaitonCourse entity and it's relationship between the specializations/courses and records within
class SpecializationCourseApi(Resource):
    """Class that handles the SpecializationCourse entity and its relationship betweent eh specializations/course and records within

    Args:
        Resource : Convert to API resource (endpoint - /api/specialization-course/<course_id>)
    """
    @jwt_required()
    def get(self, course_id):
        """Function to retrieve course information within a specialization

        Args:
            course_id (int): Unique ID associated with a course

        Raises:
            e: 500 Internal Server Error

        Returns:
            JSON: JSON of course information, 200 response code
        """
        try:
            course = SpecializationCourse.query.get_or_404(course_id)
            return specialization_course_schema.dump(course), 200
        except Exception as e:
            raise e

    @jwt_required()
    def patch(self, course_id):
        """Function to edit attributes relating to a course within a specialization

        Args:
            course_id (int): Unique ID associated with a course

        Raises:
            e: 500 Internal Server Error

        Returns:
            JSON: JSOn with new info relating to a course, 200 response code
        """
        try:
            course = specialization_course_schema.load(
                request.get_json(), instance=SpecializationCourse.query.get_or_404(course_id), partial=True)
            db.session.commit()
            return specialization_course_schema.dump(course), 200
        except Exception as e:
            raise e

    @jwt_required()
    def delete(self, course_id):
        """Function to delete a course from a specialization

        Args:
            course_id (int): Unique ID associated with a course

        Raises:
            e: 500 Internal Server Error

        Returns:
            JSON: JSON of updated specialization information, 200 respopnse code
        """
        try:
            pow_obj = SpecializationCourse.query.get_or_404(course_id)
            db.session.delete(pow_obj)
            db.session.commit()
            return specialization_course_schema.dump(pow_obj), 200
        except Exception as e:
            raise e
