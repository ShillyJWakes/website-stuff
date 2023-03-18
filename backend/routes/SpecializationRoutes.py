from views.Specialization import SpecializationApi, SpecializationsApi, SpecializationCoursesApi, \
    SpecializationCourseApi


def specialization_routes(api):
    api.add_resource(SpecializationsApi, '/api/specializations')
    api.add_resource(SpecializationApi, '/api/specialization/<specialization_id>')
    api.add_resource(SpecializationCoursesApi, '/api/specialization-courses')
    api.add_resource(SpecializationCourseApi, '/api/specialization-course/<course_id>')
