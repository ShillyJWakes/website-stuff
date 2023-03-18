import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CompletedCourseModel } from '../models/completed-course.model';

@Injectable()
export class CompletedCourseService {
  constructor(private http: HttpClient) {}

  submitCompletedCourse(
    courseId: number,
    termId: number,
    gradeId: number,
    studentId: number
  ) {
    const courseObject = {
      course_id: courseId,
      term_id: termId,
      grade_id: gradeId,
      student_id: studentId,
    };
    return this.http.post<any>(
      `${environment.apiUrl}/completed-courses`,
      courseObject
    );
  }

  getCompletedPowCourses(
    id: number | undefined
  ): Observable<CompletedCourseModel[]> {
    return this.http
      .get<any>(`${environment.apiUrl}/pow-completed-courses/${id}`)
      .pipe(
        map((response) => {
          console.log(response);
          return response.map((course: any) => {
            return new CompletedCourseModel({
              pow_course_id: course.pow_course_id,
              term_course: {
                term: {
                  id: course.completed_term_id
                    ? course.completed_term_id
                    : course.planned_term_id,
                  term_name: course.completed_term
                    ? course.completed_term
                    : course.planned_term,
                },
                course: {
                  id: course.course_id,
                  course_profile: course.course_name,
                  course_number: course.course,
                  department: course.department,
                  number_of_credits: course.credits,
                },
              },
              grade: {
                id: course.grade_id,
                grade: course.grade,
              },
              course_type: course.course_type,
            });
          });
        })
      );
  }
}
