import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoursesService } from '../../services/courses.service';
import { CourseModel } from '../../models/course.model';
import { ToastMessageService } from '../../services/toast-message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationToastService } from '../../services/confirmation-toast.service';
import mscodeJson from '../../../../assets/ms_code.json'

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss'],
})
export class CourseFormComponent implements OnChanges, OnInit {
  submitted = false;
  @Input() create = true;
  @Input() prefill: CourseModel | undefined;
  @Input() role: string = 'admin';
  msCodes: { name: string; code: number }[] = mscodeJson;
  @Output() formSubmitted: EventEmitter<boolean> = new EventEmitter();
  newCourseForm: FormGroup = this._formBuilder.group({});
  openCoRequisiteModal: boolean = false;
  openPreRequisiteModal: boolean = false;
  coReqs: any[] = [];
  preReqs: any[] = [];
  loading: boolean = false;
  selectedCoReqs: any[] = [];
  selectedPreReqs: any[] = [];
  courseApproval: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private coursesService: CoursesService,
    private activatedRoute: ActivatedRoute,
    private confirmationToastService: ConfirmationToastService,
    private router: Router,
    private toastService: ToastMessageService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    //set the course approval flag if component was initiated with a route that contains a course number
    const courseId = this.activatedRoute.snapshot.params.id;
    if (courseId !== undefined) {
      this.courseApproval = true;
    }
  }

  ngOnChanges(): void {
    this.coReqs = [];
    this.preReqs = [];
    //get all the requisites and fill them into the appropriate type
    this.prefill?.requisites?.map((req) => {
      if (req.reqType === 'co') {
        this.coReqs = [...(this.coReqs! || []), req.childCourse];
        this.selectedCoReqs = this.coReqs.map((course) => ({ id: course.id }));
      } else {
        this.preReqs = [...(this.preReqs! || []), req.childCourse];
        this.selectedPreReqs = this.preReqs.map((course) => ({
          id: course.id,
        }));
      }
    });
    //Make the new course form object with prefilled values if they're set. Adds validation for reactive form too
    this.newCourseForm = this._formBuilder.group({
      courseNameFormControl: [
        this.prefill?.courseProfile,
        [Validators.required],
      ],
      departmentFormControl: [
        this.prefill?.department,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[A-Z]*$'),
        ],
      ],
      courseNumFormControl: [
        this.prefill?.courseNumber,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      creditsFormControl: [
        this.prefill?.numberOfCredits,
        [Validators.required],
      ],
      masterScheduleFormControl: [
        this.prefill?.masterScheduleCode,
        Validators.pattern('^[0-9]*$'),
      ],
      descriptionFormControl: [this.prefill?.courseDescription],
      validationFormControl: [this.prefill?.active],
    });
  }

  onSubmit() {
    this.confirmationToastService.setConfirmationToastMessage({
      title: 'Create New?',
      message: 'Are you sure want to save the course?',
      btnOkText: 'Yes',
      btnCancelText: 'No',
      show: true,
      confirmationResponse: (response: boolean) => {
        if (response) {
          this.submitted = true;
          this.loading = true;
          //Check if new course is being created and submit it using the service
          if (this.create) {
            this.coursesService
              .submitNewCourse(
                this.newCourseForm.value.courseNameFormControl,
                this.newCourseForm.value.creditsFormControl,
                this.newCourseForm.value.courseNumFormControl,
                this.newCourseForm.value.descriptionFormControl,
                this.newCourseForm.value.departmentFormControl,
                this.newCourseForm.value.validationFormControl,
                this.coReqs! || [],
                this.preReqs! || [],
                this.newCourseForm.value.masterScheduleFormControl
              )
              .subscribe(
                () => {
                  this.toastService.setToastMessage({
                    type: 'success',
                    title: 'Course Created',
                    message: 'The course has been created.',
                    delay: 3000,
                  });
                  this.formSubmitted.emit(true);
                  this.modalService.dismissAll();
                  this.loading = false;
                },
                (error) => {
                  this.toastService.setToastMessage({
                    type: 'danger',
                    title: 'Error Making Course',
                    message: 'There was an error making the course.',
                    delay: 1000,
                  });
                  this.loading = false;
                }
              );
            //if course is being updated instead of created
          } else {
            this.coursesService
              .editCourse(
                new CourseModel({
                  id: this.prefill?.id,
                  course_profile:
                    this.newCourseForm.value.courseNameFormControl,
                  number_of_credits:
                    this.newCourseForm.value.creditsFormControl,
                  course_description:
                    this.newCourseForm.value.descriptionFormControl,
                  course_number: this.newCourseForm.value.courseNumFormControl,
                  department: this.newCourseForm.value.departmentFormControl,
                  active: this.newCourseForm.value.validationFormControl,
                  ms_code: this.newCourseForm.value.masterScheduleFormControl,
                }),
                this.coReqs,
                this.preReqs
              )
              .subscribe(
                () => {
                  this.toastService.setToastMessage({
                    type: 'success',
                    title: 'Course Edited',
                    message: 'The course has been Edited.',
                    delay: 3000,
                  });
                  this.formSubmitted.emit(true);
                  this.modalService.dismissAll();
                  this.loading = false;
                },
                (error) => {
                  this.toastService.setToastMessage({
                    type: 'danger',
                    title: 'Error Editing Course',
                    message: 'There was an error editing the course.',
                    delay: 1000,
                  });
                  this.loading = false;
                }
              );
          }
        }
      },
    });
  }

  closeCoRequisiteModal(event: any) {
    this.openCoRequisiteModal = false;
  }

  addSelectedCoRequisite(event: any) {
    this.coReqs = event.courses;
  }

  closePreRequisiteModal(event: any) {
    this.openPreRequisiteModal = false;
  }

  addSelectedPreRequisite(event: any) {
    this.preReqs = event.courses;
  }

  //Approve student submitted course
  courseApprove(approved: boolean) {
    if (approved) {
      this.coursesService
        .editCourse(
          new CourseModel({
            id: this.prefill?.id,
            course_profile: this.newCourseForm.value.courseNameFormControl,
            number_of_credits: this.newCourseForm.value.creditsFormControl,
            course_description: this.newCourseForm.value.descriptionFormControl,
            course_number: this.newCourseForm.value.courseNumFormControl,
            department: this.newCourseForm.value.departmentFormControl,
            ms_code: this.newCourseForm.value.masterScheduleFormControl,
            active: approved,
          })
        )
        .subscribe(
          () => {
            this.toastService.setToastMessage({
              type: 'success',
              title: 'Course Approved',
              message: 'The Course has been approved',
              delay: 3000,
            });
            this.formSubmitted.emit(true);
            this.router.navigate(['/admin']);
            this.modalService.dismissAll();
          },
          (error) => {
            this.toastService.setToastMessage({
              type: 'danger',
              title: 'Error Approving Course',
              message: 'There was an error approving the course.',
              delay: 1000,
            });
          }
        );
      //reject and delete student submitted course
    } else {
      this.coursesService.deleteCourse(this.prefill?.id!).subscribe(
        () => {
          this.toastService.setToastMessage({
            type: 'success',
            title: 'Course Rejected',
            message: 'The Course has been rejected.',
            delay: 3000,
          });
          this.formSubmitted.emit(true);
          this.router.navigate(['/admin']);
          this.modalService.dismissAll();
        },
        () => {
          this.toastService.setToastMessage({
            type: 'danger',
            title: 'Course Rejection Failed',
            message: 'There as an error rejecting the course.',
            delay: 3000,
          });
        }
      );
    }
  }
}
