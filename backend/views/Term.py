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
    @jwt_required()
    def get(self):
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
    @jwt_required()
    def get(self, term_id):
        try:
            term = Term.query.get_or_404(term_id)
            term_schema = TermSchema()
            return term_schema.dump(term), 200
        except Exception as e:
            raise e

    @jwt_required()
    def delete(self, term_id):
        try:
            term = Term.query.get_or_404(term_id)
            db.session.delete(term)
            db.session.commit()
            return {}, 200
        except Exception as e:
            raise e
    @jwt_required()
    def patch(self, term_id):
        try:
            body = request.get_json()
            term_schema = TermSchema()
            term = term_schema.load(body, instance=Term.query.get_or_404(term_id), partial=True)
            db.session.commit()
            return term_schema.dump(term), 200
        except Exception as e:
            raise e


class TermCourseApi(Resource):

    @jwt_required()
    def post(self, term_id):
        try:
            for relationship in db.session.query(TermCourse).filter_by(term_id=term_id).all():
                db.session.delete(relationship)
                db.session.commit()

            
            msCodes = []
            for t in db.session.query(Term.term_name).filter(Term.id==term_id):
                if 'Fall' in t[0]:
                    msCodes = [1,4,5,7]
                elif 'Winter' in t[0]:
                    msCodes = [2,4,6,7]
                elif 'Spring' in t[0] or 'Summer' in t[0]:
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