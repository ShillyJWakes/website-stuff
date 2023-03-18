from flask_marshmallow import fields

from models.db import ma
from models.CourseModel import Course, Requirement


class RequirementSchema(ma.SQLAlchemyAutoSchema):
    parent_course = ma.Nested(lambda: CourseSchema, exclude=("requisite_parent", "course_description"))
    child_course = ma.Nested(lambda: CourseSchema, exclude=("requisite_parent", "course_description"))

    class Meta:
        fields = ("id", "req_type", "parent_course", "child_course_id", "parent_course_id", "child_course")
        model = Requirement
        load_instance = True


class CourseSchema(ma.SQLAlchemyAutoSchema):
    requisite_parent = ma.Nested(RequirementSchema, many=True)

    class Meta:
        fields = ("id", "course_profile", "number_of_credits", "course_description",
                  "course_number", "department", "active", "requisite_parent")
        model = Course
        load_instance = True


course_schema = CourseSchema()
courses_schema = CourseSchema(many=True)