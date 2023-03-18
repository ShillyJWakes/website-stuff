import sys
from .db import db

from sqlalchemy_utils import JSONType, ChoiceType
from .TermModel import Term
from .CourseModel import Course
from .SpecializationModel import Specialization


STATUS = [
    ('Void', 'Void'),
    ('Active', 'Active'),
    ('Pending Approval', 'Pending Approval'),
    ('POW Approved', 'POW Approved'),
    ('POW Rejected', 'POW Rejected'),
    ('Pending Graduation', 'Pending Graduation'),
    ('Graduation Approved', 'Graduation Approved'),
    ('Graduation Rejected', 'Graduation Rejected'),
    ('Graduated', 'Graduated'),
]


class POW(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('user_role.id'), nullable=False)
    creation_date = db.Column(db.DateTime)
    petition_date = db.Column(db.DateTime)
    candidacy_approved_by_id = db.Column(db.Integer, db.ForeignKey('user_role.id'))
    candidacy_approval_date = db.Column(db.DateTime)
    graduation_approved_by_id = db.Column(db.Integer, db.ForeignKey('user_role.id'))
    graduation_approval_date = db.Column(db.DateTime)
    specialization_id = db.Column(db.Integer, db.ForeignKey('specialization.id'), nullable=False)
    orientation_term_id = db.Column(db.Integer, db.ForeignKey('term.id'))
    first_class_term_id = db.Column(db.Integer, db.ForeignKey('term.id'))
    status = db.Column(ChoiceType(STATUS), default='Void')
    pow_courses = db.relationship('StudentPOWCourse', backref='pow', cascade="all, delete-orphan")
    completion_date = db.Column(db.DateTime)
    orientation_term = db.relationship('Term', backref='orientation_pows', foreign_keys=[orientation_term_id])
    first_class_term = db.relationship('Term', backref='first_class_pows', foreign_keys=[first_class_term_id])
    specialization = db.relationship('Specialization', backref='pow')
    student = db.relationship('UserRole', backref='pow_student', foreign_keys=[student_id])
    candidacy_approved_by = db.relationship('UserRole', backref='pow_candidacy_approved_by',
                                            foreign_keys=[candidacy_approved_by_id])
    graduation_approved_by = db.relationship('UserRole', backref='pow_graduation_approved_by',
                                             foreign_keys=[graduation_approved_by_id])


class StudentPOWCourse(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    pow_id = db.Column(db.Integer, db.ForeignKey('POW.id'), nullable=False)
    term_id = db.Column(db.Integer, db.ForeignKey('term.id'))
    course_type = db.Column(db.String(80))
    course = db.relationship('Course', backref='pow_course')
    term = db.relationship('Term', backref='pow_course')
