import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { first } from 'rxjs/operators';
import { ToastMessageService } from '../../shared/services/toast-message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isForgotPasswordView = false;
  passwordView = false;
  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  loading = false;
  submitted = false;
  returnUrl: string | undefined;
  showError: boolean = false;
  timeOutMessage: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastMessageService: ToastMessageService
  ) {}

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'role';
    this.timeOutMessage = this.route.snapshot.queryParams['timeOut'];
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;

    if (this.isForgotPasswordView) {
      const newPasswordPageUrl =
        window.location.origin + '/login/forgot_password';
      this.authService
        .forgotPassword(this.f?.email.value, newPasswordPageUrl)
        .pipe(first())
        .subscribe(
          () => {
            this.loading = false;
            this.toastMessageService.setToastMessage({
              delay: 3000,
              title: 'Successfully',
              type: 'success',
              message: 'New Password link has sent to email',
            });
            this.isForgotPasswordView = false;
          },
          () => {
            this.showError = true;
            this.loading = false;
          }
        );
    } else {
      this.authService
        .login(this.f?.email.value, this.f?.password.value)
        .pipe(first())
        .subscribe(
          (result) => {
            if (
              this.returnUrl === 'role' &&
              this.authService.currentUserValue?.active
            ) {
              this.router.navigate([
                this.authService.currentUserValue?.userRoles![0].role?.role,
              ]);
            } else if (this.authService.currentUserValue?.active == false) {
              this.router.navigate(['login/reset_password']);
            } else {
              this.router.navigate([this.returnUrl]);
            }
          },
          () => {
            this.showError = true;
            this.loading = false;
          }
        );
    }
  }

  openForgotPasswordPage() {
    this.isForgotPasswordView = true;
  }
}
