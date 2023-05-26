import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { SpecializationService } from '../../services/specialization.service';
import { SpecializationModel } from '../../models/specialization.model';
import { TermService } from '../../services/term.service';
import { PowService } from '../../services/pow.service';
import { AuthService } from '../../../core/services/auth.service';
import * as dayjs from 'dayjs';
import { ViewCell } from '@vamidicreations/ng2-smart-table';
import { Router } from '@angular/router';
import { ToastMessageService } from '../../services/toast-message.service';
import { ConfirmationToastService } from '../../services/confirmation-toast.service';

@Component({
  selector: 'app-specialization-viewer',
  templateUrl: './specialization-viewer.component.html',
  styleUrls: ['./specialization-viewer.component.scss'],
})
export class SpecializationViewerComponent implements OnInit, OnDestroy {
  activeSpecialization: SpecializationModel | undefined;
  specializationCourses:
    | {
        course_type?: string;
        allow_addition?: boolean;
        credits?: any;
        courses?: any[];
        open_modal?: boolean;
      }[]
    | undefined = [];
  columns: any;
  actions: any;
  termList: { value: number; title: string }[] | undefined;

  firstClassTerm: any;
  orientationTerm: any;
  preSelectedCourses: { id: number | undefined }[] = [];

  creditsNeeded: number = 0;
  creditsPlanned: number = 0;
  submittable: boolean = false;
  loading: boolean = false;

  constructor(
    private specializationService: SpecializationService,
    private confirmationToastService: ConfirmationToastService,
    private termService: TermService,
    private powService: PowService,
    private authService: AuthService,
    private toastService: ToastMessageService,
    private router: Router,
    private ref: ChangeDetectorRef
  ) {}

  ngOnDestroy() {
    this.specializationService.setCurrentSpecialization(
      new SpecializationModel(undefined)
    );
  }

  ngOnInit(): void {
    this.activeSpecialization = undefined;
    this.specializationService.specialization$.subscribe((specialization) => {
      //reset component variables
      this.specializationCourses = [];
      this.creditsNeeded = 0;
      this.creditsPlanned = 0;
      this.activeSpecialization = specialization;
      //set preselected courses for course table
      this.preSelectedCourses = this.activeSpecialization.courses?.map(
        (course) => ({ id: course.course?.id })
      )!;
      //set the service variable for pow courses
      this.powService.setNewPowCourses(
        specialization.courses?.map((course) => ({
          course_id: course.course?.id,
          course_type: course.courseType,
          credits: course.course?.numberOfCredits,
          term_id: null,
        }))!
      );
      //set the courses from the specialization to the right course type
      this.specializationCourses = specialization.courseTypes?.map(
        (courseType) => {
          const credits: number = isNaN(parseInt(String(courseType.credits!)))
            ? 0
            : parseInt(String(courseType.credits!));
          this.creditsNeeded = this.creditsNeeded + credits;
          return {
            ...courseType,
            courses: specialization.courses
              ?.filter((course) => course.courseType === courseType.course_type)
              .map((course) => ({
                ...course.course,
                courseType: course.courseType,
              })),
          };
        }
      );
    });
    //subscribe to newpowcourses check if pow can be submitted
    this.powService.newPowCourses$.subscribe((courses) => {
      this.creditsPlanned = courses
        ?.map((course) =>
          course.term_id !== undefined && course.term_id !== null
            ? parseInt(String(course.credits))
            : 0
        )
        ?.reduce((a, b) => a! + b!, 0)!;
      this.submittable =
        this.creditsPlanned >= this.creditsNeeded &&
        this.orientationTerm !== undefined &&
        this.firstClassTerm !== undefined;
    });
    this.actions = {
      edit: false,
      delete: false,
      add: false,
    };
    this.termService
      .getAllTerms({
        filter: {active: ["eq", true]},
        order: '',
        page: 1,
        perPage: 10,
      })
      .subscribe(() => {
        this.termList = this.termService?.allTerms?.map((term) => ({
          value: term.id!,
          title: term.termName!,
        }));
        this.columns = {
          department: {
            title: 'Dept.',
            editable: false,
            width: '90px',
          },
          courseNumber: {
            title: 'Number',
            editable: false,
            width: '100px',
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
          termName: {
            type: 'custom',
            renderComponent: TermDropdownRenderComponent,
            width: '160px',
            title: 'Term',
            filter: false,
            editor: {
              type: 'list',
              config: {
                selectText: 'Select',
                list: this.termList,
              },
            },
          },
        };
      });
  }

  editPowCourse(event: any, courseType: string | undefined) {
    this.specializationCourses!.find(
      (courses) => courses.course_type === courseType
    )!.courses!.find((course) => course.id === event.newData.id)!.term =
      event.newData.term;
    event.confirm.resolve(event.newData);
  }

  closeModal(event: any, courseType: string | undefined) {
    this.specializationCourses!.find(
      (courses) => courses.course_type === courseType
    )!.open_modal = !event;
  }

  addSelectedCourses(event: any, courseType: string | undefined) {
    const oldCourses = this.powService.newPowCourses?.filter(
      (course) => course.course_type !== courseType
    );
    const newCourses = event.courses?.map(
      (course: { id: any; numberOfCredits: any }) => ({
        course_id: course.id,
        credits: course.numberOfCredits,
        course_type: courseType,
        term_id: null,
      })
    );
    this.powService.setNewPowCourses([...oldCourses!, ...newCourses]);
    this.specializationCourses!.find(
      (type) => type.course_type === courseType
    )!.courses = event.courses.map((course: any) => ({
      ...course,
      courseType: courseType,
    }));
  }

  submitPow(type: string) {
    this.confirmationToastService.setConfirmationToastMessage({
      title: 'Save',
      message:
        'WARNING: Creating a new POW will mark all your old POWs as VOID. Are you sure want to save?',
      btnOkText: 'Yes',
      btnCancelText: 'No',
      show: true,
      confirmationResponse: (response: boolean) => {
        if (response) {
          this.loading = true;
          const newPow = {
            student_id: this.authService.currentUserValue?.userRoles?.find(
              (role) => role.role?.role === 'student'
            )?.id,
            orientation_term_id: this.orientationTerm,
            first_class_term_id: this.firstClassTerm,
            creation_date: dayjs().toDate(),
            ...(type === 'approval'
              ? {
                  petition_date: dayjs().toDate(),
                }
              : {}),
            status: type === 'approval' ? 'Pending Approval' : 'Active',
            specialization_id: this.activeSpecialization?.id,
            pow_courses: this.powService.newPowCourses?.map((course) => ({
              course_id: course.course_id,
              course_type: course.course_type,
              ...(course.term_id
                ? {
                    term_id: course.term_id,
                  }
                : {}),
            })),
          };
          this.powService.submitNewPow(newPow).subscribe(
            (result) => {
              this.loading = false;
              this.router.navigate(['student']);
              if (type === 'approval') {
                this.toastService.setToastMessage({
                  type: 'success',
                  title: 'POW Sent',
                  message: 'Your POW has been sent for approval.',
                  delay: 3000,
                });
              } else {
                this.toastService.setToastMessage({
                  type: 'success',
                  title: 'POW Saved',
                  message: 'Your POW has been saved successfully.',
                  delay: 3000,
                });
              }
            },
            (error) => {
              this.loading = false;
              this.toastService.setToastMessage({
                type: 'danger',
                title: 'Error',
                message: 'There was an error adding your POW.',
                delay: 10000,
              });
            }
          );
        }
      },
    });
  }

  //set term select
  setFirstClass(event: any) {
    this.firstClassTerm = event.target.value;
    this.submittable =
      this.creditsPlanned >= this.creditsNeeded &&
      this.orientationTerm !== undefined &&
      this.firstClassTerm !== undefined;
  }

  //set term select
  setOrientationTerm(event: any) {
    this.orientationTerm = event.target.value;
    this.submittable =
      this.creditsPlanned >= this.creditsNeeded &&
      this.orientationTerm !== undefined &&
      this.firstClassTerm !== undefined;
  }
}

@Component({
  template: ` <div class="form-group mb-0">
    <select class="form-control" (change)="termChanged($event, rowData)">
      <option>Select Term</option>
      <option *ngFor="let term of termList" [value]="term.value">
        {{ term.display }}
      </option>
    </select>
  </div>`,
})
//component to render term dropdowns on the table row
export class TermDropdownRenderComponent implements ViewCell, OnInit {
  termList:
    | { display: string | undefined; value: number | undefined }[]
    | undefined;
  // @ts-ignore
  @Input() value: string | number | undefined;
  @Input() rowData: any;

  constructor(
    private termService: TermService,
    private powService: PowService
  ) {}

  ngOnInit() {
    this.termService.allTerms$.subscribe((terms) => {
      this.termList = terms.map((term) => ({
        value: term.id,
        display: term.termName,
      }));
    });
  }

  termChanged(event: any, rowData: any) {
    let powCourses = this.powService.newPowCourses;
    powCourses!.find(
      (course) =>
        course.course_id === rowData.id &&
        course.course_type === rowData.courseType
    )!.term_id = parseInt(event.target.value);
    this.powService.setNewPowCourses(powCourses!);
  }
}
