import { UserRoleModel } from './user-role.model';

export class StudentAdviserModel {
  id: number | undefined;
  student: UserRoleModel | undefined;
  adviser: UserRoleModel | undefined;
  constructor(studentAdviserModel: { [key: string]: any } | undefined) {
    this.id = studentAdviserModel?.id;
    this.student = new UserRoleModel({ ...studentAdviserModel?.student });
    this.adviser = new UserRoleModel({ ...studentAdviserModel?.adviser });
  }
}
