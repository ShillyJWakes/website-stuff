import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserRoleModel } from 'src/app/core/models/user-role.model';
import { UserModel } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { UsersService } from '../../services/users.service';

import stateJson from '../../../../assets/states.json';
import { ToastMessageService } from '../../services/toast-message.service';

@Component({
  selector: 'app-initial-reset-password-form',
  templateUrl: './initial-reset-password-form.component.html',
  styleUrls: ['./initial-reset-password-form.component.scss'],
})
export class InitialResetPasswordFormComponent implements OnInit {
  submitted = false;
  sending = false;
  success = false;
  @Input() create = true;
  @Input() prefill: UserModel | undefined;

  states: { name: string; abbreviation: string }[] = stateJson;

  passwordInvalid: Boolean | undefined;
  confirmPasswordInvalid: Boolean | undefined;
  differentPasswords: Boolean | undefined;
  address1Invalid: Boolean | undefined;
  addressInvalid: Boolean | undefined;
  canContinue: Boolean | undefined;
  cityInvalid: Boolean | undefined;
  stateInvalid: Boolean | undefined;
  zipCodeInvalid: Boolean | undefined;
  countryInvalid: Boolean | undefined;
  address2Invalid: Boolean | undefined;
  phoneNumberInvalid: Boolean | undefined;

  firstNameInvalid: Boolean | undefined;
  lastNameInvalid: Boolean | undefined;

  //used to determine if the user logging in is a student or not
  isThisStudent = (userRole: UserRoleModel) =>
    userRole.role?.id === 1 && userRole.active === true;

  isStudent: Boolean | undefined = false;

  currentUser: UserModel | undefined;

  readyToSubmit: Boolean | undefined;

  @Output() formSubmitted: EventEmitter<boolean> = new EventEmitter();
  newPasswordForm: FormGroup = this._formBuilder.group({});

  constructor(
    private _formBuilder: FormBuilder,
    private userService: UsersService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastMessageService
  ) {}
  ngOnInit(): void {
    //retrieving the current logged in user from the service
    this.authService.currentUser$.subscribe((currentUser) => {
      this.currentUser = currentUser;
    });
    //telling if the current user who is logged in is a student or not
    this.isStudent = this.authService.currentUserValue?.userRoles?.some(
      this.isThisStudent
    );
  }

  //used to reset the validation when the input fields experience changes
  resetPasswordField() {
    this.passwordInvalid = false;
    this.confirmPasswordInvalid = false;
    this.differentPasswords = false;
  }

  ngOnChanges(): void {
    //builiding the form
    //each form control handles the specific data inputed in the form
    this.newPasswordForm = this._formBuilder.group({
      //can only be letters
      firstNameFormControl: [
        this.prefill?.firstName,
        [Validators.required, Validators.pattern('^[a-zA-Z]+$')],
      ],
      //can only be letters
      middleInFormControl: [
        this.prefill?.middleIn,
        [Validators.pattern('[a-zA-Z ]*')],
      ],
      //can only be letters
      lastNameFormControl: [
        this.prefill?.lastName,
        [Validators.required, Validators.pattern('^[a-zA-Z]+$')],
      ],
      passwordFormControl: ['', [Validators.required]],
      confirmPasswordFormControl: ['', [Validators.required]],
      addressFormControl: ['', [Validators.required]],
      address2FormControl: [''],
      cityFormControl: [
        //can only be letters
        '',
        [Validators.required, Validators.pattern('[a-zA-Z ]*')],
      ],
      stateFormControl: ['', [Validators.required]],
      zipCodeFormControl: [
        //can only be numbers
        '',
        [Validators.required, Validators.pattern('^[0-9]{5}$')],
      ],
      countryFormControl: [
        //can only be letters
        '',
        [Validators.required, Validators.pattern('[a-zA-Z ]*')],
      ],
      phoneNumberFormControl: [
        //can only be numbers
        '',
        [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
      ],
    });
  }

  //function that handles the routing when the user's
  //creditionals have been entered and the user can continue to the rest of the website
  continueToSite() {
    this.router.navigate([
      this.authService.currentUserValue?.userRoles![0].role?.role,
    ]);
  }

  //submit function that is fired when the submit button is clicked
  onSubmit() {
    //setting default conditions
    this.readyToSubmit = true;
    this.sending = true;
    this.differentPasswords = false;

    //if there doesnt exists a value, mark the field as invalid
    this.newPasswordForm.value.firstNameFormControl
      ? (this.firstNameInvalid = false)
      : (this.firstNameInvalid = true);

    this.newPasswordForm.value.lastNameFormControl
      ? (this.lastNameInvalid = false)
      : (this.lastNameInvalid = true);

    this.newPasswordForm.value.passwordFormControl
      ? (this.passwordInvalid = false)
      : (this.passwordInvalid = true);

    this.newPasswordForm.value.confirmPasswordFormControl
      ? (this.confirmPasswordInvalid = false)
      : (this.confirmPasswordInvalid = true);

    this.newPasswordForm.value.addressFormControl
      ? (this.addressInvalid = false)
      : (this.addressInvalid = true);

    this.newPasswordForm.value.cityFormControl
      ? (this.cityInvalid = false)
      : (this.cityInvalid = true);

    this.newPasswordForm.value.stateFormControl
      ? (this.stateInvalid = false)
      : (this.stateInvalid = true);

    this.newPasswordForm.value.zipCodeFormControl
      ? (this.zipCodeInvalid = false)
      : (this.zipCodeInvalid = true);

    this.newPasswordForm.value.countryFormControl
      ? (this.countryInvalid = false)
      : (this.countryInvalid = true);

    this.newPasswordForm.value.phoneNumberFormControl
      ? (this.phoneNumberInvalid = false)
      : (this.phoneNumberInvalid = true);

    //if any of these values are invalid, then do not submit the form
    if (
      this.passwordInvalid ||
      this.confirmPasswordInvalid ||
      this.firstNameInvalid ||
      this.lastNameInvalid
    ) {
      this.readyToSubmit = false;
      this.sending = false;
    }

    //conditional validation based on if the user is a student or not
    if (this.isStudent) {
      if (
        this.addressInvalid ||
        this.cityInvalid ||
        this.stateInvalid ||
        this.zipCodeInvalid ||
        this.countryInvalid ||
        this.phoneNumberInvalid
      ) {
        this.readyToSubmit = false;
        this.sending = false;
      }
    }

    //checking for different passwords
    if (
      this.newPasswordForm.value.passwordFormControl !==
      this.newPasswordForm.value.confirmPasswordFormControl
    ) {
      this.differentPasswords = true;
    }

    if (this.differentPasswords) {
      this.readyToSubmit = false;
      this.sending = false;
    }

    if (this.isStudent) {
      if (this.newPasswordForm.valid == false) {
        this.readyToSubmit = false;
        this.sending = false;
      }
    } else {
      if (
        !this.newPasswordForm.get('firstNameFormControl')?.valid ||
        !this.newPasswordForm.get('lastNameFormControl')?.valid ||
        !this.newPasswordForm.get('middleInFormControl')?.valid
      ) {
        this.readyToSubmit = false;
        this.sending = false;
      }
    }

    //if the form is valid, then continue
    if (this.readyToSubmit) {
      //if the user is a student, then continue
      if (this.isStudent) {
        //sending the request to update the password
        this.userService
          .updateUserPassword(
            this.newPasswordForm.value.passwordFormControl,
            this.currentUser?.id
          )
          .subscribe();
        let userInfo = {
          first_name: this.newPasswordForm.value.firstNameFormControl,
          middle_name: this.newPasswordForm.value.middleInFormControl,
          last_name: this.newPasswordForm.value.lastNameFormControl,
          country: this.newPasswordForm.value.countryFormControl,
          address: this.newPasswordForm.value.addressFormControl,
          address2: this.newPasswordForm.value.address2FormControl,
          city: this.newPasswordForm.value.cityFormControl,
          zip_code: this.newPasswordForm.value.zipCodeFormControl,
          state: this.newPasswordForm.value.stateFormControl,
          telephone: this.newPasswordForm.value.phoneNumberFormControl,
        };
        //sending the request to update the user with the information from the form
        this.userService.updateUser(userInfo, this.currentUser?.id).subscribe(
          (result) => {
            this.formSubmitted.emit(true);

            //confirmation message
            this.toastService.setToastMessage({
              type: 'success',
              title: 'Information Reset!',
              message: 'Thank you! Redirecting you to the site...',
              delay: 5000,
            });

            //setting the user with the new credentials
            this.authService.setUser({
              ...result,
              token: this.currentUser?.token,
            });

            //taking the user to the landing page
            this.router.navigate([
              this.authService.currentUserValue?.userRoles![0].role?.role,
            ]);
          },
          (error) => {
            //error message
            this.toastService.setToastMessage({
              type: 'danger',
              title: 'Information not reset',
              message: 'There was an error trying to reset your information.',
              delay: 5000,
            });
          }
        );
      }
      //if the user is not a student
      else {
        //send request to update password
        this.userService
          .updateUserPassword(
            this.newPasswordForm.value.passwordFormControl,
            this.currentUser?.id
          )
          .subscribe(
            (result) => {
              this.canContinue = true;
            },
            (error) => {
              this.sending = false;
              this.toastService.setToastMessage({
                type: 'danger',
                title: 'Password not reset',
                message: 'There was an error trying to reset your password.',
                delay: 5000,
              });
            }
          );
        let userInfo = {
          first_name: this.newPasswordForm.value.firstNameFormControl,
          middle_name: this.newPasswordForm.value.middleInFormControl,
          last_name: this.newPasswordForm.value.lastNameFormControl,
        };
        //send request to update user information
        this.userService.updateUser(userInfo, this.currentUser?.id).subscribe(
          (result) => {
            this.formSubmitted.emit(true);

            //confirmation message
            this.toastService.setToastMessage({
              type: 'success',
              title: 'Information Reset!',
              message: 'Thank you! Redirecting you to the site...',
              delay: 5000,
            });

            //setting the user with the new credentials
            this.authService.setUser({
              ...result,
              token: this.currentUser?.token,
            });

            //taking the user to the landing page
            this.router.navigate([
              this.authService.currentUserValue?.userRoles![0].role?.role,
            ]);
          },
          (error) => {
            //error message
            this.toastService.setToastMessage({
              type: 'danger',
              title: 'Information not reset',
              message: 'There was an error trying to reset your information.',
              delay: 5000,
            });
          }
        );
      }
    }
  }
}
