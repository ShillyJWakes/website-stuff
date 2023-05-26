import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideButtonComponent } from './components/side-button/side-button.component';
import { RouterModule } from '@angular/router';
import { SmartTableComponent } from './components/smart-table/smart-table.component';
import { Ng2SmartTableModule } from '@vamidicreations/ng2-smart-table';
import {
  CourseTableComponent,
  ActiveRenderComponent,
  SelectCourseComponent,
} from './components/course-table/course-table.component';
import { CoreModule } from '../core/core.module';
import { CourseFormComponent } from './components/course-form/course-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpecializationTableComponent } from './components/specialization-table/specialization-table.component';
import { SpecializationFormComponent } from './components/specialization-form/specialization-form.component';
import { UserTableComponent } from './components/user-table/user-table.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import {
  DateEditorComponent,
  TermTableComponent,
} from './components/term-table/term-table.component';
import { GradeTableComponent } from './components/grade-table/grade-table.component';
import { TermCourseTableComponent } from './components/term-course-table/term-course-table.component';
import { PowsForApprovalComponent } from './components/pows-for-approval/pows-for-approval.component';
import { PowViewerComponent } from './components/pow-viewer/pow-viewer.component';
import { CourseViewComponent } from './components/course-view/course-view.component';
import { MessagesComponent } from './components/messages/messages.component';
import { PowFormComponent } from './components/pow-form/pow-form.component';
import {
  SpecializationViewerComponent,
  TermDropdownRenderComponent,
} from './components/specialization-viewer/specialization-viewer.component';
import { FancyFormInputComponent } from './components/fancy-form-input/fancy-form-input.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastAlertComponent } from './components/toast-alert/toast-alert.component';
import { QuillModule } from 'ngx-quill';
//import { SpecializationViewerComponent } from './components/specialization-viewer/specialization-viewer.component';
import { UserCsvUploadComponent } from './components/user-csv-upload/user-csv-upload.component';
import { UserRoleFormComponent } from './components/user-role-form/user-role-form.component';
import { InitialResetPasswordComponent } from './components/initial-reset-password/initial-reset-password.component';
import { InitialResetPasswordFormComponent } from './components/initial-reset-password-form/initial-reset-password-form.component';
import { EditDeleteConfirmationComponent } from './components/edit-delete-confirmation/edit-delete-confirmation.component';
import { NgxDropzoneModule } from 'ngx-dropzone';

@NgModule({
  declarations: [
    SideButtonComponent,
    SmartTableComponent,
    CourseTableComponent,
    CourseFormComponent,
    SpecializationTableComponent,
    SpecializationFormComponent,
    ActiveRenderComponent,
    UserTableComponent,
    UserFormComponent,
    TermTableComponent,
    GradeTableComponent,
    TermCourseTableComponent,
    PowsForApprovalComponent,
    PowViewerComponent,
    CourseViewComponent,
    MessagesComponent,
    PowFormComponent,
    SpecializationViewerComponent,
    FancyFormInputComponent,
    ToastAlertComponent,
    TermDropdownRenderComponent,
    SelectCourseComponent,
    DateEditorComponent,
    UserCsvUploadComponent,
    UserRoleFormComponent,
    EditDeleteConfirmationComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    Ng2SmartTableModule,
    NgxDropzoneModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    QuillModule,
  ],
  exports: [
    SideButtonComponent,
    SmartTableComponent,
    CourseTableComponent,
    SpecializationTableComponent,
    ActiveRenderComponent,
    UserTableComponent,
    UserFormComponent,
    GradeTableComponent,
    TermTableComponent,
    UserCsvUploadComponent,
    UserRoleFormComponent,
    PowsForApprovalComponent,
    TermCourseTableComponent,
    PowViewerComponent,
    MessagesComponent,
    PowFormComponent,
    SpecializationViewerComponent,
    FancyFormInputComponent,
    ToastAlertComponent,
    TermDropdownRenderComponent,
    EditDeleteConfirmationComponent,
  ],
})
export class SharedModule {}
