from .db import db
from .CourseModel import Course


class TermCourse(db.Model):
    __tablename__ = 'term_course'
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    term_id = db.Column(db.Integer, db.ForeignKey('term.id'), nullable=False)
    course = db.relationship('Course', backref='term_courses')


class Term(db.Model):
    __tablename__ = 'term'
    id = db.Column(db.Integer, primary_key=True)
    term_name = db.Column(db.String(80), nullable=False)
    active = db.Column(db.Boolean, default=True)
    term_courses = db.relationship('TermCourse', backref='term')
    term_start = db.Column(db.DateTime)
    first_day_class = db.Column(db.DateTime)
    term_end = db.Column(db.DateTime)