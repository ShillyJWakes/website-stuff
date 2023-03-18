import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserModel } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _currentUser$ = new BehaviorSubject<UserModel>(
    new UserModel(undefined)
  );
  public currentUser$ = this._currentUser$.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUser();
  }

  public get currentUserValue(): UserModel | undefined {
    return this._currentUser$?.value;
  }

  setUser(user: { [key: string]: any }) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this._currentUser$?.next(new UserModel({ ...user }));
  }

  loadUser() {
    const user = new UserModel(
      JSON.parse(<string>localStorage.getItem('currentUser'))
    );
    this._currentUser$?.next(user);
  }

  clearUser() {
    localStorage.removeItem('currentUser');
    this._currentUser$?.next(new UserModel(undefined));
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        map((response) => {
          this.setUser({ ...response.user, token: response.token });
        })
      );
  }

  logout(timeOut: boolean = false) {
    // remove user from local storage and set current user to null
    this.clearUser();
    if (timeOut) {
      this.router.navigate(['/login'], { queryParams: { timeOut: true } });
    } else {
      this.router.navigate(['/login']);
    }
  }

  forgotPassword(email: string, return_url: string): Observable<void> {
    return this.http
      .post<any>(`${environment.apiUrl}/auth/forgot-password`, {
        email,
        return_url,
      })
      .pipe(map((response) => {}));
  }
  newPassword(email: string, password: string): Observable<void> {
    return this.http
      .post<any>(`${environment.apiUrl}/auth/update-password`, {
        email,
        password,
      })
      .pipe(map((response) => {}));
  }
}
