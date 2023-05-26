import { CourseModel } from './course.model';
import { TermCourseModel } from './term.model';
import { UserRoleModel } from '../../core/models/user-role.model';

export class CompletedCourseModel {
  id: number | undefined;
  termCourse: TermCourseModel | undefined;
  student: UserRoleModel | undefined;
  grade: GradeModel | undefined;
  courseType: string | undefined;
  powCourseId: number | undefined;

  constructor(completedCourseModel: { [key: string]: any } | undefined) {
    this.id = completedCourseModel?.id;
    this.termCourse = new TermCourseModel({
      ...completedCourseModel?.term_course,
    });
    this.student = new UserRoleModel({ ...completedCourseModel?.student });
    this.grade = new GradeModel({ ...completedCourseModel?.grade });
    this.courseType = completedCourseModel?.course_type;
    this.powCourseId = completedCourseModel?.pow_course_id;
  }
}

export class GradeModel {
  id: number | undefined;
  weight: number | undefined;
  grade: string | undefined;
  description: string | undefined;
  active: boolean | undefined;

  constructor(gradeModel: { [key: string]: any } | undefined) {
    this.id = gradeModel?.id;
    this.weight = gradeModel?.weight;
    this.grade = gradeModel?.grade;
    this.description = gradeModel?.description;
    this.active = gradeModel?.active;
  }
}
