from flask_marshmallow import fields
from marshmallow import post_load

from models.TermModel import Term, TermCourse
from models.db import ma
from models.CompletedCourseModel import CompletedCourse, Grade
from schemas.CourseSchema import CourseSchema


class TermCourseSchema(ma.SQLAlchemyAutoSchema):
    course = ma.Nested(CourseSchema)

    class Meta:
        fields = ("id", "course_id", "term_id", "course")
        model = TermCourse
        load_instance = True


class TermSchema(ma.SQLAlchemyAutoSchema):
    term_courses = ma.Nested(TermCourseSchema, many=True)

    class Meta:
        fields = ("id", "term_name", "active", "term_courses", "term_start", "term_end")
        model = Term
        include_relationships = True
        load_instance = True



