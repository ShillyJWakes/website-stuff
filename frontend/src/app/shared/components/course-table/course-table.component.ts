import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CoursesService } from '../../services/courses.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseModel } from '../../models/course.model';
import { ViewCell } from '@vamidicreations/ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { first, take } from 'rxjs/operators';
import { ToastMessageService } from '../../services/toast-message.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-course-table',
  templateUrl: './course-table.component.html',
  styleUrls: ['./course-table.component.scss'],
})
export class CourseTableComponent implements OnInit, OnDestroy {
  @Input() editable: boolean = true;
  @Input() selectable: boolean = false;
  @Input() courseAdd: boolean = true;
  @Input() role: string = 'admin';
  @Input() preSelectedCourses: (any | undefined)[] = [];
  @Input() enabledCourses: (any | undefined)[] = [];
  @Output() selectedCourses: EventEmitter<any> = new EventEmitter();
  actions: any;
  columns: any;
  courses: any[] = [];
  openModal: boolean = false;
  openedCourse: CourseModel | undefined;
  modalTitle: string | undefined;
  private filter: { department?: string[]; active?: any[] } = {
    department: ['eq', 'INF'],
    active: ['eq', true],
  };
  private _selectedCourses$ = new BehaviorSubject<{
    courses?: CourseModel[];
    add?: boolean;
    course?: CourseModel;
  }>({});
  public selectedCourses$ = this._selectedCourses$.asObservable();

  constructor(
    private coursesService: CoursesService,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastMessageService,
    private router: Router,
    private modalService: NgbModal
  ) {}
  //Trigger selected course event
  setSelectedCourses(selection: {
    courses: CourseModel[];
    add: boolean;
    course: CourseModel;
  }) {
    this._selectedCourses$.next(selection);
  }
  //Get courses by course name ascending
  getCourses() {
    this.coursesService
      .getAllCourses({
        filter: this.filter,
        order: 'course_profile asc',
        page: 1,
        perPage: 100,
      })
      .subscribe();
  }
  //destroy selected courses on component destroy
  ngOnDestroy() {
    this._selectedCourses$.next({});
  }

  ngOnInit(): void {
    //reset selected courses on init
    this._selectedCourses$.next({});
    this.getCourses();
    //set table actions
    this.actions = {
      edit: this.editable,
      delete: false,
      add: false,
      custom: [
        {
          name: 'open',
          title: '<span class="material-icons table-icons">open_in_new</span>',
        },
      ],
    };

    this.coursesService.allCourses$.subscribe((courses) => {
      //set course as either preselected or if addition to the table is allowed
      this.courses = courses.map((course) => {
        if (
          this.preSelectedCourses &&
          this.preSelectedCourses!.some(
            (preCourse) => preCourse.id === course.id
          )
        ) {
          return {
            ...course,
            select: true,
            allow_addition: this.enabledCourses.some(
              (enCourse) => enCourse.id === course.id
            ),
          };
        } else {
          return { ...course, select: false, allow_addition: true };
        }
      });
      const courseId = this.activatedRoute.snapshot.params.id;
      if (courseId !== undefined) {
        this.coursesService.getCourse(parseInt(courseId)).subscribe();
        this.coursesService.course$.pipe(first()).subscribe((course) => {
          if (course && course.id !== undefined) {
            this.openModal = true;
            this.openedCourse = course;
          }
        });
      }
    });
    this._selectedCourses$.next({ courses: this.enabledCourses });
    this.columns = {
      ...(this.selectable
        ? {
            select: {
              title: '',
              editable: false,
              width: '75px',
              type: 'custom',
              filter: false,
              renderComponent: SelectCourseComponent,
            },
          }
        : {}),
      department: {
        title: 'Dept',
        editable: true,
        width: '70px',
      },
      courseNumber: {
        title: 'Num',
        editable: true,
        width: '100px',
      },
      courseProfile: {
        title: 'Course Title',
        editable: true,
      },
      numberOfCredits: {
        title: 'Credits',
        editable: true,
        width: '50px',
      },
      masterScheduleCode: {
        title: 'Semesters',
        editable: true,
        width: '50px',
      },
      ...(this.editable
        ? {
            active: {
              title: 'Active',
              editable: true,
              width: '50px',
              type: 'custom',
              filter: false,
              renderComponent: ActiveRenderComponent,
              editor: {
                type: 'checkbox',
                config: {
                  true: true,
                  false: false,
                },
              },
            },
          }
        : {}),
    };

    this.selectedCourses$.subscribe((selectedCourses) => {
      this.sendSelectedRows(selectedCourses);
    });
  }
  //event to send selected courses to component that called it
  sendSelectedRows(event: any) {
    if (event.courses === undefined) {
      this.selectedCourses.emit({ courses: this.enabledCourses });
    } else {
      this.selectedCourses.emit(event);
    }
  }
  //open a modal with course info passed in
  openCourseInfo(event: any) {
    this.openedCourse = undefined;
    this.openModal = true;
    this.openedCourse = event.data;
  }
  //reset modal to closed
  closeModal(event: any) {
    this.openModal = !event;
    this.openedCourse = undefined;
  }
  //pass in edited course info
  patchEditedCourse(event: any) {
    this.coursesService.editCourse(event.newData).subscribe(
      () => {
        this.getCourses();
        this.toastService.setToastMessage({
          type: 'success',
          title: 'Course Edited',
          message: 'The course has been edited.',
          delay: 3000,
        });
      },
      (error) => {
        this.toastService.setToastMessage({
          type: 'danger',
          title: 'Edit Failed',
          message: 'Editing the course failed.',
          delay: 10000,
        });
      }
    );
  }

  deletedCourse(event: any) {
    this.coursesService.deleteCourse(event.data.id).subscribe(() => {
      this.getCourses();
    });
    this.getCourses();
  }
  //change filter to pull departments besides INF
  seeOtherDepartments(event: any) {
    if (event.target?.checked === true) {
      delete this.filter.department;
      this.getCourses();
    } else {
      this.filter.department = ['eq', 'INF'];
      this.getCourses();
    }
  }
  //change filter to see inactive courses
  seeInactiveCourses(event: any) {
    if (event.target?.checked === true) {
      delete this.filter.active;
      this.getCourses();
    } else {
      this.filter.active = ['eq', true];
      this.getCourses();
    }
  }
  //if course was submitted then get courses afain and close the modal.
  formSubmitted(event: boolean) {
    if (event) {
      this.getCourses();
      this.openModal = false;
      this.openedCourse = undefined;
    }
  }
  //open modal for course creation
  createCourse() {
    this.openModal = true;
    this.openedCourse = undefined;
  }
}

@Component({
  template: ` <div style="position: relative">
    <input
      class="form-check-input table-checkbox"
      type="checkbox"
      [checked]="checked"
      disabled
    />
  </div>`,
  providers: [CourseTableComponent],
})
//component to render checkbox as checked in the rows
export class ActiveRenderComponent implements ViewCell, OnInit {
  checked: boolean = false;

  // @ts-ignore
  @Input() value: boolean = false;
  @Input() rowData: any;

  ngOnInit() {
    if (this.value) {
      this.checked = true;
    }
  }
}

@Component({
  template: ` <div style="position: relative">
    <input
      class="form-check-input table-checkbox"
      type="checkbox"
      [checked]="checked"
      (change)="courseSelected($event)"
      [disabled]="disabled"
    />
  </div>`,
})
//component to render the selected courses checkbox in the row
export class SelectCourseComponent implements ViewCell, OnInit {
  checked: boolean = false;

  // @ts-ignore
  @Input() value: boolean = false;
  @Input() rowData: any;
  disabled: boolean = false;

  constructor(private selectedCourse: CourseTableComponent) {}

  ngOnInit() {
    if (this.value) {
      this.checked = true;
    }
    if (!this.rowData.allow_addition) {
      this.disabled = true;
    }
  }
  //trigger event for course being selected and pass in all selected courses and if course is being selected or removed
  courseSelected(event: any) {
    if (event.target?.checked == true) {
      let selectedCourses: any[] = [];
      this.selectedCourse.selectedCourses$
        .pipe(first())
        .subscribe((courses) => {
          selectedCourses = courses.courses! || [];
        });
      this.selectedCourse.setSelectedCourses({
        courses: [...selectedCourses!, this.rowData],
        course: this.rowData,
        add: true,
      });
    } else {
      let selectedCourses: any[] = [];
      this.selectedCourse.selectedCourses$
        .pipe(first())
        .subscribe((courses) => {
          selectedCourses = courses.courses! || [];
        });

      this.selectedCourse.setSelectedCourses({
        courses: selectedCourses.filter(
          (course) => course.id !== this.rowData.id
        ),
        course: this.rowData,
        add: false,
      });
    }
  }
}
