from flask import request
from flask_jwt_extended import jwt_required

from models.CompletedCourseModel import Grade, CompletedCourse
from models.TermModel import TermCourse
from flask_restful import Resource

from schemas.CompletedCourseSchema import GradeSchema, CompletedCourseSchema

from models.db import db


class GradesApi(Resource):
    @jwt_required()
    def get(self):
        try:
            get_active = request.args.get('active', default='*', type=str)
            active_grades = True if get_active == "true" else False
            grades = Grade.query.filter(Grade.active == active_grades).all() \
                if get_active == "true" else Grade.query.all()
            all_grades = GradeSchema(many=True)
            return all_grades.dump(grades), 200
        except Exception as e:
            raise e

    @jwt_required()
    def post(self):
        try:
            body = request.get_json()
            grade = Grade(**body)
            db.session.add(grade)
            db.session.commit()
            return {"id": grade.id}, 200
        except Exception as e:
            raise e


class GradeApi(Resource):
    @jwt_required()
    def get(self, grade_id):
        try:
            grade = Grade.query.get_or_404(grade_id)
            grade_schema = GradeSchema()
            return grade_schema.dump(grade), 200
        except Exception as e:
            raise e

    @jwt_required()
    def delete(self, grade_id):
        try:
            grade = Grade.query.get_or_404(grade_id)
            db.session.delete(grade)
            db.session.commit()
            return {}, 200
        except Exception as e:
            raise e

    @jwt_required()
    def patch(self, grade_id):
        try:
            body = request.get_json()
            grade_schema = GradeSchema()
            grade = grade_schema.load(body, instance=Grade.query.get_or_404(grade_id), partial=True)
            db.session.commit()
            return grade_schema.dump(grade), 200
        except Exception as e:
            raise e


class PowCompletedCoursesApi(Resource):
    def get(self, pow_id):
        # Join completed courses with of the student with the selected POW courses
        try:
            results = db.session.execute(''
                                         'SELECT spc.id as pow_course_id, '
                                         'c.id as course_id, '
                                         'c.department as department, '
                                         'c.course_number as course, '
                                         'c.course_profile as course_name, '
                                         'c.number_of_credits as credits, '
                                         'spc.course_type as course_type, '
                                         't.id as planned_term_id, '
                                         't.term_name as planned_term, completed_term_id, ' 
                                         'completed_term, grade_id, grade FROM POW p '
                                         'JOIN student_pow_course spc on p.id = spc.pow_id '
                                         'LEFT JOIN term t on spc.term_id = t.id '
                                         'LEFT JOIN term_course tc on spc.course_id = tc.course_id '
                                         'AND spc.term_id = tc.term_id '
                                         'LEFT JOIN course c on spc.course_id = c.id '
                                         'LEFT JOIN ( SELECT tc2.course_id completed_course_id, t.term_name completed_term, '
                                         't.id completed_term_id, g.grade grade, g.id grade_id from POW p '
                                         'JOIN student_pow_course spc on p.id = spc.pow_id '
                                         'JOIN term_course tc2 on spc.course_id = tc2.course_id '
                                         'JOIN term t on tc2.term_id = t.id '
                                         'JOIN completed_course cc on p.student_id = cc.student_id ' 
                                         'AND cc.term_course_id = tc2.id '
                                         'LEFT JOIN grade g on cc.grade_id = g.id '
                                         'where spc.pow_id = :val) sub on sub.completed_course_id = spc.course_id '
                                         'WHERE spc.pow_id = :val;', {'val': pow_id})
            fields = ['pow_course_id', 'course_id', 'department', 'course', 'course_name', 'credits',
                      'course_type', 'planned_term_id', 'planned_term', 'completed_term_id', 'completed_term',
                      'grade_id', 'grade']
            joined_array = []
            for row in results:
                # Use zip to combine 2 lists
                pow_zip = zip(fields, row)

                # Turn the resulting list into a dictionary
                pow_dict = dict(pow_zip)
                joined_array.append(pow_dict)
            return joined_array, 200
        except Exception as e:
            raise e


class CompletedCoursesApi(Resource):
    @jwt_required()
    def get(self):
        try:
            completed_courses = CompletedCourse.query.all()
            all_completed = CompletedCourseSchema(many=True)
            return all_completed.dump(completed_courses), 200
        except Exception as e:
            raise e

    @jwt_required()
    def post(self):
        try:
            body = request.get_json()
            term_course = TermCourse.query.filter(TermCourse.course_id == body["course_id"]).\
                filter(TermCourse.term_id == body["term_id"]).first_or_404()
            old_completed_course = CompletedCourse.query.filter(CompletedCourse.term_course_id == term_course.id).\
                filter(CompletedCourse.student_id == body["student_id"]).first()
            if old_completed_course is not None:
                db.session.delete(old_completed_course)
                db.session.commit()
            completed_course = CompletedCourse(
                term_course_id=term_course.id,
                student_id=body["student_id"],
                grade_id=body["grade_id"],
            )
            db.session.add(completed_course)
            db.session.commit()
            return {"id": completed_course.id}, 200
        except Exception as e:
            raise e


class CompletedCourseApi(Resource):
    @jwt_required()
    def get(self, course_id):
        try:
            completed_course = CompletedCourse.query.get_or_404(course_id)
            completed_schema = CompletedCourseSchema()
            return completed_schema.dump(completed_course), 200
        except Exception as e:
            raise e

    @jwt_required()
    def delete(self, course_id):
        try:
            completed_course = CompletedCourse.query.get_or_404(course_id)
            db.session.delete(completed_course)
            db.session.commit()
            return {}, 200
        except Exception as e:
            raise e

    @jwt_required()
    def patch(self, course_id):
        try:
            body = request.get_json()
            completed_schema = CompletedCourseSchema()
            completed = completed_schema.load(body, instance=CompletedCourse.query.get_or_404(course_id), partial=True)
            db.session.commit()
            return completed_schema.dump(completed), 200
        except Exception as e:
            raise e
