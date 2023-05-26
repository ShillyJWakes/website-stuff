import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { CourseModel } from '../models/course.model';
import { UserModel } from '../../core/models/user.model';
import { __values } from 'tslib';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private _allUsers$ = new BehaviorSubject<UserModel[]>([]);
  public allUsers$ = this._allUsers$.asObservable();
  private _singleUser$ = new BehaviorSubject<UserModel[]>([]);
  public singleUser$ = this._singleUser$.asObservable();

  constructor(private http: HttpClient) {}

  setAllUsers(users: UserModel[]) {
    this._allUsers$.next(users.map((user) => new UserModel({ ...user })));
  }

  //API call that gets users from the database
  getAllUsers(page: number, perPage: number): Observable<void> {
    return this.http
      .get<any>(
        `${environment.apiUrl}/users?filter={}&order="first_name asc"&page=${page}&per_page=${perPage}`
      )
      .pipe(
        map((response) => {
          this.setAllUsers(response);
        })
      );
  }

  //Update user API call
  updateUser(
    user: { [p: string]: any },
    id: number | undefined
  ): Observable<any> {
    return this.http.patch<any>(`${environment.apiUrl}/user/${id}`, user);
  }

  //Setting the user in the service so it can be subscribed to
  setSingleUser(users: UserModel[]) {
    this._singleUser$.next(users.map((user) => new UserModel({ ...user })));
  }

  //API call for getting a single user
  getSingleUser(
    page: number,
    perPage: number,
    firstName: string,
    lastName: string
  ): Observable<void> {
    return this.http
      .get<any>(
        `${environment.apiUrl}/users?filter={"first_name":"${firstName}"}&order=""&page=${page}&per_page=${perPage}`
      )
      .pipe(
        map((response) => {
          this.setSingleUser(response);
        })
      );
  }

  //API call to handle the csv upload request
  uploadCsvFile(myFile: File): Observable<void> {
    const fd = new FormData();

    //appending the file and website url to the form data
    fd.append('file', myFile, myFile.name);
    fd.append('url', window.location.origin + '/login');
    return this.http
      .post<any>(`${environment.apiUrl}/upload_users`, fd)
      .pipe(map((response) => {}));
  }

  //API call that creates a new user
  submitNewUser(
    first_name: string,
    middle_In: string,
    last_name: string,
    country: string,
    access_id: string,
    address: string,
    address2: string,
    city: string,
    zip_code: string,
    state: string,
    email: string,
    secondary_email: string,
    linkedin: string,
    telephone: string,
    roles: any[],
    url: string
  ): Observable<any> {
    const userObject = {
      first_name: first_name,
      middle_name: middle_In,
      last_name: last_name,
      country: country,
      access_id: access_id,
      address: address,
      address2: address2,
      city: city,
      active: false,
      zip_code: zip_code,
      state: state,
      email: email,
      secondary_email: secondary_email,
      linkedin: linkedin,
      telephone: telephone,
      roles: roles,
      url: url,
    };
    return this.http.post<any>(`${environment.apiUrl}/users`, userObject);
  }

  //API call that updates the user roles based on user id
  updateUserRoles(roles: any, id: number | undefined): Observable<any> {
    return this.http.patch<any>(`${environment.apiUrl}/user_role/${id}`, roles);
  }

  //API call that updates the user's password
  updateUserPassword(
    password: string | undefined,
    id: number | undefined
  ): Observable<any> {
    const passwordObject = {
      password: password,
      active: true,
    };
    return this.http.patch<any>(
      `${environment.apiUrl}/user_password/${id}`,
      passwordObject
    );
  }
}
