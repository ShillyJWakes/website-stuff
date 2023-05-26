export class RoleModel {
  id: number | undefined;
  role: string | undefined;
  constructor(roleModel: { [key: string]: any } | undefined) {
    this.id = roleModel?.id;
    this.role = roleModel?.role;
  }
}
