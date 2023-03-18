import json

from flask_jwt_extended import jwt_required
from flask_mail import Message
from helpers.Filter import json_filter
from models.PowModel import POW, StudentPOWCourse
from flask_restful import Resource
from flask import request, render_template

from sqlalchemy import text

from models.UserModel import User, UserRole
from models.db import db, mail

from schemas.PowSchema import student_pow_schema, student_pow_course_schema, \
    student_pow_courses_schema, StudentPOWSchema
from schemas.UserSchema import users_schema


class StudentPOWsApi(Resource):
    @jwt_required()
    def get(self):
        try:
            get_filters = json.loads(request.args.get('filter', default='*', type=str))
            get_order = json.loads(request.args.get('order', default='*', type=str))
            query = db.session.query(POW)
            results = json_filter(filters=get_filters, model=POW, query=query).order_by(text(get_order))
            pows_schema = StudentPOWSchema(many=True)
            return pows_schema.dump(results.all()), 200
        except Exception as e:
            raise e

    @jwt_required()
    def post(self):
        try:
            body = request.get_json()
            POW.query.filter(POW.student_id == body["student_id"]).update({"status": "Void"})
            pow_schema = StudentPOWSchema()
            new_pow = pow_schema.load(body)
            db.session.add(new_pow)
            db.session.commit()
            if new_pow.status == 'Pending Approval':
                admins = User.query. \
                    join(User.roles, aliased=True). \
                    join(UserRole.role, aliased=True). \
                    filter_by(role='admin').all()
                admin_emails = [admin['email'] for admin in users_schema.dump(admins)]
                advisers = User.query. \
                    join(User.roles, aliased=True). \
                    join(UserRole.role, aliased=True). \
                    filter_by(role='adviser').all()
                adviser_emails = [adviser['email'] for adviser in users_schema.dump(advisers)]
                email_list = admin_emails + adviser_emails
                subject = "A POW Has been Submitted For Approval"
                msg = Message(subject=subject, sender='pow.sis.mail@gmail.com',
                              recipients=email_list)
                msg.html = render_template('/emails/pow-approve.html')
                mail.send(msg)

            return {'id': new_pow.id}, 200
        except Exception as e:
            raise e


class StudentPOWApi(Resource):
    @jwt_required()
    def get(self, pow_id):
        try:
            pow_obj = POW.query.get_or_404(pow_id)
            pow_schema = StudentPOWSchema()
            return pow_schema.dump(pow_obj), 200
        except Exception as e:
            raise e

    @jwt_required()
    def patch(self, pow_id):
        try:
            pow = student_pow_schema.load(request.get_json(), instance=POW.query.get_or_404(pow_id), partial=True)
            admins = User.query. \
                join(User.roles, aliased=True). \
                join(UserRole.role, aliased=True). \
                filter_by(role='admin').all()
            admin_emails = [admin['email'] for admin in users_schema.dump(admins)]
            advisers = User.query. \
                join(User.roles, aliased=True). \
                join(UserRole.role, aliased=True). \
                filter_by(role='adviser').all()
            adviser_emails = [adviser['email'] for adviser in users_schema.dump(advisers)]
            email_list = admin_emails + adviser_emails
            student_email = pow.student.user.email
            if pow.status == 'Pending Approval':
                subject = "A POW Has been Submitted For Approval"
                msg = Message(subject=subject, sender='pow.sis.mail@gmail.com',
                              recipients=email_list)
                msg.html = render_template('/emails/pow-approve.html')
                mail.send(msg)
            elif pow.status == 'Pending Graduation':
                subject = "A POW Has been Submitted For Graduation"
                msg = Message(subject=subject, sender='pow.sis.mail@gmail.com',
                              recipients=email_list)
                msg.html = render_template('/emails/graduation-approve.html')
                mail.send(msg)
            elif pow.status == 'Graduation Approved':
                subject = "Your Graduation POW has been Approved"
                msg = Message(subject=subject, sender='pow.sis.mail@gmail.com',
                              recipients=[student_email])
                msg.html = render_template('/emails/graduation-approved.html')
                mail.send(msg)
            elif pow.status == 'Graduation Rejected':
                subject = "Your Graduation POW has been Rejected"
                msg = Message(subject=subject, sender='pow.sis.mail@gmail.com',
                              recipients=[student_email])
                msg.html = render_template('/emails/graduation-rejected.html')
                mail.send(msg)
            elif pow.status == 'POW Approved':
                subject = "Your POW has been Approved"
                msg = Message(subject=subject, sender='pow.sis.mail@gmail.com',
                              recipients=[student_email])
                msg.html = render_template('/emails/pow-approved.html')
                mail.send(msg)
            elif pow.status == 'POW Rejected':
                subject = "Your POW has been Rejected"
                msg = Message(subject=subject, sender='pow.sis.mail@gmail.com',
                              recipients=[student_email])
                msg.html = render_template('/emails/pow-rejected.html')
                mail.send(msg)
            db.session.commit()
            return student_pow_schema.dump(pow), 200
        except Exception as e:
            raise e

    @jwt_required()
    def put(self, pow_id):
        try:
            body = request.get_json()
            pow_to_be_updated = POW.query.get_or_404(pow_id)
            pow_to_be_updated.student_id = body.get("student_id")
            pow_to_be_updated.pow_approved_by_id = body.get("pow_approved_by_id")
            pow_to_be_updated.graduation_approved_by_id = body.get("graduation_approved_by_id")
            pow_to_be_updated.specialization_id = body.get("specialization_id")
            pow_to_be_updated.active = body.get("active")
            pow_to_be_updated.status = body.get("status")

            if body.get("powCourses"):

                # removing relationships
                for relationship in db.session.query(StudentPOWCourse).filter_by(pow_id=pow_id).all():
                    db.session.delete(relationship)

                # adding relationships
                for powCourse in body.get("powCourses"):
                    new_pow_course = student_pow_course_schema.dump(
                        StudentPOWCourse.query.get_or_404(powCourse.get("id")))
                    new_relationship = StudentPOWCourse(
                        course_id=pow_id,
                        specialization_id=new_pow_course.get("id"),
                        course_type=powCourse.get("course_type")
                    )
                    db.session.add(new_relationship)

                db.session.commit()

            db.session.add(pow_to_be_updated)

            db.session.commit()

            pow_to_return = {
                "id": pow_to_be_updated.id,
                "student_id": pow_to_be_updated.student_id,
                "pow_approved_by_id": pow_to_be_updated.pow_approved_by_id,
                "graduation_approved_by_id": pow_to_be_updated.graduation_approved_by_id,
                "specialization_id": pow_to_be_updated.specialization_id,
                "active": pow_to_be_updated.active,
                "status": pow_to_be_updated.status
            }

            return student_pow_schema.dump(pow_to_return), 200
        except Exception as e:
            raise e

    @jwt_required()
    def delete(self, pow_id):
        try:
            pow_to_delete = POW.query.get_or_404(pow_id)
            # removing relationships
            for relationship in db.session.query(StudentPOWCourse).filter_by(pow_id=pow_id).all():
                db.session.delete(relationship)

            db.session.commit()

            db.session.delete(pow_to_delete)
            db.session.commit()
            return "Successfully deleted", 200
        except Exception as e:
            raise e


class StudentPOWCoursesApi(Resource):
    @jwt_required()
    def get(self):
        try:
            get_filters = json.loads(request.args.get('filter', default='*', type=str))
            get_order = json.loads(request.args.get('order', default='*', type=str))
            query = db.session.query(StudentPOWCourse)
            results = json_filter(filters=get_filters, model=StudentPOWCourse, query=query).order_by(
                text(get_order))
            return student_pow_courses_schema.dump(results.all()), 200
        except Exception as e:
            raise e

    @jwt_required()
    def post(self):
        try:
            body = request.get_json()
            pow_obj = StudentPOWCourse(**body)
            db.session.add(pow_obj)
            db.session.commit()
            return {'id': pow_obj.id}, 200
        except Exception as e:
            raise e


class StudentPOWCourseByCourseApi(Resource):
    @jwt_required()
    def delete(self, course_id):
        try:
            pow_obj = StudentPOWCourse.query.filter(StudentPOWCourse.course_id == course_id).first_or_404()
            db.session.delete(pow_obj)
            db.session.commit()
            return {}, 200
        except Exception as e:
            raise e


class StudentPOWCourseApi(Resource):
    @jwt_required()
    def get(self, pow_course_id):
        try:
            pow_obj = StudentPOWCourse.query.get_or_404(pow_course_id)
            return student_pow_course_schema.dump(pow_obj), 200
        except Exception as e:
            raise e

    @jwt_required()
    def patch(self, pow_course_id):
        try:
            pow_course = student_pow_course_schema.load(
                request.get_json(), instance=StudentPOWCourse.query.get_or_404(pow_course_id), partial=True)
            db.session.commit()
            return student_pow_course_schema.dump(pow_course), 200
        except Exception as e:
            raise e

    @jwt_required()
    def delete(self, pow_course_id):
        try:
            pow_obj = StudentPOWCourse.query.get_or_404(pow_course_id)
            db.session.delete(pow_obj)
            db.session.commit()
            return {}, 200
        except Exception as e:
            raise e


class PowActiveApi(Resource):
    @jwt_required()
    def get(self, student_id):
        try:
            pow_obj = POW.query.filter(POW.student_id == student_id).filter(POW.status != 'Void').first()
            pow_schema = StudentPOWSchema()
            return pow_schema.dump(pow_obj), 200
        except Exception as e:
            raise e
