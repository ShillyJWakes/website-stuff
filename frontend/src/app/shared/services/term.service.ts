import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CourseModel } from '../models/course.model';
import { FilterInterface } from '../../core/models/filter.interface';
import {
  SpecializationCourseModel,
  SpecializationModel,
} from '../models/specialization.model';
import { TermCourseModel, TermModel } from '../models/term.model';
import * as dayjs from 'dayjs';

@Injectable()
export class TermService {
  private _allTerms$ = new BehaviorSubject<TermModel[]>([]);
  public allTerms$ = this._allTerms$.asObservable();
  private _allTermCourses$ = new BehaviorSubject<TermCourseModel[]>([]);
  public allTermCourses$ = this._allTermCourses$.asObservable();
  private _term$ = new BehaviorSubject<TermModel>(new TermModel(undefined));
  public term$ = this._term$.asObservable();

  constructor(private http: HttpClient) {}

  public get allTerms(): TermModel[] | undefined {
    return this._allTerms$.value;
  }

  public get allTermCourses(): TermCourseModel[] | undefined {
    return this._allTermCourses$.value;
  }

  public get currentTerm(): TermModel | undefined {
    return this._term$.value;
  }

  setAllTerms(terms: any[]) {
    this._allTerms$.next(terms.map((term) => new TermModel({ ...term })));
  }

  setAllTermCourses(termCourses: any[]) {
    this._allTermCourses$.next(
      termCourses.map((termCourse) => new TermCourseModel({ ...termCourse }))
    );
  }

  setCurrentTerm(term: TermModel) {
    this._term$.next(term);
  }

  removeAllTerms() {
    this._allTerms$?.next([]);
  }

  removeAllTermCourses() {
    this._allTermCourses$?.next([]);
  }

  removeTerm() {
    this._term$?.next(new TermModel(undefined));
  }

  getAllTerms(filter: FilterInterface): Observable<void> {
    return this.http
      .get<any>(
        `${environment.apiUrl}/terms?filter=${JSON.stringify(
          filter.filter
        )}&order="${filter.order}"&page=${filter.page}&per_page=${
          filter.perPage
        }`
      )
      .pipe(
        map((response) => {
          this.setAllTerms(response);
        })
      );
  }

  getAllTermCourses(filter: FilterInterface): Observable<void> {
    return this.http
      .get<any>(
        `${environment.apiUrl}/term-courses?filter=${JSON.stringify(
          filter.filter
        )}&order="${filter.order}"&page=${filter.page}&per_page=${
          filter.perPage
        }`
      )
      .pipe(
        map((response) => {
          this.setAllTermCourses(response);
        })
      );
  }

  getTerm(id: number): Observable<void> {
    return this.http.get<any>(`${environment.apiUrl}/term/${id}`).pipe(
      map((response) => {
        this.setCurrentTerm(new TermModel({ ...response }));
      })
    );
  }

  submitNewTerm(term: TermModel): Observable<any> {
    const termObject = {
      term_name: term.termName,
      active: term.active,
      term_start: dayjs(term.startDate).toDate(),
      first_day_class: dayjs(term.firstDayClass).toDate(),
      term_end: dayjs(term.endDate).toDate(),
      term_courses: term.termCourses?.map((termCourse) => ({
        course_id: termCourse.course?.id,
      })),
    };
    return this.http.post<any>(`${environment.apiUrl}/terms`, termObject);
  }

  editTerm(term: TermModel): Observable<any> {
    const termObject = {
      term_name: term.termName,
      active: term.active,
      term_start: dayjs(term.startDate).toDate(),
      first_day_class: dayjs(term.firstDayClass).toDate(),
      term_end: dayjs(term.endDate).toDate(),
    };
    return this.http.patch<any>(
      `${environment.apiUrl}/term/${term.id}`,
      termObject
    );
  }

  submitNewTermCourses(
    termCourses: TermCourseModel[],
    term: number
  ): Observable<any> {
    const termCourseObject = termCourses.map((termCourse) => ({
      course_id: termCourse.course?.id,
      term_id: term,
    }));

    return this.http.post<any>(
      `${environment.apiUrl}/term-course-update/${term}`,
      termCourseObject
    );
  }

  deleteTerm(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/term/${id}`);
  }

  deleteTermCourse(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/term-course/${id}`);
  }
}
