import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CourseModel } from '../models/course.model';
import { FilterInterface } from '../../core/models/filter.interface';

@Injectable()
export class CoursesService {
  private _allCourses$ = new BehaviorSubject<CourseModel[]>([]);
  public allCourses$ = this._allCourses$.asObservable();

  private _course$ = new BehaviorSubject<CourseModel>(
    new CourseModel(undefined)
  );
  public course$ = this._course$.asObservable();

  constructor(private http: HttpClient) {}

  public get allCourses(): CourseModel[] | undefined {
    return this._allCourses$.value;
  }

  setCourse(course: any) {
    this._course$.next(new CourseModel({ ...course }));
  }

  setAllCourses(courses: any[]) {
    this._allCourses$.next(
      courses.map((course) => new CourseModel({ ...course }))
    );
  }

  removeAllCourses() {
    this._allCourses$?.next([]);
  }

  reloadCourses(filter: FilterInterface) {
    this.getAllCourses(filter);
    this.removeAllCourses();
  }

  getAllCourses(filter: FilterInterface): Observable<void> {
    const filterParams = {
      params: {
        filter: JSON.stringify(filter.filter),
        order: 'course_profile asc',
        page: 1,
        per_page: 10,
      },
    };
    return this.http
      .get<any>(
        `${environment.apiUrl}/courses?filter=${JSON.stringify(
          filter.filter
        )}&order="${filter.order}"&page=${filter.page}&per_page=${
          filter.perPage
        }`
      )
      .pipe(
        map((response) => {
          this.setAllCourses(response);
        })
      );
  }

  getCourse(id: number): Observable<void> {
    return this.http.get<any>(`${environment.apiUrl}/course/${id}`).pipe(
      map((response) => {
        this.setCourse(response);
      })
    );
  }

  submitNewCourse(
    title: string,
    credits: any,
    courseNumber: string,
    desc: string,
    dept: string,
    active: boolean,
    coReqs: any[],
    preReqs: any[]
  ): Observable<any> {
    const courseObject = {
      course_profile: title,
      number_of_credits: credits,
      course_description: desc,
      course_number: courseNumber,
      department: dept,
      active: active,
      requisite_parent: [
        ...(coReqs!.map((req) => ({
          req_type: 'co',
          child_course_id: req.id,
        }))! || []),
        ...(preReqs!.map((req) => ({
          req_type: 'pre',
          child_course_id: req.id,
        }))! || []),
      ],
    };
    return this.http.post<any>(`${environment.apiUrl}/courses`, courseObject);
  }

  editCourse(
    course: CourseModel,
    coReqs: any[] = [],
    preReqs: any[] = []
  ): Observable<any> {
    const courseObject = {
      id: course.id,
      course_profile: course.courseProfile,
      number_of_credits: course.numberOfCredits,
      course_description: course.courseDescription,
      course_number: course.courseNumber,
      department: course.department,
      active: course.active,
      requisite_parent: [
        ...coReqs.map((req) => ({
          req_type: 'co',
          child_course_id: req.id,
          parent_course_id: course.id,
        })),
        ...preReqs.map((req) => ({
          req_type: 'pre',
          child_course_id: req.id,
          parent_course_id: course.id,
        })),
      ],
    };
    return this.http.patch<any>(
      `${environment.apiUrl}/course/${course.id}`,
      courseObject
    );
  }

  deleteCourse(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/course/${id}`);
  }
}
