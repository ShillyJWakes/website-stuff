import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { FilterInterface } from '../../core/models/filter.interface';
import {
  SpecializationCourseModel,
  SpecializationModel,
} from '../models/specialization.model';

@Injectable()
export class SpecializationService {
  private _allSpecializations$ = new BehaviorSubject<SpecializationModel[]>([]);
  public allSpecializations$ = this._allSpecializations$.asObservable();
  private _allSpecializationCourses$ = new BehaviorSubject<
    SpecializationCourseModel[]
  >([]);
  public allSpecializationsCourses$ =
    this._allSpecializationCourses$.asObservable();
  private _specialization$ = new BehaviorSubject<SpecializationModel>(
    new SpecializationModel(undefined)
  );
  public specialization$ = this._specialization$.asObservable();

  constructor(private http: HttpClient) {}

  public get allSpecializations(): SpecializationModel[] | undefined {
    return this._allSpecializations$.value;
  }

  public get allSpecializationCourses():
    | SpecializationCourseModel[]
    | undefined {
    return this._allSpecializationCourses$.value;
  }

  public get currentSpecialization(): SpecializationModel | undefined {
    return this._specialization$.value;
  }

  setAllSpecializations(specializations: any[]) {
    this._allSpecializations$.next(
      specializations.map(
        (specialization) => new SpecializationModel({ ...specialization })
      )
    );
  }

  setAllSpecializationCourses(specializationCourses: any[]) {
    this._allSpecializationCourses$.next(
      specializationCourses.map(
        (specializationCourse) =>
          new SpecializationCourseModel({ ...specializationCourse })
      )
    );
  }

  setCurrentSpecialization(specialization: SpecializationModel) {
    this._specialization$.next(specialization);
  }

  removeAllSpecializations() {
    this._allSpecializations$?.next([]);
  }

  removeAllSpecializationCourses() {
    this._allSpecializationCourses$?.next([]);
  }

  removeSpecialization() {
    this._specialization$?.next(new SpecializationModel(undefined));
  }

  getAllSpecializations(filter: FilterInterface): Observable<void> {
    return this.http
      .get<any>(
        `${environment.apiUrl}/specializations?filter=${JSON.stringify(
          filter.filter
        )}&order="${filter.order}"&page=${filter.page}&per_page=${
          filter.perPage
        }`
      )
      .pipe(
        map((response) => {
          this.setAllSpecializations(response);
        })
      );
  }

  getAllSpecializationCourses(filter: FilterInterface): Observable<void> {
    return this.http
      .get<any>(
        `${environment.apiUrl}/specialization-courses?filter=${JSON.stringify(
          filter.filter
        )}&order="${filter.order}"&page=${filter.page}&per_page=${
          filter.perPage
        }`
      )
      .pipe(
        map((response) => {
          this.setAllSpecializationCourses(response);
        })
      );
  }

  getSpecialization(id: number): Observable<void> {
    return this.http
      .get<any>(`${environment.apiUrl}/specialization/${id}`)
      .pipe(
        map((response) => {
          this.setCurrentSpecialization(
            new SpecializationModel({ ...response })
          );
        })
      );
  }

  submitNewSpecialization(
    specialization: SpecializationModel
  ): Observable<any> {
    const specializationObject = {
      specialization: specialization.specialization,
      course_types: specialization.courseTypes,
      courses: specialization.courses?.map((course) => ({
        course_type: course.courseType,
        course_id: course.course?.id,
      })),
      active: specialization.active,
    };
    return this.http.post<any>(
      `${environment.apiUrl}/specializations`,
      specializationObject
    );
  }

  editSpecialization(specialization: SpecializationModel): Observable<any> {
    const specializationObject = {
      id: specialization.id,
      specialization: specialization.specialization,
      course_types: specialization.courseTypes,
      active: specialization.active,
      courses: specialization.courses?.map((course) => ({
        course_type: course.courseType,
        course_id: course.course?.id,
      })),
    };
    return this.http.put<any>(
      `${environment.apiUrl}/specialization/${specialization.id}`,
      specializationObject
    );
  }

  submitNewSpecializationCourse(
    specializationCourse: SpecializationCourseModel
  ): Observable<any> {
    const specializationObject = {
      course_id: specializationCourse.course?.id,
      specialization_id: specializationCourse.specialization?.id,
      course_type: specializationCourse.courseType,
    };
    return this.http.post<any>(
      `${environment.apiUrl}/specialization-courses`,
      specializationObject
    );
  }

  editSpecializationCourse(
    specializationCourse: SpecializationCourseModel
  ): Observable<any> {
    const specializationObject = {
      course_type: specializationCourse.courseType,
    };
    return this.http.patch<any>(
      `${environment.apiUrl}/specialization-course/${specializationCourse.id}`,
      specializationObject
    );
  }

  deleteSpecialization(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/specialization/${id}`);
  }

  deleteSpecializationCourse(id: number): Observable<any> {
    return this.http.delete<any>(
      `${environment.apiUrl}/specialization-course/${id}`
    );
  }
}
