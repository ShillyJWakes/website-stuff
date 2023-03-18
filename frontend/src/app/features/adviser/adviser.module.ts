import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdviserRoutingModule } from './adviser-routing.module';
import { AdviserComponent } from './adviser.component';
import { ActivePOWsComponent } from './active-pows/active-pows.component';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';
import { MessagesComponent } from 'src/app/shared/components/messages/messages.component';
import { PowService } from '../../shared/services/pow.service';
import { MessageService } from '../../shared/services/message.service';
import { CompletedCourseService } from '../../shared/services/completed-course.service';
import { ToastMessageService } from '../../shared/services/toast-message.service';
import { GradeService } from '../../shared/services/grade.service';
import { TermService } from '../../shared/services/term.service';
import { CoursesService } from '../../shared/services/courses.service';
import { SpecializationService } from '../../shared/services/specialization.service';

@NgModule({
  declarations: [AdviserComponent, ActivePOWsComponent],
  providers: [
    PowService,
    MessageService,
    CompletedCourseService,
    GradeService,
    TermService,
    CoursesService,
    SpecializationService,
  ],
  imports: [CommonModule, AdviserRoutingModule, CoreModule, SharedModule],
})
export class AdviserModule {}
