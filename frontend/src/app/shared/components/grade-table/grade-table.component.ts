import { Component, OnInit } from '@angular/core';
import { GradeService } from '../../services/grade.service';
import { ActiveRenderComponent } from '../course-table/course-table.component';
import { GradeModel } from '../../models/completed-course.model';
import { ToastMessageService } from '../../services/toast-message.service';
import { ConfirmationToastService } from '../../services/confirmation-toast.service';

@Component({
  selector: 'app-grade-table',
  templateUrl: './grade-table.component.html',
  styleUrls: ['./grade-table.component.scss'],
})
export class GradeTableComponent implements OnInit {
  columns: any;
  actions: any;
  grades: any;

  constructor(
    private gradeService: GradeService,
    private toastService: ToastMessageService,
    private confirmationToastService: ConfirmationToastService
  ) {
    this.gradeService.getAllGrades(false).subscribe();
  }

  ngOnInit(): void {
    this.actions = {
      edit: true,
      delete: false,
      add: true,
    };
    this.columns = {
      grade: {
        title: 'Grade',
        editable: false,
        width: '100px',
      },
      weight: {
        title: 'Weight',
        editable: true,
        width: '100px',
      },
      description: {
        title: 'Description',
        editable: true,
        width: '100px',
      },
      active: {
        title: 'Active',
        editable: true,
        width: '100px',
        type: 'custom',
        renderComponent: ActiveRenderComponent,
        editor: {
          type: 'checkbox',
          config: {
            true: true,
            false: false,
          },
        },
      },
    };
    this.gradeService.allGrades$.subscribe((grades) => {
      this.grades = grades;
    });
  }

  addGrade(event: any) {
    this.gradeService
      .submitNewGrade(new GradeModel({ ...event.newData }))
      .subscribe(
        () => {
          this.toastService.setToastMessage({
            type: 'success',
            title: 'Grade Added',
            message: 'A new grade has been added.',
            delay: 3000,
          });
          event.confirm.resolve();
        },
        () => {
          this.toastService.setToastMessage({
            type: 'danger',
            title: 'Error Adding Grade',
            message: 'There was an error adding the grade.',
            delay: 1000,
          });
        }
      );
  }

  patchGrade(event: any) {
    this.confirmationToastService.setConfirmationToastMessage({
      title: 'Grade Update',
      message: 'Are you sure want to save the grade?',
      btnOkText: 'Yes',
      btnCancelText: 'No',
      show: true,
      confirmationResponse: (response: boolean) => {
        if (response) {
          this.gradeService.editGrade(event.newData).subscribe(
            () => {
              this.toastService.setToastMessage({
                type: 'success',
                title: 'Grade Updated',
                message: 'The Grade has been updated.',
                delay: 3000,
              });
              event.confirm.resolve();
            },
            () => {
              this.toastService.setToastMessage({
                type: 'danger',
                title: 'Error Updating Grade',
                message: 'There was an error updating the grade.',
                delay: 1000,
              });
            }
          );
        }
      },
    });
  }
}
