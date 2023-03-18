import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { first } from 'rxjs/operators';
import { ToastMessageService } from '../../../shared/services/toast-message.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  passwordView = false;
  newPasswordForm: FormGroup = this.formBuilder.group(
    {
      password: ['', (Validators.required, Validators.minLength(6))],
      confirmPassword: ['', Validators.required],
    },
    {
      validator: this.ConfirmedValidator('password', 'confirmPassword'),
    }
  );
  loading = false;
  submitted = false;
  email: string | undefined;
  token: string | undefined;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastMessageService: ToastMessageService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'];
      this.token = params['token'];
    });
  }

  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors.confirmedValidator
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  get forgotPasswordControl() {
    return this.newPasswordForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.newPasswordForm.invalid) {
      return;
    }

    this.loading = true;
    if (typeof this.email === 'string') {
      this.authService
        .newPassword(this.email, this.forgotPasswordControl?.password.value)
        .pipe(first())
        .subscribe(
          () => {
            this.loading = false;
            this.toastMessageService.setToastMessage({
              delay: 3000,
              title: 'Successfully',
              type: 'success',
              message: 'Successfully updated your password.',
            });

            setTimeout(() => {
              this.router.navigate(['login']);
            }, 1000);
          },
          () => {
            this.loading = false;
          }
        );
    }
  }
}
