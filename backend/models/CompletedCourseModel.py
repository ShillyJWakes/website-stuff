from .db import db
from .TermModel import Term, TermCourse
from .UserModel import UserRole


class CompletedCourse(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    term_course_id = db.Column(db.Integer, db.ForeignKey('term_course.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('user_role.id'), nullable=False)
    grade_id = db.Column(db.Integer, db.ForeignKey('grade.id'), nullable=False)
    term_course = db.relationship('TermCourse', backref='completed_courses')
    student = db.relationship('UserRole', backref='completed_courses')
    grade = db.relationship('Grade', backref='completed_courses')


class Grade(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    weight = db.Column(db.Float, nullable=False)
    grade = db.Column(db.String(3), nullable=False)
    description = db.Column(db.String(80), nullable=False)
    active = db.Column(db.Boolean, default=True)
