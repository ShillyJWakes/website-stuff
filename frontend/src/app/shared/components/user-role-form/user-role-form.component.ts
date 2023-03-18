import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserModel } from 'src/app/core/models/user.model';
import { UsersService } from '../../services/users.service';

import { CoursesService } from '../../services/courses.service';
import { CourseModel } from '../../models/course.model';
import { UserRoleModel } from 'src/app/core/models/user-role.model';
import { ToastMessageService } from '../../services/toast-message.service';
import { ConfirmationToastService } from '../../services/confirmation-toast.service';

@Component({
  selector: 'app-user-role-form',
  templateUrl: './user-role-form.component.html',
  styleUrls: ['./user-role-form.component.scss'],
})
export class UserRoleFormComponent implements OnChanges {
  submitted = false;
  sending = false;
  success = false;
  @Input() create = true;
  @Input() prefill: UserModel | undefined;

  rolesEmpty: Boolean | undefined;

  readyToSubmit: Boolean | undefined;

  isStudent: Boolean | undefined = false;
  isAdviser: Boolean | undefined = false;
  isAdmin: Boolean | undefined = false;
  roles: any;
  @Output() formSubmitted: EventEmitter<boolean> = new EventEmitter();
  newRoleForm: FormGroup = this._formBuilder.group({});

  constructor(
    //importing services
    private _formBuilder: FormBuilder,
    private userService: UsersService,
    private toastService: ToastMessageService,
    private confirmationToastService: ConfirmationToastService
  ) {}

  ngOnChanges(): void {
    //getting the current user roles
    let currentUserRoles = this.prefill?.userRoles?.map((role) => {
      const roleInfo = {
        role: role.role?.id,
        active: role.active,
      };
      return roleInfo;
    });

    //finding student status based on existing user role, if none found, leave radio button blank
    let studentStatus = currentUserRoles?.find(
      (studentRole) => studentRole.role === 1
    );

    //finding adviser status based on existing user role, if none found, leave radio button blank
    let adviserStatus = currentUserRoles?.find(
      (adviserRole) => adviserRole.role === 3
    );

    //finding admin status based on existing user role, if none found, leave radio button blank
    let adminStatus = currentUserRoles?.find(
      (adminRole) => adminRole.role === 2
    );

    //creating role form
    this.newRoleForm = this._formBuilder.group({
      isStudent: [studentStatus?.active, [Validators.required]],
      isAdviser: [adviserStatus?.active, [Validators.required]],
      isAdmin: [adminStatus?.active, [Validators.required]],
    });
  }

  //input handler for the student radio button
  setStudentRole(status: boolean) {
    this.newRoleForm.value.isStudent = status;
    this.rolesEmpty = false;
  }

  //input handler for the adviser radio button
  setAdviserRole(status: boolean) {
    this.newRoleForm.value.isAdviser = status;
    this.rolesEmpty = false;
  }

  //input handler for the admin radio button
  setAdminRole(status: boolean) {
    this.newRoleForm.value.isAdmin = status;
    this.rolesEmpty = false;
  }

  onSubmit() {
    this.confirmationToastService.setConfirmationToastMessage({
      title: 'Role Update',
      message: 'Are you sure want to update the user role?',
      btnOkText: 'Yes',
      btnCancelText: 'No',
      show: true,
      confirmationResponse: (response: boolean) => {
        if (response) {
          this.readyToSubmit = true;
          this.success = false;

          //constructing the roles object based on the form values
          this.roles = {
            roles: [
              {
                role_id: 1,
                role_active: this.newRoleForm.value.isStudent,
              },
              {
                role_id: 2,
                role_active: this.newRoleForm.value.isAdmin,
              },
              {
                role_id: 3,
                role_active: this.newRoleForm.value.isAdviser,
              },
            ],
          };

          //making sure the roles object is in a format that backend is expecting
          if (this.roles.roles[0].role_active === null) {
            this.roles.roles[0].role_active = false;
          }
          if (this.roles.roles[1].role_active === null) {
            this.roles.roles[1].role_active = false;
          }
          if (this.roles.roles[2].role_active === null) {
            this.roles.roles[2].role_active = false;
          }

          if (
            this.roles.roles[0].role_active === false &&
            this.roles.roles[1].role_active === false &&
            this.roles.roles[2].role_active === false
          ) {
            this.rolesEmpty = true;
            this.readyToSubmit = false;
          }

          if (this.readyToSubmit) {
            this.sending = true;

            //updating the roles with the user service
            this.userService
              .updateUserRoles(this.roles, this.prefill?.id)
              .subscribe(
                () => {
                  this.sending = false;
                  this.success = true;
                  this.toastService.setToastMessage({
                    type: 'success',
                    title: 'User Roles Updated',
                    message:
                      'The user roles for this account have been updated.',
                    delay: 3000,
                  });
                  //retrieving the users to make sure the users are up-to-date
                  this.userService.getAllUsers(1, 10).subscribe();
                },
                (error) => {
                  this.success = false;
                  this.sending = false;
                  //error message
                  this.toastService.setToastMessage({
                    type: 'danger',
                    title: 'Error Editing User Roles',
                    message: 'There was an error editing the user roles.',
                    delay: 1000,
                  });
                }
              );
          } else {
            this.sending = false;
          }
        }
      },
    });
  }
}
