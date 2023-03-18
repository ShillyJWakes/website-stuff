# Define the application directory
import os
from os import environ
from os.path import join
from dotenv import load_dotenv

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
dotenv_path = join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)


# Statement for enabling the development environment
DEBUG = True if environ.get('DEBUG') == 'True' else False

# Define the database - we are working with
SQLALCHEMY_DATABASE_URI = environ.get('SQLALCHEMY_DATABASE_URI') or 'sqlite:///' + os.path.join(BASE_DIR, 'app.db')
DATABASE_CONNECT_OPTIONS = {}

# Application threads. A common general assumption is
# using 2 per available processor cores - to handle
# incoming requests using one and performing background
# operations using the other.
THREADS_PER_PAGE = 2

# Enable protection against *Cross-site Request Forgery CSRF
CSRF_ENABLED = True
PROPAGATE_EXCEPTIONS = True

# key for cross site api calls
CSRF_SESSION_KEY = environ.get('CSRF_SESSION_KEY')

# jwt key for generating jwt tokens
JWT_SECRET_KEY = environ.get('JWT_SECRET_KEY')

MAIL_SERVER = environ.get('MAIL_SERVER')
MAIL_PORT = environ.get('MAIL_PORT')
MAIL_USERNAME = environ.get('MAIL_USERNAME')
MAIL_PASSWORD = environ.get('MAIL_PASSWORD')
MAIL_USE_TLS = True if environ.get('MAIL_USE_TLS') == 'True' else False
MAIL_USE_SSL = True if environ.get('MAIL_USE_SSL') == 'True' else False

CORS_ORIGINS = environ.get('CORS_ORIGINS')
CORS_RESOURCES = environ.get('CORS_RESOURCES')
