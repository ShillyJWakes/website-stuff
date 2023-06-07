import sys
from .db import db
import json

from sqlalchemy_utils import JSONType, ChoiceType
from enum import Enum
from models.SpecializationModel import Specialization


class Requirement(db.Model):
    __tablename__ = 'requirement'
    id = db.Column(db.Integer, primary_key=True)
    parent_course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    child_course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    req_type = db.Column(db.String(80), nullable=False)
    parent_course = db.relationship('Course', backref='requisite_parent', foreign_keys=[parent_course_id])
    child_course = db.relationship('Course', backref='requisite_child', foreign_keys=[child_course_id])

COURSE_CHOICES = [
    ('1', 'Fall Only'),
    ('2', 'Winter Only'),
    ('3', 'Spring/Summer Only'),
    ('4', 'Fall and Winter'),
    ('5', 'Fall and Spring/Summer'),
    ('6', 'Winter and Spring/Summer'),
    ('7', 'All Semesters')
]

class Course(db.Model):
    __tablename__ = 'course'
    id = db.Column(db.Integer, primary_key=True)
    course_profile = db.Column(db.String(150), nullable=False)
    number_of_credits = db.Column(db.Integer, nullable=False)
    course_description = db.Column(db.Text)
    course_number = db.Column(db.String(4), nullable=False)
    department = db.Column(db.String(3), nullable=False)
    active = db.Column(db.Boolean, default=False)
    ms_code = db.Column(ChoiceType(COURSE_CHOICES), nullable=True)