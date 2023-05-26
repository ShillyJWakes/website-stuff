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
import stateJson from '../../../../assets/states.json';

import { CoursesService } from '../../services/courses.service';
import { CourseModel } from '../../models/course.model';
import { UserRoleModel } from 'src/app/core/models/user-role.model';
import { ToastMessageService } from '../../services/toast-message.service';
import { ConfirmationToastService } from '../../services/confirmation-toast.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnChanges {
  submitted = false;
  sending = false;
  success = false;

  //input decorators that allow the sharing of data between parent and child components
  @Input() create = true;
  @Input() prefill: UserModel | undefined;

  states: { name: string; abbreviation: string }[] = stateJson;

  emailEmpty: Boolean | undefined;
  secondary_emailEmpty: Boolean | undefined;
  accessIdEmpty: Boolean | undefined;
  firstNameEmpty: Boolean | undefined;
  lastNameEmpty: Boolean | undefined;
  rolesEmpty: Boolean | undefined;

  readyToSubmit: Boolean | undefined;

  isStudent: Boolean | undefined = false;
  isAdviser: Boolean | undefined = false;
  isAdmin: Boolean | undefined = false;
  roles: any;
  @Output() formSubmitted: EventEmitter<boolean> = new EventEmitter();
  newUserForm: FormGroup = this._formBuilder.group({});
  newRoleForm: FormGroup = this._formBuilder.group({});

  constructor(
    private _formBuilder: FormBuilder,
    private userService: UsersService,
    private confirmationToastService: ConfirmationToastService,
    private toastService: ToastMessageService
  ) {}

  //determining if the role inputed from the form
  isThisStudent = (userRole: UserRoleModel) => userRole.role?.id === 1;

  isThisAdmin = (userRole: UserRoleModel) => userRole.role?.id === 2;

  isThisAdviser = (userRole: UserRoleModel) => userRole.role?.id === 3;

  ngOnChanges(): void {
    //building the form
    this.newUserForm = this._formBuilder.group({
      firstNameFormControl: [
        // can only be letters
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z]+$')],
      ],
      middleInFormControl: ['', [Validators.pattern('[a-zA-Z ]*')]],
      lastNameFormControl: [
        // can only be letters
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z]+$')],
      ],
      emailFormControl: [
        this.prefill?.email,
        [
          //must be in the form of an email
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      secondary_emailFormControl: [
        this.prefill?.secondary_email,
        [
          //must be in the form of an email
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      accessIDFormControl: [
        //must be in the form of an actual access ID
        this.prefill?.accessID,
        [Validators.required, Validators.pattern('^[a-z]{2}[0-9]{4}$')],
      ],
      phoneNumberFormControl: [
        //can only be numbers
        '',
        [Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
      ],
      linkedinFormControl: [this.prefill?.linkedin],
      addressFormControl: [this.prefill?.address],
      address2FormControl: [this.prefill?.address],
      cityFormControl: ['', [Validators.pattern('[a-zA-Z ]*')]],
      stateFormControl: ['', [Validators.pattern('[a-zA-Z ]*')]],
      zipCodeFormControl: ['', [Validators.pattern('^[0-9]{5}$')]],
      countryFormControl: ['', [Validators.pattern('[a-zA-Z ]*')]],
      isStudentFormControl: [false, [Validators.required]],
      isAdviserFormControl: [false, [Validators.required]],
      isAdminFormControl: [false, [Validators.required]],
    });
  }

  //input handler to set student from radio button
  setStudentRole(event: any) {
    this.isStudent = event;
    this.rolesEmpty = false;
  }

  //input handler to set student from radio button
  setAdviserRole(event: any) {
    this.isAdviser = event;
    this.rolesEmpty = false;
  }

  //input handler to set student from radio button
  setAdminRole(event: any) {
    this.isAdmin = event;
    this.rolesEmpty = false;
  }

  //submit function that fires when submit button is pressed
  onSubmit() {
    //if this form is being used to create a new user
    if (this.create) {
      this.readyToSubmit = true;
      this.sending = true;

      //verifying that the form elements are valid
      this.newUserForm.value.emailFormControl &&
      this.newUserForm.get('emailFormControl')?.valid
        ? (this.emailEmpty = false)
        : (this.emailEmpty = true);
      this.newUserForm.value.secondary_emailFormControl &&
      this.newUserForm.get('secondary_emailFormControl')?.valid
        ? (this.secondary_emailEmpty = false)
        : (this.emailEmpty = true);
      this.newUserForm.value.accessIDFormControl &&
      this.newUserForm.get('accessIDFormControl')?.valid
        ? (this.accessIdEmpty = false)
        : (this.accessIdEmpty = true);
      this.newUserForm.value.firstNameFormControl &&
      this.newUserForm.get('firstNameFormControl')?.valid
        ? (this.firstNameEmpty = false)
        : (this.firstNameEmpty = true);
      this.newUserForm.value.lastNameFormControl &&
      this.newUserForm.get('lastNameFormControl')?.valid
        ? (this.lastNameEmpty = false)
        : (this.lastNameEmpty = true);

      //if these form elements are invalid, dont send form
      if (
        this.emailEmpty ||
        this.secondary_emailEmpty ||
        this.accessIdEmpty ||
        this.firstNameEmpty ||
        this.lastNameEmpty ||
        !this.newUserForm.get('phoneNumberFormControl')?.valid
      ) {
        this.readyToSubmit = false;
      }

      this.roles = [];

      //creating roles array in order for role creation
      this.isStudent && this.roles.push({ role_id: 1 });
      this.isAdmin && this.roles.push({ role_id: 2 });
      this.isAdviser && this.roles.push({ role_id: 3 });

      if (this.roles.length === 0) {
        this.rolesEmpty = true;
        this.readyToSubmit = false;
      }

      //if the form elements on the form are invalid, dont send form
      if (this.newUserForm.valid == false) {
        this.readyToSubmit = false;
        this.sending = false;
      }

      if (this.readyToSubmit) {
        //creating a new user with the service
        this.userService
          .submitNewUser(
            this.newUserForm.value.firstNameFormControl,
            this.newUserForm.value.middleInFormControl,
            this.newUserForm.value.lastNameFormControl,
            this.newUserForm.value.countryFormControl,
            this.newUserForm.value.accessIDFormControl,
            this.newUserForm.value.addressFormControl,
            this.newUserForm.value.address2FormControl,
            this.newUserForm.value.cityFormControl,
            this.newUserForm.value.zipCodeFormControl,
            this.newUserForm.value.stateFormControl,
            this.newUserForm.value.emailFormControl,
            this.newUserForm.value.secondary_emailFormControl,
            this.newUserForm.value.linkedinFormControl,
            this.newUserForm.value.phoneNumberFormControl,
            this.roles,
            window.location.origin + '/login'
          )
          .subscribe(
            () => {
              this.formSubmitted.emit(true);
              this.success = true;
              this.sending = false;

              //confirmation message
              this.toastService.setToastMessage({
                type: 'success',
                title: 'User Created',
                message: 'The user account has been created.',
                delay: 3000,
              });

              //retrieving all the users to make sure the users in the existing user table are up to date
              this.userService.getAllUsers(1, 10).subscribe();
            },

            //error message
            (error) => {
              this.success = true;
              // this.sending = false;
              this.toastService.setToastMessage({
                type: 'danger',
                title: 'Error Making User',
                message:
                  'There was an error making the user. Please make sure the Access Id and Email are Unique',
                delay: 3000,
              });
            }
          );
      } else {
        // this.sending = false;
      }
    }
    //if this form is being used to update a user
    else if (this.create === false) {
      this.confirmationToastService.setConfirmationToastMessage({
        title: 'User Update',
        message: 'Are you sure want to update user information?',
        btnOkText: 'Yes',
        btnCancelText: 'No',
        show: true,
        confirmationResponse: (response: boolean) => {
          if (response) {
            this.readyToSubmit = true;

            //checking to see if the form elements are valid
            this.newUserForm.value.emailFormControl
              ? (this.emailEmpty = false)
              : (this.emailEmpty = true);
            this.newUserForm.value.secondary_emailFormControl
              ? (this.secondary_emailEmpty = false)
              : (this.secondary_emailEmpty = true);
            this.newUserForm.value.accessIDFormControl
              ? (this.accessIdEmpty = false)
              : (this.accessIdEmpty = true);

            this.newUserForm.get('emailFormControl')?.valid
              ? (this.emailEmpty = false)
              : (this.emailEmpty = true);
            this.newUserForm.value.accessIDFormControl &&
            this.newUserForm.get('accessIDFormControl')?.valid
              ? (this.accessIdEmpty = false)
              : (this.accessIdEmpty = true);

            if (this.emailEmpty == true || this.accessIdEmpty == true) {
              this.readyToSubmit = false;
            }
            if (this.readyToSubmit) {
              let userInfo = {
                access_id: this.newUserForm.value.accessIDFormControl,
                email: this.newUserForm.value.emailFormControl,
              };

              ///updating the user info with the user service
              this.userService.updateUser(userInfo, this.prefill?.id).subscribe(
                () => {
                  this.formSubmitted.emit(true);
                  this.success = true;
                  // this.sending = false;
                  this.toastService.setToastMessage({
                    type: 'success',
                    title: 'User Updated',
                    message: 'The user account has been updated.',
                    delay: 3000,
                  });
                  //retrieving all the users to make sure the users in the existing user table are up-to-date
                  this.userService.getAllUsers(1, 10).subscribe();
                },
                //error message
                (error) => {
                  this.success = false;
                  // this.sending = false;
                  this.toastService.setToastMessage({
                    type: 'danger',
                    title: 'Error Editing User',
                    message: 'There was an error editing the user.',
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
}
