import { CourseModel } from './course.model';

export class TermModel {
  id: number | undefined;
  termName: string | undefined;
  active: boolean = false;
  termCourses: TermCourseModel[] | undefined;
  startDate: Date | undefined;
  endDate: Date | undefined;

  constructor(termModel: { [key: string]: any } | undefined) {
    this.id = termModel?.id;
    this.termName = termModel?.term_name;
    this.active = termModel?.active;
    this.termCourses = termModel?.term_courses?.map(
      (course: { [key: string]: any } | undefined) =>
        new TermCourseModel({ ...course })
    );
    this.startDate = new Date(termModel?.term_start);
    this.endDate = new Date(termModel?.term_end);
  }
}

export class TermCourseModel {
  id: number | undefined;
  term: TermModel | undefined;
  course: CourseModel | undefined;

  constructor(termCourseModel: { [key: string]: any } | undefined) {
    this.id = termCourseModel?.id;
    this.term = new TermModel({ ...termCourseModel?.term });
    this.course = new CourseModel({ ...termCourseModel?.course });
  }
}
