from views.CompletedCourse import GradesApi, GradeApi, CompletedCoursesApi, CompletedCourseApi
from views.Message import MessagesApi, MessageApi
from views.Term import TermsApi, TermApi, TermCourseApi


def message_routes(api):
    api.add_resource(MessagesApi, '/api/messages/<pow_id>')
    api.add_resource(MessageApi, '/api/message')
