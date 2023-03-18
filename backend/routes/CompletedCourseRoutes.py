from views.CompletedCourse import GradesApi, GradeApi, CompletedCoursesApi, CompletedCourseApi
from views.Term import TermsApi, TermApi, TermCourseApi


def completed_course_routes(api):
    api.add_resource(GradesApi, '/api/grades')
    api.add_resource(GradeApi, '/api/grade/<grade_id>')
    api.add_resource(CompletedCoursesApi, '/api/completed-courses')
    api.add_resource(CompletedCourseApi, '/api/term/completed-course/<course_id>')
