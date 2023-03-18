import { UserModel } from './user.model';
import { RoleModel } from './role.model';

export class UserRoleModel {
  id: number | undefined;
  active: boolean | undefined;
  user: UserModel | undefined;
  role: RoleModel | undefined;
  constructor(userRoleModel: { [key: string]: any } | undefined) {
    this.id = userRoleModel?.id;
    this.active = userRoleModel?.active;
    this.user = new UserModel({ ...userRoleModel?.user });
    this.role = new RoleModel({ ...userRoleModel?.role });
  }
}
