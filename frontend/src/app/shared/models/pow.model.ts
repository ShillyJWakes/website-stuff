import { CourseModel } from './course.model';
import { UserRoleModel } from '../../core/models/user-role.model';
import { TermModel } from './term.model';
import { SpecializationModel } from './specialization.model';
import { CompletedCourseModel } from './completed-course.model';

export interface NewPowCourseInterface {
  course_id?: number;
  term_id?: number | null;
  course_type?: string;
  credits?: any;
}

type PowStatus =
  | 'Void'
  | 'Active'
  | 'Pending Approval'
  | 'POW Approved'
  | 'POW Rejected'
  | 'Pending Graduation'
  | 'Graduation Approved'
  | 'Graduation Rejected'
  | 'Graduated';

export class PowModel {
  id: number | undefined;
  student: UserRoleModel | undefined;
  creationDate: Date | undefined;
  petitionDate: Date | undefined;
  candidacyApproval: UserRoleModel | undefined;
  candidacyApprovalDate: Date | undefined;
  graduationApproval: UserRoleModel | undefined;
  graduationApprovalDate: Date | undefined;
  status: PowStatus | undefined;
  powCourses: PowCourseModel[] | undefined;
  specialization: SpecializationModel | undefined;
  orientationTerm: TermModel | undefined;
  firstClassTerm: TermModel | undefined;
  completionDate: Date | undefined;
  completedCourses: CompletedCourseModel[] | undefined;

  constructor(powModel: { [key: string]: any } | undefined) {
    this.id = powModel?.id;
    this.student = new UserRoleModel({ ...powModel?.student });
    this.petitionDate =
      powModel?.petition_date != null
        ? new Date(powModel?.petition_date)
        : undefined;
    this.creationDate =
      powModel?.creation_date != null
        ? new Date(powModel?.creation_date)
        : undefined;
    this.candidacyApproval = new UserRoleModel({
      ...powModel?.candidacy_approved_by,
    });
    this.candidacyApprovalDate =
      powModel?.candidacy_approval_date != null
        ? new Date(powModel?.candidacy_approval_date)
        : undefined;
    this.specialization = new SpecializationModel({
      ...powModel?.specialization,
    });
    this.graduationApproval = new UserRoleModel({
      ...powModel?.graduation_approved_by,
    });
    this.graduationApprovalDate =
      powModel?.graduation_approval_date != null
        ? new Date(powModel?.graduation_approval_date)
        : undefined;
    this.powCourses = powModel?.pow_courses?.map(
      (course: { [key: string]: any } | undefined) =>
        new PowCourseModel({ ...course })
    );
    this.completedCourses = powModel?.completed_courses?.map(
      (course: { [key: string]: any } | undefined) =>
        new CompletedCourseModel({ ...course })
    );
    this.orientationTerm = new TermModel({ ...powModel?.orientation_term });
    this.firstClassTerm = new TermModel({ ...powModel?.first_class_term });
    this.completionDate =
      powModel?.completion_date != null
        ? new Date(powModel?.completion_date)
        : undefined;
    this.status = powModel?.status;
  }
}

export class PowCourseModel {
  id: number | undefined;
  course: CourseModel | undefined;
  pow: PowModel | undefined;
  term: TermModel | undefined;
  courseType: string | undefined;

  constructor(powCourseModel: { [key: string]: any } | undefined) {
    this.id = powCourseModel?.id;
    this.course = new CourseModel({ ...powCourseModel?.course });
    this.pow = new PowModel({ ...powCourseModel?.pow });
    this.term = new TermModel({ ...powCourseModel?.term });
    this.courseType = powCourseModel?.course_type;
  }
}
