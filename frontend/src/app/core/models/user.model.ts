import { RoleModel } from './role.model';
import { UserRoleModel } from './user-role.model';

export class UserModel {
  id: number | undefined;
  accessID: string | undefined;
  firstName: string | undefined;
  middleIn: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  secondaryEmail: string | undefined;
  linkedin: string | undefined;
  city: string | undefined;
  state: string | undefined;
  zipCode: string | undefined;
  country: string | undefined;
  address: string | undefined;
  address2: string | undefined;
  telephone: string | undefined;
  active: boolean | undefined;
  token: string | undefined;
  userRoles: UserRoleModel[] | undefined;

  constructor(userModel: { [key: string]: any } | undefined) {
    this.id = userModel?.id;
    this.firstName = userModel?.first_name;
    this.lastName = userModel?.last_name;
    this.telephone = userModel?.telephone;
    this.email = userModel?.email;
    this.secondaryEmail = userModel?.secondayEmail;
    this.linkedin = userModel?.linkedin;
    this.state = userModel?.state;
    this.zipCode = userModel?.zip_code;
    this.country = userModel?.country;
    this.address = userModel?.address;
    this.address2 = userModel?.address2;
    this.token = userModel?.token;
    this.accessID = userModel?.access_id;
    this.city = userModel?.city;
    this.active = userModel?.active;
    this.middleIn = userModel?.middle_name;
    this.userRoles = userModel?.roles?.map(
      (role: RoleModel) => new UserRoleModel({ ...role })
    );
  }
}

// called it fuction auth.servie.ts
