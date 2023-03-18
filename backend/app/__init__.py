from flask import Flask
from flask_restful import Api
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS

from models.db import initialize_db, db
from routes.routes import initialize_routes

app = Flask(__name__, template_folder='../templates')
# Configurations
app.config.from_object('config')
api = Api(app)
bCrypt = Bcrypt(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)
initialize_routes(api)
initialize_db(app)
cors = CORS(app)
