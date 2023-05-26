from flask_marshmallow import fields

from models.db import ma
from models.PowModel import POW, StudentPOWCourse
from schemas.SpecializationSchema import SpecializationSchema
from schemas.TermSchema import TermSchema
from schemas.CourseSchema import CourseSchema
from schemas.UserSchema import UserRoleSchema


class StudentPOWSchema(ma.SQLAlchemyAutoSchema):
    pow_courses = ma.Nested(lambda: StudentPOWCourseSchema, many=True)
    specialization = ma.Nested(SpecializationSchema, only=("id", "specialization", "course_types"))
    student = ma.Nested(UserRoleSchema, only=("id", "user"))
    candidacy_approved_by = ma.Nested(UserRoleSchema, only=("id", "user"))
    graduation_approved_by = ma.Nested(UserRoleSchema, only=("id", "user"))
    orientation_term = ma.Nested(TermSchema, only=("id", "term_name"))
    first_class_term = ma.Nested(TermSchema, only=("id", "term_name"))

    class Meta:
        fields = ("id", "student_id", "petition_date", "candidacy_approved_by_id",
                  "candidacy_approval_date", "graduation_approved_by_id", "graduation_approval_date",
                  "specialization_id", "orientation_term_id", "first_class_term_id", "completion_date", "active",
                  "pow_courses", "status", "orientation_term", "first_class_term", "creation_date", "specialization",
                  "student", "candidacy_approved_by", "graduation_approved_by", "orientation_term", "first_class_term")
        model = POW
        include_relationships = True
        load_instance = True


class StudentPOWCourseSchema(ma.SQLAlchemyAutoSchema):
    term = ma.Nested(TermSchema)
    pow = ma.Nested(StudentPOWSchema, only=("id", "status"))
    course = ma.Nested(CourseSchema, exclude=("course_description", "active"))

    class Meta:
        fields = ("id", "course_id", "pow_id", "term_id", "course", "pow", "term", "course_type")
        model = StudentPOWCourse
        load_instance = True


student_pow_schema = StudentPOWSchema()
student_pows_schema = StudentPOWSchema(many=True)
student_pow_course_schema = StudentPOWCourseSchema()
student_pow_courses_schema = StudentPOWCourseSchema(many=True)
