from views.CompletedCourse import PowCompletedCoursesApi
from views.POW import StudentPOWApi, StudentPOWsApi, StudentPOWCourseApi, StudentPOWCoursesApi, PowActiveApi, StudentPOWCourseByCourseApi


def pow_routes(api):
    api.add_resource(StudentPOWsApi, '/api/pows')
    api.add_resource(StudentPOWApi, '/api/pow/<pow_id>')
    api.add_resource(StudentPOWCoursesApi, '/api/pow-courses')
    api.add_resource(StudentPOWCourseApi, '/api/pow-course/<pow_course_id>')
    api.add_resource(StudentPOWCourseByCourseApi, '/api/pow-course-by-course/<course_id>')
    api.add_resource(PowCompletedCoursesApi, '/api/pow-completed-courses/<pow_id>')
    api.add_resource(PowActiveApi, '/api/active-pow/<student_id>')
