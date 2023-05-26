from views.Role import RolesApi, RoleApi
from views.user import UserApi, UserPasswordApi, UserRoleApi, UsersApi, MeApi, AdviserApi, AdvisersApi, AdviserStudentApi, UploadUsersApi


# define user routes
def user_routes(api):
    api.add_resource(MeApi, '/api/user/me')
    api.add_resource(UsersApi, '/api/users')
    api.add_resource(UploadUsersApi, '/api/upload_users')
    api.add_resource(UserApi, '/api/user/<user_id>')
    api.add_resource(UserPasswordApi, '/api/user_password/<user_id>')
    api.add_resource(UserRoleApi, '/api/user_role/<user_id>')
    api.add_resource(RolesApi, '/api/roles')
    api.add_resource(AdviserApi, '/api/adviser/<adviser_id>')
    api.add_resource(AdviserStudentApi, '/api/adviser/<adviser_id>/<student_id>')
    api.add_resource(AdvisersApi, '/api/advisers')

