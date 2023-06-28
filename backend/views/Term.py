import json
import sys

from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import text

from helpers.Filter import json_filter
from models.TermModel import Term, TermCourse
from models.UserModel import User, UserRole, StudentAdviser
from models.CourseModel import Course
from flask_restful import Resource

from schemas.TermSchema import TermSchema, TermCourseSchema
from schemas.UserSchema import user_schema, users_schema, UserSchema, StudentAdviserSchema

from models.db import db


class TermsApi(Resource):
    """Class for retrieving all terms for term tables and for inserting new terms into the database

    Args:
        Resource : Convert to API resource (endpoint - /api/terms/)
    """
    @jwt_required()
    def get(self):
        """Function to retrieve all terms to populate admin term table

        Raises:
            e: 500 Internal Server Error

        Returns:
            JSON: JSON of all terms info
        """
        try:
            get_filters = json.loads(request.args.get('filter', default='*', type=str))
            get_order = json.loads(request.args.get('order', default='*', type=str))
            query = db.session.query(Term)
            results = json_filter(filters=get_filters, model=Term, query=query).order_by(text(get_order))
            all_terms = TermSchema(many=True)
            return all_terms.dump(results.all()), 200
        except Exception as e:
            raise e

    @jwt_required()
    def post(self):
        """Function for inserting new term into the database

        Raises:
            e: 500 Internal Server Error

        Returns:
            JSON: JSON new term id, 200 response code
        """
        try:
            body = request.get_json()
            term_schema = TermSchema()
            term = term_schema.load(body)
            db.session.add(term)
            db.session.commit()
            return {"id": term.id}, 200
        except Exception as e:
            raise e


class TermApi(Resource):
    """Class for interacting with individual terms

    Args:
        Resource : Convert to API resource (endpoint - /api/term/<term_id>)
    """
    @jwt_required()
    def get(self, term_id):
        """Function for fetching singular term's information

        Args:
            term_id (int): Uniwue ID associated with a term

        Raises:
            e: 500 Internal Server Error

        Returns:
            JSON: JSON of term info
        """
        try:
            term = Term.query.get_or_404(term_id)
            term_schema = TermSchema()
            return term_schema.dump(term), 200
        except Exception as e:
            raise e

    @jwt_required()
    def delete(self, term_id):
        """Function for deleting a term from the database

        Args:
            term_id (int): Unique ID associated with a term

        Raises:
            e: 500 Internal Server error

        Returns:
            JSON: Empty JSOn, 200 response code
        """
        try:
            term = Term.query.get_or_404(term_id)
            db.session.delete(term)
            db.session.commit()
            return {}, 200
        except Exception as e:
            raise e
    @jwt_required()
    def patch(self, term_id):
        """Function for editing a term's information

        Args:
            term_id (int): Unique ID associated with a term

        Raises:
            e: 500 Internal Server Error

        Returns:
            JSON: JSON of newly updated term info, 200 response code
        """
        try:
            body = request.get_json()
            term_schema = TermSchema()
            term = term_schema.load(body, instance=Term.query.get_or_404(term_id), partial=True)
            db.session.commit()
            return term_schema.dump(term), 200
        except Exception as e:
            raise e


class TermCourseApi(Resource):
    """Class for populating a term with courses offered. Corresponds to the term_course table
       within the database. A term, after being created and saved, will be auto populated according to
       the type of Term (Winter/Fall/Spring&Summer) in accordence with the Master Schedule. That value
       can be assigned with the 'Semesters' option in the course creation menu.

    Args:
        Resource : Convert to API resource (endpoint - /api/term-course-update/<term_id>)
        term_id (int): Unique ID associated with a term

    Raises:
        e: 500 Internal Server Error

    Returns:
        JSON: Empty JSON and a 200 response code
    """
    @jwt_required()
    def post(self, term_id):
        try:
            for relationship in db.session.query(TermCourse).filter_by(term_id=term_id).all():
                db.session.delete(relationship)
                db.session.commit()

            
            msCodes = []
            for t in db.session.query(Term.term_name).filter(Term.id==term_id):
                if 'fall' in t[0].lower():
                    msCodes = [1,4,5,7]
                elif 'winter' in t[0].lower():
                    msCodes = [2,4,6,7]
                elif 'spring' in t[0].lower() or 'summer' in t[0].lower():
                    msCodes= [3,5,6,7]
            q = db.session.query(TermCourse).filter(TermCourse.term_id==term_id).all()
            if len(q) == 0:
                default_courses = db.session.query(Course.id).filter(Course.ms_code.in_(msCodes))
                for course in default_courses:
                    revised_schema = {'term_id': term_id,
                                      'course_id': course.id}
                    term_course_schema = TermCourseSchema(exclude=("course",))
                    term_course = term_course_schema.load(revised_schema)
                    db.session.add(term_course)
                    db.session.commit()
            courses = request.get_json()
            for course in courses:
                checking = db.session.query(TermCourse).filter(TermCourse.course_id == course['course_id'], TermCourse.term_id == term_id).all()
                if len(checking) == 0:
                    term_course_schema = TermCourseSchema(exclude=("course",))
                    term_course = term_course_schema.load(course)
                    db.session.add(term_course)
                    db.session.commit()
                else:
                    pass
            return {}, 200
        except Exception as e:
            raise e


class TermCoursesApi(Resource):
    """Class for inserting a new term-course into the database

    Args:
        Resource : Convert to API resource (endpoint - /api/term-courses)

    Raises:
        e: 500 Internal Server Error

    Returns:
        JSON: JSON of new term_cours.id and 200 response code
    """
    @jwt_required()
    def post(self):
        try:
            course = request.get_json()
            term_course = TermCourse(**course)
            db.session.add(term_course)
            db.session.commit()
            return {"id": term_course.id}, 200
        except Exception as e:
            raise e