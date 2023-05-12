from .db import db
from flask_bcrypt import generate_password_hash, check_password_hash
from sqlalchemy_utils import EmailType, ChoiceType, PhoneNumberType, JSONType, URLType

STATES = [
    ('AL', 'Alabama'),
    ('AK', 'Alaska'),
    ('AS', 'American Samoa'),
    ('AZ', 'Arizona'),
    ('AR', 'Arkansas'),
    ('CA', 'California'),
    ('CO', 'Colorado'),
    ('CT', 'Connecticut'),
    ('DE', 'Delaware'),
    ('DC', 'District of Columbia'),
    ('FM', 'Federated States Of Micronesia'),
    ('FL', 'Florida'),
    ('GA', 'Georgia'),
    ('GU', 'Guam'),
    ('HI', 'Hawaii'),
    ('ID', 'Idaho'),
    ('IL', 'Illinois'),
    ('IN', 'Indiana'),
    ('IA', 'Iowa'),
    ('KS', 'Kansas'),
    ('KY', 'Kentucky'),
    ('LA', 'Louisiana'),
    ('ME', 'Maine'),
    ('MH', 'Marshall Islands'),
    ('MD', 'Maryland'),
    ('MA', 'Massachusetts'),
    ('MI', 'Michigan'),
    ('MN', 'Minnesota'),
    ('MS', 'Mississippi'),
    ('MO', 'Missouri'),
    ('MT', 'Montana'),
    ('NE', 'Nebraska'),
    ('NV', 'Nevada'),
    ('NH', 'New Hampshire'),
    ('NJ', 'New Jersey'),
    ('NM', 'New Mexico'),
    ('NY', 'New York'),
    ('NC', 'North Carolina'),
    ('ND', 'North Dakota'),
    ('MP', 'Northern Mariana Islands'),
    ('OH', 'Ohio'),
    ('OK', 'Oklahoma'),
    ('OR', 'Oregon'),
    ('PW', 'Palau'),
    ('PA', 'Pennsylvania'),
    ('PR', 'Puerto Rico'),
    ('RI', 'Rhode Island'),
    ('SC', 'South Carolina'),
    ('SD', 'South Dakota'),
    ('TN', 'Tennessee'),
    ('TX', 'Texas'),
    ('UT', 'Utah'),
    ('VT', 'Vermont'),
    ('VI', 'Virgin Islands'),
    ('VA', 'Virginia'),
    ('WA', 'Washington'),
    ('WV', 'West Virginia'),
    ('WI', 'Wisconsin'),
    ('WY', 'Wyoming'),
    ('OT', 'Other')
]


# defines user model attributes
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80))
    middle_name = db.Column(db.String(1))
    last_name = db.Column(db.String(80))
    access_id = db.Column(db.String(6), unique=True, nullable=False)
    email = db.Column(EmailType, unique=True, nullable=False)
    secondary_email = db.Column(EmailType, uniue=False, nullable=True)
    linkedin = db.Column(URLType, unique=False, nullable=True)
    password = db.Column(db.String(80), nullable=False)
    address = db.Column(db.String(120), nullable=True)
    address2 = db.Column(db.String(120), nullable=True)
    city = db.Column(db.String(80))
    state = db.Column(ChoiceType(STATES))
    zip_code = db.Column(db.String(5))
    country = db.Column(db.String(80))
    telephone = db.Column(PhoneNumberType())
    active = db.Column(db.Boolean, default=True)
    roles = db.relationship("UserRole", backref='user', cascade="all, delete-orphan")

    def __repr__(self):
        return '<User %r>' % self.access_id

    # hashes password before saving to db
    def hash_password(self, password):
        self.password = generate_password_hash(password).decode('utf8')

    # checks hashed password
    def check_password(self, password):
        return check_password_hash(self.password, password)

#Creates the Role entity with the fields that the database is expecting
class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(20), nullable=False)
    users = db.relationship('UserRole', backref='role')

#Creates the UserRole entity with the fields that the database is expecting
#Connects the user with a role
class UserRole(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'), nullable=False)
    active = db.Column(db.Boolean, default=True)
    properties = db.Column(JSONType)

#Creates the StudentAdviser entity with the fields that the database is expecting
class StudentAdviser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('user_role.id'), nullable=False)
    adviser_id = db.Column(db.Integer, db.ForeignKey('user_role.id'), nullable=False)
    student = db.relationship('UserRole', backref='advisers', foreign_keys=[student_id])
    adviser = db.relationship('UserRole', backref='students', foreign_keys=[adviser_id])
