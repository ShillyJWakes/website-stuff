import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { LocalDataSource } from '@vamidicreations/ng2-smart-table';

@Component({
  selector: 'app-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.scss'],
})
export class SmartTableComponent implements OnInit, OnChanges {
  //inputs to configure smart table
  @Input() tableHeaderHide: boolean = true;
  @Input() tableColumns: object = {};
  @Input() tableData: any = [];
  @Input() tableActions: object = {};
  @Input() tableTitle: string | undefined;
  @Input() selectionType: string = 'none';
  @Input() search: boolean = false;
  @Input() noDataMessage: string = 'Nothing to show!';
  @Input() pagination: { perPage: number; pageNumber: number } = {
    perPage: 1,
    pageNumber: 1,
  };
  //event emitters for table actions
  @Output() selectedRows: EventEmitter<any> = new EventEmitter();
  @Output() customAction: EventEmitter<any> = new EventEmitter();
  @Output() editedRow: EventEmitter<any> = new EventEmitter();
  @Output() deletedRow: EventEmitter<any> = new EventEmitter();
  @Output() createdRow: EventEmitter<any> = new EventEmitter();
  @Output() currentPage: EventEmitter<{ perPage: number; pageNumber: number }> =
    new EventEmitter();
  //smart table settings
  settings = {
    noDataMessage: 'Nothing to show!',
    hideSubHeader: true,
    selectMode: '',
    hideHeader: false,
    actions: {},
    columns: {},
    add: {
      addButtonContent: 'Add',
      createButtonContent: 'Create',
      cancelButtonContent: 'Cancel',
      confirmCreate: true,
    },
    delete: {
      deleteButtonContent: 'Delete',
      confirmDelete: true,
    },
    edit: {
      editButtonContent: 'Edit',
      saveButtonContent: 'Update',
      cancelButtonContent: 'Cancel',
      confirmSave: true,
    },
  };

  data: LocalDataSource | undefined;

  constructor() {}

  ngOnInit() {
    //set smart table settings from inputs on table init
    this.settings = {
      noDataMessage: this.noDataMessage,
      hideSubHeader: !this.search,
      selectMode: this.selectionType,
      hideHeader: this.tableHeaderHide,
      actions: this.tableActions,
      columns: this.tableColumns,
      add: {
        addButtonContent:
          '<span class="material-icons table-icons"> add_circle </span>',
        createButtonContent:
          '<span class="material-icons table-icons"> check </span>',
        cancelButtonContent:
          '<span class="material-icons table-icons-red"> delete_forever </span>',
        confirmCreate: true,
      },
      delete: {
        deleteButtonContent:
          '<span class="material-icons table-icons-red"> delete_forever </span>',
        confirmDelete: true,
      },
      edit: {
        editButtonContent:
          '<span class="material-icons table-icons"> edit </span>',
        saveButtonContent:
          '<span class="material-icons table-icons"> save </span>',
        cancelButtonContent:
          '<span class="material-icons table-icons-red"> close </span>',
        confirmSave: true,
      },
    };
    this.data = this.tableData;
  }
  //update table data when it changes
  ngOnChanges() {
    this.data = this.tableData;
  }

  onCustom(event: any) {
    this.customAction.emit(event);
  }

  editRow(event: any) {
    this.editedRow.emit(event);
  }

  deleteRow(event: any) {
    this.deletedRow.emit(event);
  }

  createRow(event: any) {
    this.createdRow.emit(event);
  }
}
