from flask_mail import Mail
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
ma = Marshmallow()
mail = Mail()


# initializes the sqlalchemy orm and marmallow schema manager
def initialize_db(app):
    db.init_app(app)
    ma.init_app(app)
    mail.init_app(app)
