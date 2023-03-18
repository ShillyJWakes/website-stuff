from views.Course import CourseApi, CoursesApi

def course_routes(api):
    api.add_resource(CoursesApi, '/api/courses')
    api.add_resource(CourseApi, '/api/course/<course_id>')
    