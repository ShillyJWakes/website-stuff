import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  NewPowCourseInterface,
  PowCourseModel,
  PowModel,
} from '../models/pow.model';
import { FilterInterface } from '../../core/models/filter.interface';

@Injectable()
export class PowService {
  static currentPow$: any;
  private _allPows$ = new BehaviorSubject<PowModel[]>([]);
  public allPows$ = this._allPows$.asObservable();
  public allPowCourses$ = this._allPows$.asObservable();
  private _allPowCourses$ = new BehaviorSubject<PowCourseModel[]>([]);
  private _currentPow$ = new BehaviorSubject<PowModel>(new PowModel(undefined));
  public currentPow$ = this._currentPow$.asObservable();
  private _newPowCourses$ = new BehaviorSubject<NewPowCourseInterface[]>([]);
  public newPowCourses$ = this._newPowCourses$.asObservable();

  constructor(private http: HttpClient) {}

  public get allPows(): PowModel[] | undefined {
    return this._allPows$.value;
  }

  public get allPowCourses(): PowCourseModel[] | undefined {
    return this._allPowCourses$.value;
  }

  public get currentPow(): PowModel | undefined {
    return this._currentPow$.value;
  }

  public get newPowCourses(): NewPowCourseInterface[] | undefined {
    return this._newPowCourses$.value;
  }

  setNewPowCourses(courses: NewPowCourseInterface[]) {
    this._newPowCourses$.next(courses);
  }

  setAllPows(pows: any[]) {
    this._allPows$.next(pows.map((pow) => new PowModel({ ...pow })));
  }

  setAllPowCourses(courses: any[]) {
    this._allPowCourses$.next(
      courses.map((course) => new PowCourseModel({ ...course }))
    );
  }

  setCurrentPow(pow: PowModel) {
    this._currentPow$.next(new PowModel({ ...pow }));
  }

  removeAllPows() {
    this._allPows$?.next([]);
  }

  removePowCourses() {
    this._allPowCourses$?.next([]);
  }

  removeCurrentPow() {
    this._currentPow$?.next(new PowModel(undefined));
  }

  getAllPows(filter: FilterInterface): Observable<any> {
    return this.http
      .get<any>(
        `${environment.apiUrl}/pows?filter=${JSON.stringify(
          filter.filter
        )}&order="${filter.order}"&page=${filter.page}&per_page=${
          filter.perPage
        }`
      )
      .pipe(
        map((response) => {
          this.setAllPows(response);
        })
      );
  }

  getAllPowCourses(filter: FilterInterface): Observable<void> {
    return this.http
      .get<any>(
        `${environment.apiUrl}/pow-courses?filter=${JSON.stringify(
          filter.filter
        )}&order="${filter.order}"&page=${filter.page}&per_page=${
          filter.perPage
        }`
      )
      .pipe(
        map((response) => {
          this.setAllPowCourses(response);
        })
      );
  }

  getPow(id: number): Observable<void> {
    return this.http.get<any>(`${environment.apiUrl}/pow/${id}`).pipe(
      map((response) => {
        this.setCurrentPow(response);
      })
    );
  }

  submitNewPow(newPow: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/pows`, newPow);
  }

  editPow(newPow: PowModel | undefined): Observable<any> {
    const powObject = {
      ...(newPow?.student?.id !== undefined && {
        student_id: newPow?.student?.id,
      }),
      ...(newPow?.specialization?.id !== undefined && {
        specialization_id: newPow?.specialization?.id,
      }),
      ...(newPow?.candidacyApproval?.id !== undefined && {
        candidacy_approved_by_id: newPow?.candidacyApproval?.id,
      }),
      ...(newPow?.candidacyApprovalDate !== undefined && {
        candidacy_approval_date: newPow?.candidacyApprovalDate,
      }),
      ...(newPow?.graduationApproval?.id !== undefined && {
        graduation_approved_by_id: newPow?.graduationApproval?.id,
      }),
      ...(newPow?.graduationApprovalDate !== undefined && {
        graduation_approval_date: newPow?.graduationApprovalDate,
      }),
      ...(newPow?.orientationTerm?.id !== undefined && {
        orientation_term_id: newPow?.orientationTerm?.id,
      }),
      ...(newPow?.firstClassTerm?.id !== undefined && {
        first_class_term_id: newPow?.firstClassTerm?.id,
      }),
      ...(newPow?.completionDate !== undefined && {
        completion_date: newPow?.completionDate,
      }),
      ...(newPow?.status !== undefined && {
        status: newPow?.status,
      }),
    };
    return this.http.patch<any>(
      `${environment.apiUrl}/pow/${newPow?.id}`,
      powObject
    );
  }

  addCourseToPow(
    courseId: number,
    powId: number,
    termId: number | null,
    courseType: string
  ): Observable<any> {
    const powCourseObject = {
      course_id: courseId,
      pow_id: powId,
      term_id: termId,
      course_type: courseType,
    };
    return this.http.post<any>(
      `${environment.apiUrl}/pow-courses`,
      powCourseObject
    );
  }

  editPowCourse(powCourseId: number, termId: number) {
    const powCourseObject = {
      term_id: termId,
    };
    return this.http.patch<any>(
      `${environment.apiUrl}/pow-course/${powCourseId}`,
      powCourseObject
    );
  }

  removePowCourse(id: number) {
    return this.http.delete<any>(`${environment.apiUrl}/pow-course/${id}`);
  }

  deletePow(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/pow/${id}`);
  }

  getActivePow(studentId: number | undefined) {
    return this.http
      .get<any>(`${environment.apiUrl}/active-pow/${studentId}`)
      .pipe(
        map((response) => {
          this.setCurrentPow(response);
        })
      );
  }

  removePowCourseByCourse(id: number) {
    return this.http.delete<any>(
      `${environment.apiUrl}/pow-course-by-course/${id}`
    );
  }
}
