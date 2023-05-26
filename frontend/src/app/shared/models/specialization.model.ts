import { CourseModel } from './course.model';

export class SpecializationModel {
  id: number | undefined;
  specialization: string | undefined;
  active: boolean | undefined;
  courseTypes:
    | {
        allow_addition?: boolean;
        course_type?: string;
        credits?: any;
        courses?: any[];
      }[]
    | undefined;
  courses: SpecializationCourseModel[] | undefined;

  constructor(specializationModel: { [key: string]: any } | undefined) {
    this.id = specializationModel?.id;
    this.specialization = specializationModel?.specialization;
    this.courseTypes = specializationModel?.course_types;
    this.courses = specializationModel?.courses?.map(
      (course: { [key: string]: any } | undefined) =>
        new SpecializationCourseModel({ ...course })
    );
    this.active = specializationModel?.active;
  }
}

export class SpecializationCourseModel {
  id: number | undefined;
  course: CourseModel | undefined;
  specialization: SpecializationModel | undefined;
  courseType: string | undefined;

  constructor(specializationCourseModel: { [key: string]: any } | undefined) {
    this.id = specializationCourseModel?.id;
    this.course = new CourseModel({ ...specializationCourseModel?.course });
    this.specialization = new SpecializationModel({
      ...specializationCourseModel?.specialization,
    });
    this.courseType = specializationCourseModel?.course_type;
  }
}
