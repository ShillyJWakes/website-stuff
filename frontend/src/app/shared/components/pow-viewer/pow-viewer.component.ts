import {
  Component,
  OnInit,
  Input,
  Renderer2,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { PowService } from '../../services/pow.service';
import { PowCourseModel, PowModel } from '../../models/pow.model';
import * as dayjs from 'dayjs';
import { AuthService } from '../../../core/services/auth.service';
import { UserRoleModel } from '../../../core/models/user-role.model';
import { CompletedCourseService } from '../../services/completed-course.service';
import { GradeService } from '../../services/grade.service';
import { TermService } from '../../services/term.service';
import { first } from 'rxjs/operators';
import { ToastMessageService } from '../../services/toast-message.service';
import { CourseModel } from '../../models/course.model';
import { SpecializationService } from '../../services/specialization.service';
import { SpecializationModel } from '../../models/specialization.model';
import { InputInterface } from '../fancy-form-input/fancy-form-input.component';
import { Validators } from '@angular/forms';
import {
  ConfirmationToastService,
  ConfirmMessageInterface,
} from '../../services/confirmation-toast.service';

@Component({
  selector: 'app-pow-viewer',
  templateUrl: './pow-viewer.component.html',
  styleUrls: ['./pow-viewer.component.scss'],
})
export class PowViewerComponent implements OnInit, OnDestroy {
  activePow: PowModel | undefined;
  columns: any;
  powCourses:
    | {
        allow_addition?: boolean;
        course_type?: string;
        credits?: any;
        courses?: any[];
        open_modal?: boolean;
      }[] = [];
  electiveCourses: any[] | undefined;
  @Input() role = '';

  creditsNeeded: number = 0;
  creditsPlanned: number = 0;
  creditsEarned: number = 0;
  gradeList:
    | { value: number | undefined; title: string | undefined }[]
    | undefined;
  termList:
    | { value: number | undefined; title: string | undefined }[]
    | undefined;
  studentGrad: boolean = false;
  studentCandidacy: boolean = false;
  courses: { id: number | undefined }[] = [];
  firstTermInput: InputInterface[] | undefined;
  orientationTermInput: InputInterface[] | undefined;
  confirmMessage: ConfirmMessageInterface | undefined;
  selectedEvent: any = null;
  //Return the courses that will be preselected
  loading: boolean = false;
  private editable: boolean = true;

  constructor(
    private powService: PowService,
    private authService: AuthService,
    private completedCourseService: CompletedCourseService,
    private gradeService: GradeService,
    private termService: TermService,
    private toastService: ToastMessageService,
    private specializationService: SpecializationService,
    private confirmationToastService: ConfirmationToastService
  ) {
    //get grades from grade service and set to grade list
    this.gradeService
      .getAllGrades(true)
      .pipe(first())
      .subscribe(() => {
        this.gradeList = this.gradeService?.allGrades?.map((grade) => ({
          value: grade.id,
          title: grade.grade,
        }));
      });
  }

  //reset info when component is closed for any reason
  ngOnDestroy(): void {
    this.activePow = undefined;
    this.powService.setCurrentPow(new PowModel(undefined));
  }

  ngOnInit(): void {
    //get terms
    this.termService
      .getAllTerms({
        filter: {active: ["eq", true]},
        order: '',
        page: 1,
        perPage: 10,
      })
      .pipe(first())
      .subscribe(() => {
        //set the term list
        this.termList = this.termService?.allTerms?.map((term) => ({
          value: term.id,
          title: term.termName,
        }));
        //set table columns
        this.columns = {
          department: {
            title: 'Dept.',
            editable: false,
            width: '80px',
          },
          courseNumber: {
            title: 'No.',
            editable: false,
            width: '90px',
          },
          courseProfile: {
            title: 'Course Title',
            editable: false,
          },
          numberOfCredits: {
            title: 'Credits',
            editable: false,
            width: '80px',
          },
          term_id: {
            width: '130px',
            title: 'Term',
            valuePrepareFunction: (id: any) => {
              //returns title of term in row
              const idNum = typeof id === 'string' ? parseInt(id) : id;
              return this.termList?.find((term) => term.value === idNum)?.title;
            },
            editor: {
              type: 'list',
              config: {
                selectText: 'Select',
                list: this.termList,
              },
            },
          },
          grade_id: {
            width: '100px',
            title: 'Grade',
            //returns grade in row
            valuePrepareFunction: (id: any) => {
              const idNum = typeof id === 'string' ? parseInt(id) : id;
              return this.gradeList?.find((grade) => grade.value === idNum)
                ?.title;
            },
            editor: {
              type: 'list',
              config: {
                selectText: 'Select',
                list: this.gradeList,
              },
            },
          },
        };
      });
    //get currently set POW from subscribed service
    this.powService.currentPow$.subscribe((pow) => {
      this.activePow = pow;
      this.powCourses = [];
      this.creditsEarned = 0;
      this.creditsPlanned = 0;
      this.creditsNeeded = 0;
      pow.specialization?.courseTypes?.map((courseType) => {
        //calculate credits needed from the course type
        this.creditsNeeded =
          this.creditsNeeded + parseInt(String(courseType?.credits!));
        //Subscribe to completed course join to get the courses the POW has completed
        this.completedCourseService
          .getCompletedPowCourses(pow.id)
          .pipe(first())
          .subscribe((result) => {
            courseType.courses = result
              .filter((course) => course.courseType === courseType.course_type)
              .map((course) => {
                if (
                  course.grade?.id !== null &&
                  course.termCourse?.course?.numberOfCredits !== undefined
                ) {
                  //Add to credits earned
                  this.creditsEarned =
                    this.creditsEarned +
                    course.termCourse?.course?.numberOfCredits;
                }
                if (
                  course.termCourse?.term?.id !== null &&
                  course.termCourse?.course?.numberOfCredits !== undefined
                ) {
                  this.creditsPlanned =
                    this.creditsPlanned +
                    course.termCourse?.course?.numberOfCredits;
                }
                if (this.activePow !== undefined) {
                  this.courses = this.activePow!.powCourses!.map((course) => ({
                    id: course.course?.id,
                  }));
                }
                //map the completed courses to the columns
                return {
                  pow_course_id: course.powCourseId,
                  course_id: course.termCourse?.course?.id,
                  ...course.termCourse?.course,
                  term_id: course.termCourse?.term?.id,
                  ...course.termCourse?.term,
                  grade_id: course.grade?.id,
                  ...course.grade,
                };
              });
            //if the pow is active, filter out the courses with no term set
            if (this.activePow?.status !== 'Active') {
              courseType.courses = courseType.courses.filter(
                (course) =>
                  course.term_id !== null && course.term_id !== undefined
              );
            }
            //set select for first term for th fancy form input
            this.firstTermInput = [
              {
                type: 'select',
                label: 'First Term',
                value:
                  this.activePow?.firstClassTerm?.termName !== undefined
                    ? this.activePow?.firstClassTerm?.termName
                    : 'Not Selected',
                classProp: 'first_class_term',
                validation: [
                  {
                    validationType: 'required',
                    validator: Validators.required,
                    message: 'A term is required',
                  },
                ],
                selectValue: this.activePow?.firstClassTerm?.id,
                selectOptions: this.termList,
              },
            ];
            //set select for orientation term for fancy form input
            this.orientationTermInput = [
              {
                type: 'select',
                label: 'Orientation Term',
                value:
                  this.activePow?.orientationTerm?.termName !== undefined
                    ? this.activePow?.orientationTerm?.termName
                    : 'Not Selected',
                classProp: 'orientation_term',
                validation: [
                  {
                    validationType: 'required',
                    validator: Validators.required,
                    message: 'A term is required',
                  },
                ],
                selectValue: this.activePow?.orientationTerm?.id,
                selectOptions: this.termList,
              },
            ];
            //set course types with a closed modal
            this.powCourses?.push({ ...courseType, open_modal: false });
            //set if student can submit graduation
            this.studentGrad =
              this.creditsNeeded <= this.creditsEarned &&
              this.activePow?.status === 'POW Approved';
            //set if student can  submit the POW
            this.studentCandidacy =
              this.activePow?.status === 'Active' &&
              this.creditsNeeded <= this.creditsPlanned &&
              this.activePow?.orientationTerm !== undefined &&
              this.activePow?.orientationTerm.id !== undefined &&
              this.activePow?.firstClassTerm !== undefined &&
              this.activePow?.firstClassTerm.id !== undefined;
          });
      });
    });
  }

  //Submit graduation approval or rejection

  //return table actions based on pow status and approval
  actions(addable: boolean) {
    if (this.role === 'student' && addable) {
      return {
        edit:
          this.activePow?.status === 'Active' ||
          this.activePow?.status === 'POW Approved',
        delete: this.activePow?.status === 'Active',
        add: false,
      };
    }
    if (this.role === 'student' && !addable) {
      return {
        edit:
          this.activePow?.status === 'Active' ||
          this.activePow?.status === 'POW Approved',
        delete: false,
        add: false,
      };
    } else {
      return {
        edit: false,
        delete: false,
        add: false,
      };
    }
  }

  //dayjs is used to set the date
  sendGraduationApproval(approveGraduation: boolean) {
    this.confirmationToastService.setConfirmationToastMessage({
      title: 'Graduation Approval',
      message: approveGraduation
        ? 'Are you sure want to approve graduation?'
        : 'Are you sure want to reject graduation?',
      btnOkText: 'Yes',
      btnCancelText: 'No',
      show: true,
      confirmationResponse: (response: boolean) => {
        if (response) {
          this.loading = true;
          this.authService.currentUserValue?.userRoles?.map((userRole) => {
            if (
              this.activePow !== undefined &&
              approveGraduation &&
              userRole.role?.role === 'admin'
            ) {
              this.activePow.graduationApprovalDate = dayjs().toDate();
              this.activePow.graduationApproval = new UserRoleModel({
                id: userRole.role.id,
              });
              this.activePow.status = 'Graduation Approved';
              this.powService.editPow(this.activePow).subscribe(() => {
                this.loading = false;
                this.toastService.setToastMessage({
                  delay: 3000,
                  title: 'Graduation Approved',
                  type: 'success',
                  message: 'The POW has been approved for graduation.',
                });
              });
            } else if (
              this.activePow !== undefined &&
              !approveGraduation &&
              userRole.role?.role === 'admin'
            ) {
              this.activePow.graduationApprovalDate = dayjs().toDate();
              this.activePow.graduationApproval = new UserRoleModel({
                id: userRole.id,
              });
              this.activePow.status = 'Graduation Rejected';
              this.powService.editPow(this.activePow).subscribe(() => {
                this.loading = false;
                this.toastService.setToastMessage({
                  delay: 3000,
                  title: 'Graduation Rejected',
                  type: 'success',
                  message: 'The POW has been rejected for graduation.',
                });
              });
            }
          });
        }
      },
    });
  }

  //Set new active pow status and either reject or approve the candidacy
  sendCandidacyApproval(approveCandidacy: boolean) {
    this.confirmationToastService.setConfirmationToastMessage({
      title: 'POW Approval',
      message: approveCandidacy
        ? 'Are you sure want to approve the POW?'
        : 'Are you sure want to reject the POW?',
      btnOkText: 'Yes',
      btnCancelText: 'No',
      show: true,
      confirmationResponse: (response: boolean) => {
        if (response) {
          this.loading = true;
          this.authService.currentUserValue?.userRoles?.map((userRole) => {
            if (this.activePow !== undefined && approveCandidacy) {
              this.activePow.candidacyApprovalDate = dayjs().toDate();
              this.activePow.candidacyApproval = new UserRoleModel({
                id: userRole.role?.id,
              });
              this.activePow.status = 'POW Approved';
              this.powService.editPow(this.activePow).subscribe(() => {
                this.loading = false;
                this.toastService.setToastMessage({
                  delay: 3000,
                  title: 'POW Approved',
                  type: 'success',
                  message: 'The POW has been approved.',
                });
              });
            } else if (this.activePow !== undefined && !approveCandidacy) {
              this.activePow.candidacyApprovalDate = dayjs().toDate();
              this.activePow.candidacyApproval = new UserRoleModel({
                id: userRole.role?.id,
              });
              this.activePow.status = 'POW Rejected';
              this.powService.editPow(this.activePow).subscribe(() => {
                this.loading = false;
                this.toastService.setToastMessage({
                  delay: 3000,
                  title: 'POW Rejected',
                  type: 'success',
                  message: 'The POW has been rejected.',
                });
              });
            }
          });
        }
      },
    });
  }

  editPowCourse(event: any, courseType: string | undefined) {
    //Check if both grade and term are being set to submit a completed course
    if (
      event.newData.grade_id !== '' &&
      event.newData.grade_id !== null &&
      event.newData.term_id !== null &&
      event.newData.term_id !== ''
    ) {
      //submit a completed course
      this.completedCourseService
        .submitCompletedCourse(
          event.newData.course_id,
          event.newData.term_id,
          event.newData.grade_id,
          this.authService.currentUserValue?.userRoles?.find(
            (userRole) => userRole.role?.role === 'student'
          )?.id!
        )
        .pipe(first())
        .subscribe(
          (result) => {
            //if successful show toast and get reset the pow. If error return error toast
            this.toastService.setToastMessage({
              title: 'Completed Course Added',
              type: 'success',
              message: 'Your completed course was updated',
              delay: 3000,
            });
            event.confirm.resolve(event.newData);
            this.powService.getPow(this.activePow?.id!).subscribe();
          },
          (error) => {
            if (
              error ===
              'The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again.'
            ) {
              this.toastService.setToastMessage({
                delay: 10000,
                title: 'Error Adding Course',
                type: 'danger',
                message:
                  'Course was not offered this term. Please pick a different term.',
              });
            } else {
              this.toastService.setToastMessage({
                delay: 10000,
                title: 'Error Adding Course',
                type: 'danger',
                message:
                  'There was an error adding adding your completed course.',
              });
            }
          }
        );
      //Check if a new course is being added to the POW
    } else if (event.newData.new) {
      this.powService
        .addCourseToPow(
          event.newData.id,
          this.activePow?.id!,
          event.newData.term_id,
          courseType!
        )
        .pipe(first())
        .subscribe(
          () => {
            this.toastService.setToastMessage({
              delay: 3000,
              title: 'Course Added',
              type: 'success',
              message: 'The course was added to your POW',
            });
            this.powService.getPow(this.activePow?.id!).subscribe();
            event.confirm.resolve(event.newData);
          },
          (error) => {
            this.toastService.setToastMessage({
              delay: 3000,
              title: 'Unable to add course',
              type: 'danger',
              message: 'There was an error adding your term to your POW.',
            });
          }
        );
      // if a term is being added for a planned course with no grade
    } else {
      this.powService
        .editPowCourse(event.newData.pow_course_id, event.newData.term_id)
        .pipe(first())
        .subscribe(
          (result) => {
            if (event.data.term_id === null) {
              this.creditsPlanned =
                this.creditsPlanned + event.newData.numberOfCredits;
              this.studentCandidacy = !(
                this.creditsNeeded === this.creditsPlanned
              );
            }
            this.toastService.setToastMessage({
              delay: 3000,
              title: 'Term Changed',
              type: 'success',
              message: 'Term updated successfully',
            });
            this.powService.getPow(this.activePow?.id!).subscribe();
            event.confirm.resolve(event.newData);
          },
          (error) => {
            this.toastService.setToastMessage({
              delay: 10000,
              title: 'Error',
              type: 'danger',
              message: 'There was an error adding your order',
            });
          }
        );
    }
  }

  //submit pow for approval
  submitForCandidacy() {
    this.confirmationToastService.setConfirmationToastMessage({
      title: 'POW Approval',
      message: 'Are you sure want to send your POW for approval',
      btnOkText: 'Yes',
      btnCancelText: 'No',
      show: true,
      confirmationResponse: (response: boolean) => {
        if (response) {
          this.loading = true;
          if (this.activePow?.status) {
            this.activePow.status = 'Pending Approval';
            this.powService
              .editPow(this.activePow)
              .pipe(first())
              .subscribe(
                () => {
                  this.loading = false;
                  this.toastService.setToastMessage({
                    delay: 3000,
                    title: 'POW Submitted',
                    type: 'success',
                    message: 'Your POW has been submitted for approval',
                  });
                  this.powService.getPow(this.activePow?.id!).subscribe();
                },
                (error) => {
                  this.loading = false;
                  this.toastService.setToastMessage({
                    delay: 3000,
                    title: 'POW NOT Submitted',
                    type: 'danger',
                    message: 'There was an error submitting your POW',
                  });
                }
              );
          }
        }
      },
    });
  }

  //submit pow for graduation approval
  submitForApproval() {
    this.confirmationToastService.setConfirmationToastMessage({
      title: 'Graduation',
      message: 'Get your POW Approved for Graduation?',
      btnOkText: 'Yes',
      btnCancelText: 'No',
      show: true,
      confirmationResponse: (response: boolean) => {
        if (response) {
          this.loading = true;

          if (this.activePow?.status) {
            this.activePow.status = 'Pending Graduation';
            this.powService
              .editPow(this.activePow)
              .pipe(first())
              .subscribe(
                () => {
                  this.loading = false;
                  this.toastService.setToastMessage({
                    delay: 3000,
                    title: 'POW Submitted',
                    type: 'success',
                    message: 'Your POW has been submitted for Graduation',
                  });
                  this.powService
                    .getPow(this.activePow?.id!)
                    .pipe(first())
                    .subscribe();
                },
                (error) => {
                  this.loading = false;
                  this.toastService.setToastMessage({
                    delay: 3000,
                    title: 'POW NOT Submitted',
                    type: 'danger',
                    message: 'There was an error submitting your POW',
                  });
                }
              );
          }
        }
      },
    });
  }

  //set course type as close modal
  closeModal(event: any, courseType: string) {
    this.powCourses.find(
      (courses) => courses.course_type === courseType
    )!.open_modal = !event;
    this.powService.getPow(this.activePow?.id!).pipe(first()).subscribe();
  }

  //get select courses event and set the new course from the course table
  addSelectedCourses(event: any, courseType: string) {
    //check if the selected course even is an add event
    if (event.add) {
      //add the course to the pow using the service
      this.powService
        .addCourseToPow(event.course.id, this.activePow?.id!, null, courseType!)
        .subscribe(
          () => {
            this.toastService.setToastMessage({
              delay: 3000,
              title: 'Course Added',
              type: 'success',
              message: 'The course was added to your POW',
            });
          },
          (error) => {
            this.toastService.setToastMessage({
              delay: 3000,
              title: 'Unable to add course',
              type: 'danger',
              message: 'There was an error adding your term to your POW.',
            });
          }
        );
    } else if (!event.add && event.course !== undefined) {
      this.powService
        .removePowCourseByCourse(event?.course?.id!)
        .pipe(first())
        .subscribe(
          () => {
            this.toastService.setToastMessage({
              delay: 3000,
              title: 'Course Removed',
              type: 'success',
              message: 'The course was removed from your POW',
            });
          },
          (error) => {
            this.toastService.setToastMessage({
              delay: 3000,
              title: 'Unable to remove course',
              type: 'danger',
              message: 'There was an error removing your course from the POW.',
            });
          }
        );
    }
  }

  saveConfirmation() {
    return Promise.resolve(
      this.confirmationToastService.setConfirmationToastMessage({
        title: 'Delete',
        message: 'Are you sure want to delete?',
        btnOkText: 'Yes',
        btnCancelText: 'No',
        show: true,
        confirmationResponse: (response: boolean) => {
          return response;
        },
      })
    );
  }

  //Delete selected course based on the course in the row
  deletePowCourse(event: any) {
    if (!event.data.new) {
      this.selectedEvent = event;
      this.confirmationToastService.setConfirmationToastMessage({
        title: 'Delete',
        message: 'Are you sure want to delete?',
        btnOkText: 'Yes',
        btnCancelText: 'No',
        show: true,
        confirmationResponse: (response: boolean) => {
          if (response) {
            this.powService
              .removePowCourse(this.selectedEvent.data.pow_course_id)
              .pipe(first())
              .subscribe();
            this.powService.getPow(this.activePow?.id!).subscribe();
            this.selectedEvent.confirm.resolve(this.selectedEvent.data);
            this.selectedEvent = null;
          } else {
            this.selectedEvent = null;
          }
        },
      });
    } else {
      event.confirm.resolve(event.data);
    }
  }

  //return display day format
  displayDate(d: any) {
    return dayjs(d).format('MMM D, YYYY');
  }

  enabledCourses(courses: any[]) {
    return courses.map((course) => ({
      id: course.course_id,
    }));
  }
}
