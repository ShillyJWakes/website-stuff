from views.Term import TermsApi, TermApi, TermCourseApi, TermCoursesApi


def term_routes(api):
    api.add_resource(TermsApi, '/api/terms')
    api.add_resource(TermApi, '/api/term/<term_id>')
    api.add_resource(TermCoursesApi, '/api/term-courses')
    api.add_resource(TermCourseApi, '/api/term-course-update/<term_id>')
