from flask_marshmallow import fields
from marshmallow import post_load

from models.db import ma
from models.CompletedCourseModel import CompletedCourse, Grade
from schemas.TermSchema import TermCourseSchema
from schemas.UserSchema import UserRoleSchema


class GradeSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        fields = ("id", "weight", "grade", "description", "active")
        model = Grade
        load_instance = True


class CompletedCourseSchema(ma.SQLAlchemyAutoSchema):
    term_course = ma.Nested(TermCourseSchema)
    student = ma.Nested(UserRoleSchema)
    grade = ma.Nested(GradeSchema)

    class Meta:
        fields = ("id", "term_course_id", "student_id", "grade_id", "term_course", "student", "grade")
        model = CompletedCourse
        load_instance = True


class PowCompletedCoursesSchema(ma.Schema):
    term_course_course_id = fields.fields.Integer()
    specialization_course_course_type = fields.fields.String()

    class Meta:
        fields = ("tc_course_id", "sc_course_type")


