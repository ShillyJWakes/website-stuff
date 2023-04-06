import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActiveRenderComponent } from '../course-table/course-table.component';
import { TermService } from '../../services/term.service';
import { TermModel } from '../../models/term.model';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DefaultEditor } from '@vamidicreations/ng2-smart-table';
import * as dayjs from 'dayjs';
import { ToastMessageService } from '../../services/toast-message.service';
import { ConfirmationToastService } from '../../services/confirmation-toast.service';

@Component({
  selector: 'app-term-table',
  templateUrl: './term-table.component.html',
  styleUrls: ['./term-table.component.scss'],
})
export class TermTableComponent implements OnInit, OnDestroy {
  columns: any;
  actions: any;
  terms: any;
  private filter: {} = {};

  constructor(
    private termService: TermService,
    private toastService: ToastMessageService,
    private confirmationToastService: ConfirmationToastService
  ) {
    this.getTerms();
  }

  //destroy toast message to prevent it from appearing multiple times
  ngOnDestroy(): void {
    this.toastService.setToastMessage({});
  }

  getTerms() {
    this.termService
      .getAllTerms({ filter: this.filter, order: '', page: 1, perPage: 999 })
      .subscribe();
  }

  ngOnInit(): void {
    this.actions = {
      edit: true,
      delete: true,
      add: true,
      custom: [
        {
          name: 'open',
          title: '<span class="material-icons table-icons">open_in_new</span>',
        },
      ],
    };
    this.columns = {
      termName: {
        title: 'Term',
        editable: true,
        width: '150px',
      },
      startDate: {
        title: 'Start Date',
        editable: true,
        valuePrepareFunction: (date: any) => {
          return dayjs(date).format('MMM D, YYYY');
        },
        editor: {
          type: 'custom',
          component: DateEditorComponent,
        },
      },
      endDate: {
        title: 'End Date',
        editable: true,
        valuePrepareFunction: (date: any) => {
          return dayjs(date).format('MMM D, YYYY');
        },
        editor: {
          type: 'custom',
          component: DateEditorComponent,
        },
      },
      active: {
        title: 'Active',
        editable: true,
        width: '30px',
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
    this.termService.allTerms$.subscribe((terms) => {
      this.terms = terms;
    });
  }

  //remove current term if selected and set new term
  openTerm(event: any) {
    this.termService.removeTerm();
    this.termService.getTerm(event.data.id).subscribe();
  }

  //event to create new term
  addTerm(event: any) {
    this.termService.setCurrentTerm(
      new TermModel({
        term_name: event.newData.termName,
        active: event.newData.active,
        term_start: event.newData.startDate,
        term_end: event.newData.endDate,
      })
    );
    event.confirm.resolve();
  }

  //event to patch term info
  patchEditedTerm(event: any) {
    this.confirmationToastService.setConfirmationToastMessage({
      title: 'Term Edit',
      message: 'Are you sure want to edit the term?',
      btnOkText: 'Yes',
      btnCancelText: 'No',
      show: true,
      confirmationResponse: (response: boolean) => {
        if (response) {
          this.termService.editTerm(event.newData).subscribe(
            () => {
              this.toastService.setToastMessage({
                type: 'success',
                title: 'Term Saved',
                message: 'The term has been saved.',
                delay: 3000,
              });
              this.getTerms();
            },
            () => {
              this.toastService.setToastMessage({
                type: 'danger',
                title: 'Error Saving Term',
                message: 'There was an error saving your term.',
                delay: 10000,
              });
            }
          );
        }
      },
    });
  }
}

@Component({
  template: `
    <div class="form-group date-form">
      <div class="input-group">
        <input
          class="form-control"
          placeholder="yyyy-mm-dd"
          [name]="cell.getId()"
          [disabled]="!cell.isEditable()"
          [(ngModel)]="model"
          (ngModelChange)="updateDate($event)"
          ngbDatepicker
          #datePicker
          #d="ngbDatepicker"
        />
        <div class="input-group-append">
          <button
            class="btn btn-outline-primary calendar-btn"
            (click)="d.toggle()"
            type="button"
          >
            <span class="material-icons"> event </span>
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./term-table.component.scss'],
})
//component to render custom editor for date field
export class DateEditorComponent
  extends DefaultEditor
  implements AfterViewInit
{
  @ViewChild('datePicker') date: ElementRef | undefined;
  model: NgbDateStruct | undefined;

  constructor() {
    super();
  }

  ngAfterViewInit() {
    const year = dayjs(this.cell.newValue).year();
    const day = dayjs(this.cell.newValue).date();
    const month = dayjs(this.cell.newValue).month();

    this.model = { year: year, day: day, month: month + 1 };
  }

  updateDate(event: any) {
    this.cell.newValue = this.date?.nativeElement.value;
  }
}
