from views.auth import LoginApi, SignupApi, ForgotPasswordApi, UpdatePasswordApi
from .CompletedCourseRoutes import completed_course_routes
from .MessageRoutes import message_routes
from .UserRoutes import user_routes
from .CourseRoutes import course_routes
from .SpecializationRoutes import specialization_routes
from .TermRoutes import term_routes
from .POWRoutes import  pow_routes


def initialize_routes(api):
    # authentication routes
    api.add_resource(LoginApi, '/api/auth/login')
    api.add_resource(SignupApi, '/api/auth/signup')
    api.add_resource(ForgotPasswordApi, '/api/auth/forgot-password')
    api.add_resource(UpdatePasswordApi, '/api/auth/update-password')
    user_routes(api)
    course_routes(api)
    specialization_routes(api)
    pow_routes(api)
    term_routes(api)
    completed_course_routes(api)
    message_routes(api)
