import sys
from .db import db
import json

# from models.CourseModel import SpecializationCourse

from sqlalchemy_utils import JSONType

#Creates the Specialization entity with the fields that the database is expecting
class Specialization(db.Model):
    __tablename__ = 'specialization'
    id = db.Column(db.Integer, primary_key=True)
    specialization = db.Column(db.String(150), nullable=False)
    active = db.Column(db.Boolean, default=False, nullable=False)

    # returns the kinds of courses (electives, core) and how many is required
    course_types = db.Column(JSONType)

    courses = db.relationship('SpecializationCourse', backref='specialization')

    def get_course_types(self):
        course_types = json.dumps(self.course_types)
        return course_types

#Creates the SpecializationCourse entity with the fields that the database is expecting
class SpecializationCourse(db.Model):
    __tablename__ = 'specialization_course'
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    specialization_id = db.Column(db.Integer, db.ForeignKey('specialization.id'), nullable=False)
    course_type = db.Column(db.String(150))
    course = db.relationship('Course', backref='specialization_course')
