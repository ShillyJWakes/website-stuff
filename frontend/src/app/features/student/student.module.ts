import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { StudentComponent } from './student.component';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';
import { ExamineComponent } from './examine/examine.component';
import { CreateComponent } from './create/create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CoursesService } from '../../shared/services/courses.service';
import { PowService } from '../../shared/services/pow.service';
import { GradeService } from '../../shared/services/grade.service';
import { TermService } from '../../shared/services/term.service';
import { SpecializationService } from '../../shared/services/specialization.service';
import { CompletedCourseService } from '../../shared/services/completed-course.service';
import { MessageService } from '../../shared/services/message.service';

@NgModule({
  declarations: [
    StudentComponent,
    ExamineComponent,
    CreateComponent,
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
  imports: [
    CommonModule,
    StudentRoutingModule,
    CoreModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class StudentModule {}
