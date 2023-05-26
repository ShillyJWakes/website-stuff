import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { GradeModel } from '../models/completed-course.model';

@Injectable()
export class GradeService {
  private _allGrades$ = new BehaviorSubject<GradeModel[]>([]);
  public allGrades$ = this._allGrades$.asObservable();

  constructor(private http: HttpClient) {}

  public get allGrades(): GradeModel[] | undefined {
    return this._allGrades$.value;
  }

  setAllGrades(grades: any[]) {
    this._allGrades$.next(grades.map((grade) => new GradeModel({ ...grade })));
  }

  removeAllTerms() {
    this._allGrades$?.next([]);
  }

  getAllGrades(active: boolean): Observable<void> {
    return this.http
      .get<any>(`${environment.apiUrl}/grades?active=${active}`)
      .pipe(
        map((response) => {
          this.setAllGrades(response);
        })
      );
  }

  submitNewGrade(grade: GradeModel): Observable<any> {
    const gradeObject = {
      weight: grade.weight,
      grade: grade.grade,
      description: grade.description,
      active: grade.active,
    };
    return this.http.post<any>(`${environment.apiUrl}/grades`, gradeObject);
  }

  editGrade(grade: GradeModel): Observable<any> {
    const gradeObject = {
      weight: grade.weight,
      grade: grade.grade,
      description: grade.description,
      active: grade.active,
    };
    return this.http.patch<any>(
      `${environment.apiUrl}/grade/${grade.id}`,
      gradeObject
    );
  }

  deleteGrade(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/grade/${id}`);
  }
}
