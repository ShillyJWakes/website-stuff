from flask_marshmallow import fields

from models.db import ma
from models.CourseModel import Course, Specialization
from .CourseSchema import CourseSchema

#Defines the SpecializationCourse schema that will be used to represent the entity's fields and it's relations to other entities
#Nested fields are in connection to other database entities
class SpecializationCourseSchema(ma.SQLAlchemyAutoSchema):
    course = ma.Nested(CourseSchema)
    specialization = ma.Nested(lambda: SpecializationSchema, only=("id", "specialization"))
    load_instance = True

    class Meta:
        fields = ("course_id", "specialization_id", "course_type", "specialization", "course")

#Defines the Specialization schema that will be used to represent the entity's fields and it's relations to other entities
#Nested fields are in connection to other database entities
class SpecializationSchema(ma.SQLAlchemyAutoSchema):
    courses = ma.Nested(SpecializationCourseSchema, many=True, exclude=("specialization",))
    course_types = fields.fields.Raw()
    load_instance = True

    class Meta:
        fields = ("id", "specialization", "active", "course_types", "courses")
        model = Specialization


specialization_schema = SpecializationSchema()
specializations_schema = SpecializationSchema(many=True)
specialization_course_schema = SpecializationCourseSchema()
specializations_courses_schema = SpecializationCourseSchema(many=True)
