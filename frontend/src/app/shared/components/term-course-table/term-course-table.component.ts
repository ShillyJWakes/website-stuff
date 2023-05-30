import { Component, OnInit } from '@angular/core';
import { TermService } from '../../services/term.service';
import { TermCourseModel, TermModel } from '../../models/term.model';
import * as dayjs from 'dayjs';
import { first } from 'rxjs/operators';
import { CourseModel } from '../../models/course.model';
import { ToastMessageService } from '../../services/toast-message.service';
import { ConfirmationToastService } from '../../services/confirmation-toast.service';

@Component({
  selector: 'app-term-course-table',
  templateUrl: './term-course-table.component.html',
  styleUrls: ['./term-course-table.component.scss'],
})
export class TermCourseTableComponent implements OnInit {
  columns: any;
  actions: any;
  courses: any;
  hideTable: boolean = true;
  hideAddCourses: boolean = true;
  openModal: boolean = false;
  preSelected: any;
  private newTerm: TermModel | undefined;

  constructor(
    private termService: TermService,
    private toastService: ToastMessageService,
    private confirmationToastService: ConfirmationToastService
  ) {}

  ngOnInit(): void {
    this.actions = {
      edit: false,
      delete: false,
      add: false,
    };
    this.columns = {
      department: {
        title: 'Dept.',
        editable: false,
        width: '90px',
      },
      courseNumber: {
        title: 'Course',
        editable: false,
        width: '100px',
      },
      courseProfile: {
        title: 'Course Title',
        editable: false,
      },
    };
    this.termService.term$.subscribe((term) => {
      //hide or show table based on if term is set
      if (term.active !== undefined) {
        this.hideTable = false;
      } else {
        this.hideTable = true;
      }
      //lock term based on first day of class -- Dennis
      if (
        term.active !== undefined &&
        !dayjs(term.firstDayClass).isBefore(dayjs())
      ) {
        this.hideAddCourses = false;
      } else {
        this.hideAddCourses = true;
      }
      //set term courses to the table column
      this.courses = term?.termCourses?.map((course) => ({
        termId: course.id,
        courseId: course.course?.id,
        department: course.course?.department,
        courseNumber: course.course?.courseNumber,
        courseProfile: course.course?.courseProfile,
      }));
      //set term courses as preselected for course table
      this.preSelected = this.courses?.map((course: { courseId: any }) => ({
        id: course.courseId,
        ...course,
      }));
    });
  }

  addSelectedCourses(event: any) {
    this.courses = event.courses?.map(
      (course: CourseModel) =>
        new TermCourseModel({
          course: {
            id: course.id,
            department: course.department,
            course_number: course.courseNumber,
            course_profile: course.courseProfile,
          },
        })
    );
    this.termService.term$.pipe(first()).subscribe((term) => {
      term.termCourses = this.courses;
      this.newTerm = term;
    });
    this.termService.setCurrentTerm(this.newTerm!);
  }

  closeModal(event: any) {
    this.openModal = !event;
  }

  submitTerm() {
    this.confirmationToastService.setConfirmationToastMessage({
      title: 'Save Term',
      message: 'Are you sure want to save the term',
      btnOkText: 'Yes',
      btnCancelText: 'No',
      show: true,
      confirmationResponse: (response: boolean) => {
        if (response) {
          this.termService.term$.pipe(first()).subscribe((term) => {
            if (term.id === undefined) {
              this.termService.submitNewTerm(term).subscribe(
                () => {
                  this.toastService.setToastMessage({
                    type: 'success',
                    title: 'Term Saved',
                    message: 'The term has been saved.',
                    delay: 3000,
                  });
                },
                () => {
                  this.toastService.setToastMessage({
                    type: 'danger',
                    title: 'Error Saving Term',
                    message: 'There was an error saving the term.',
                    delay: 1000,
                  });
                }
              );
            } else if (term.termCourses !== undefined) {
              this.termService
                .submitNewTermCourses(term.termCourses, term.id)
                .subscribe(
                  () => {
                    this.toastService.setToastMessage({
                      type: 'success',
                      title: 'Term Saved',
                      message: 'The term has been saved.',
                      delay: 3000,
                    });
                  },
                  () => {
                    this.toastService.setToastMessage({
                      type: 'danger',
                      title: 'Error Saving Term',
                      message: 'There was an error saving the term.',
                      delay: 1000,
                    });
                  }
                );
            }
          });
        }
      },
    });
  }

  removeCourse(event: any) {
    this.termService.term$.pipe(first()).subscribe((term) => {
      const courseArray = term.termCourses;
      const index = courseArray?.findIndex(
        (course: { id: any }) => course.id === event.data.id
      );
      if (index! > -1) {
        courseArray?.splice(index!, 1);
      }
      term.termCourses = courseArray;
      this.newTerm = term;
      event.confirm.resolve();
    });
    this.termService.setCurrentTerm(this.newTerm || new TermModel(undefined));
  }
}
