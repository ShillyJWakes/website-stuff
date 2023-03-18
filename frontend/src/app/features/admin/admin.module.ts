import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { CoursesComponent } from './courses/courses.component';
import { TermsComponent } from './terms/terms.component';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';
import { UserMgmtComponent } from './user-mgmt/user-mgmt.component';
import { PowsComponent } from './pows/pows.component';
import { CoursesService } from '../../shared/services/courses.service';
import { PowService } from '../../shared/services/pow.service';
import { GradeService } from '../../shared/services/grade.service';
import { TermService } from '../../shared/services/term.service';
import { ToastMessageService } from '../../shared/services/toast-message.service';
import { SpecializationService } from '../../shared/services/specialization.service';
import { CompletedCourseService } from '../../shared/services/completed-course.service';
import { MessageService } from '../../shared/services/message.service';

//import {UserCsvUploadComponent } from "../../shared/components/user-csv-upload/user-csv-upload.component"

@NgModule({
  declarations: [
    AdminComponent,
    CoursesComponent,
    TermsComponent,
    UserMgmtComponent,
    PowsComponent,
  ],
  providers: [
    CoursesService,
    PowService,
    GradeService,
    TermService,
    SpecializationService,
    CompletedCourseService,
    MessageService,
  ],
  imports: [CommonModule, AdminRoutingModule, CoreModule, SharedModule],
})
export class AdminModule {}
