import { PowCourseModel } from './pow.model';

export class CourseModel {
  id: number | undefined;
  courseProfile: string | undefined;
  numberOfCredits: number | undefined;
  courseDescription: string | undefined;
  courseNumber: string | undefined;
  department: string | undefined;
  active: boolean | undefined;
  masterScheduleCode: number | undefined;
  requisites: RequisiteModel[] | undefined;

  constructor(courseModel: { [key: string]: any } | undefined) {
    this.id = courseModel?.id;
    this.courseProfile = courseModel?.course_profile;
    this.numberOfCredits = courseModel?.number_of_credits;
    this.courseDescription = courseModel?.course_description;
    this.courseNumber = courseModel?.course_number;
    this.department = courseModel?.department;
    this.active = courseModel?.active;
    this.masterScheduleCode = courseModel?.ms_code;
    this.requisites = courseModel?.requisite_parent?.map(
      (course: { [key: string]: any } | undefined) =>
        new RequisiteModel({ ...course })
    );
  }
}

type ReqType = 'co' | 'pre';

export class RequisiteModel {
  id: number | undefined;
  parentCourse: CourseModel | undefined;
  childCourse: CourseModel | undefined;
  reqType: ReqType | undefined;

  constructor(requisite: { [key: string]: any } | undefined) {
    this.id = requisite?.id;
    this.parentCourse = new CourseModel({ ...requisite?.parent_course });
    this.childCourse = new CourseModel({ ...requisite?.child_course });
    this.reqType = requisite?.req_type;
  }
}
