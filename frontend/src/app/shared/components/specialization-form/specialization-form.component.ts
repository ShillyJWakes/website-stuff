import { Component, Input, OnChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { ActiveRenderComponent } from '../course-table/course-table.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpecializationService } from '../../services/specialization.service';
import { SpecializationModel } from '../../models/specialization.model';
import { ToastMessageService } from '../../services/toast-message.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { CONSTRUCTOR } from '@angular/compiler-cli/ngcc/src/host/esm2015_host';
import { ConfirmationToastService } from '../../services/confirmation-toast.service';

interface SpecCourseInterface {
  course_type?: string | undefined;
  credits?: any;
  open_modal?: boolean | undefined;
  allow_addition?: boolean | undefined;
  courses?: any[] | undefined;
}

@Component({
  selector: 'app-specialization-form',
  templateUrl: './specialization-form.component.html',
  styleUrls: ['./specialization-form.component.scss'],
})
export class SpecializationFormComponent implements OnChanges {
  newSpecializationForm: FormGroup = this._formBuilder.group({});
  @Input() prefill: SpecializationModel | undefined;
  submitted = false;
  create = true;

  actions = {
    edit: true,
    delete: true,
    add: true,
  };
  actionsCourses = {
    edit: false,
    delete: false,
    add: false,
  };
  columnsCourses = {
    department: {
      title: 'Dept',
      filter: false,
    },
    courseNumber: {
      title: 'Course No.',
      filter: false,
    },
    courseProfile: {
      title: 'Course Title',
      filter: false,
    },
    numberOfCredits: {
      title: 'Credits',
      filter: false,
    },
  };
  columns = {
    course_type: {
      title: 'Course Type',
      editable: true,
      width: '100px',
      filter: false,
    },
    credits: {
      title: 'Credit Req.',
      editable: true,
      width: '75px',
      filter: false,
    },
    allow_addition: {
      title: 'Allow Addition',
      type: 'custom',
      renderComponent: ActiveRenderComponent,
      editable: true,
      width: '75px',
      filter: false,
      editor: {
        type: 'checkbox',
        config: {
          true: true,
          false: false,
        },
      },
    },
  };
  openModal: boolean = false;
  private _courseTypes$ = new BehaviorSubject<SpecCourseInterface[]>([
    { open_modal: false },
  ]);
  courseTypes$ = this._courseTypes$.asObservable();

  constructor(
    private _formBuilder: FormBuilder,
    private specializationService: SpecializationService,
    private confirmationToastService: ConfirmationToastService,
    private toastService: ToastMessageService,
    private modalService: NgbModal
  ) {}

  //executes when prefill changes
  ngOnChanges(): void {
    this._courseTypes$.next([]);
    //start reactive form to get form info
    this.newSpecializationForm = this._formBuilder.group({
      specializationNameFormControl: [
        this.prefill?.specialization,
        [Validators.required],
      ],
      courseTypesFormControl: [this.prefill?.courseTypes],
      validationFormControl: [this.prefill?.active],
      coursesFormControl: [this.prefill?.courses],
    });
    //preset courses and course types from prefill it's not undefined
    if (this.prefill !== undefined) {
      this.create = false;
      const newCourses: SpecCourseInterface[] | undefined =
        this.prefill.courseTypes?.map((courseType) => {
          const courseFill = this.prefill?.courses
            ?.filter(
              (specCourse) => specCourse.courseType === courseType.course_type
            )
            .map((courses) => courses.course);
          return {
            ...courseType,
            open_modal: false,
            courses: courseFill!.map((course) => {
              return { ...course };
            }),
          };
        });
      this._courseTypes$.next(newCourses!);
      //if a new course is being made, pass some default course types to get the user started
    } else {
      this._courseTypes$.next([
        {
          course_type: 'Core',
          credits: null,
          courses: [],
          allow_addition: false,
          open_modal: false,
        },
        {
          course_type: 'Required',
          credits: null,
          courses: [],
          allow_addition: false,
          open_modal: false,
        },
        {
          course_type: 'Elective',
          credits: null,
          courses: [],
          allow_addition: false,
          open_modal: false,
        },
        {
          course_type: 'Chosen Elective',
          credits: null,
          courses: [],
          allow_addition: true,
          open_modal: false,
        },
      ]);
    }
  }

  //edit course types
  patchEditedCourseReqs(event: any) {
    this.courseTypes$.pipe(first()).subscribe((courseTypes) => {
      const index = courseTypes?.indexOf(event.data);
      if (index! > -1) {
        courseTypes?.splice(index!, 1);
      }
      courseTypes?.push(event.newData);
      const newCourseTypes = [...courseTypes!];
      this._courseTypes$.next(newCourseTypes);
    });
  }

  //delete a course type
  deleteCourseReqs(event: any) {
    this.courseTypes$.pipe(first()).subscribe((courseTypes) => {
      const index = courseTypes?.indexOf(event.data);
      if (index! > -1) {
        courseTypes?.splice(index!, 1);
      }
      const newCourseTypes = [...courseTypes!];
      this._courseTypes$.next(newCourseTypes);
      event.confirm.resolve();
    });
  }

  //add a new course type
  addCourseReqs(event: any) {
    this.courseTypes$.pipe(first()).subscribe((courseTypes) => {
      courseTypes?.push(event.newData);
      const newCourseTypes = [...courseTypes!];
      this._courseTypes$.next(newCourseTypes);
      event.confirm.resolve(event.newData);
    });
  }

  //close the course modal
  closeModal(event: any, courseType: string) {
    this.openModal = !event;
    this.courseTypes$.pipe(first()).subscribe((courseTypes: any) => {
      courseTypes.find(
        (type: { course_type: string }) => type.course_type === courseType
      ).open_modal = !event;
      const newCourseTypes = [...courseTypes];
      this._courseTypes$.next(newCourseTypes);
    });
  }

  //add selected courses from the course table event
  addSelectedCourses(event: any, courseType: string) {
    this.courseTypes$.pipe(first()).subscribe((courseTypes) => {
      if (
        courseTypes!.find((type) => type.course_type === courseType) !==
        undefined
      ) {
        courseTypes!.find((type) => type.course_type === courseType)!.courses =
          event.courses;
      }
    });
  }

  //Delete a course from the course type
  deleteCourse(event: any, courseType: string) {
    this.courseTypes$.pipe(first()).subscribe((courseTypes: any) => {
      const courseArray = courseTypes.find(
        (type: { course_type: string }) => type.course_type === courseType
      )?.courses;
      const index = courseArray?.findIndex(
        (course: { id: any }) => course.id === event.data.id
      );
      if (index! > -1) {
        courseArray?.splice(index!, 1);
      }
      courseTypes.find(
        (type: { course_type: string }) => type.course_type === courseType
      )!.courses = courseArray;
      const newCourseTypes = [...courseTypes];
      this._courseTypes$.next(newCourseTypes);
      event.confirm.resolve();
    });
  }

  onSubmit() {
    this.confirmationToastService.setConfirmationToastMessage({
      title: 'Save',
      message: 'Are you sure want to save the degree?',
      btnOkText: 'Yes',
      btnCancelText: 'No',
      show: true,
      confirmationResponse: (response: boolean) => {
        if (response) {
          this.submitted = true;
          //create new specialization object to be passed in for either creation or modification
          this.courseTypes$.subscribe((courseTypes) => {
            const types = courseTypes?.map((type) => ({
              course_type: type.course_type,
              credits: type.credits,
              allow_addition: type.allow_addition,
            }));
            let coursesMutated: any[] = [];
            courseTypes!.map((type) => {
              return type.courses!.map((course) => {
                coursesMutated.push({
                  course_type: type.course_type,
                  course: { id: course!.id },
                });
              });
            });
            this.newSpecializationForm.patchValue({
              courseTypesFormControl: types,
              coursesFormControl: coursesMutated,
            });
          });
          if (this.create) {
            this.specializationService
              .submitNewSpecialization(
                new SpecializationModel({
                  specialization:
                    this.newSpecializationForm.value
                      .specializationNameFormControl,
                  course_types:
                    this.newSpecializationForm.value.courseTypesFormControl,
                  active:
                    this.newSpecializationForm.value.validationFormControl,
                  courses: this.newSpecializationForm.value.coursesFormControl,
                })
              )
              .subscribe(
                () => {
                  this.toastService.setToastMessage({
                    type: 'success',
                    title: 'Degree Created',
                    message: 'The new degree has been created.',
                    delay: 3000,
                  });
                  this.modalService.dismissAll();
                  this.specializationService
                    .getAllSpecializations({
                      filter: {},
                      order: '',
                      page: 1,
                      perPage: 100,
                    })
                    .subscribe();
                },
                () => {
                  this.toastService.setToastMessage({
                    type: 'danger',
                    title: 'Error Creating Degree',
                    message: 'There was an error creating the new degree.',
                    delay: 10000,
                  });
                }
              );
          } else {
            this.specializationService
              .editSpecialization(
                new SpecializationModel({
                  id: this.prefill?.id,
                  specialization:
                    this.newSpecializationForm.value
                      .specializationNameFormControl,
                  course_types:
                    this.newSpecializationForm.value.courseTypesFormControl,
                  active:
                    this.newSpecializationForm.value.validationFormControl,
                  courses: this.newSpecializationForm.value.coursesFormControl,
                })
              )
              .subscribe(
                () => {
                  this.toastService.setToastMessage({
                    type: 'success',
                    title: 'Degree Edited',
                    message: 'The degree has been edited.',
                    delay: 3000,
                  });
                  this.modalService.dismissAll();
                  this.specializationService
                    .getAllSpecializations({
                      filter: [],
                      order: '',
                      page: 1,
                      perPage: 100,
                    })
                    .subscribe();
                },
                () => {
                  this.toastService.setToastMessage({
                    type: 'danger',
                    title: 'Error Editing Degree',
                    message: 'There was an error editing the degree.',
                    delay: 10000,
                  });
                }
              );
          }
        }
      },
    });
  }

  openCoursesModal(openModal: SpecCourseInterface) {
    this.courseTypes$.pipe(first()).subscribe((courseTypes: any) => {
      courseTypes.find(
        (type: { course_type: string }) =>
          type.course_type === openModal.course_type
      ).open_modal = true;
      const newCourseTypes = [...courseTypes];
      this._courseTypes$.next(newCourseTypes);
    });
  }
}
