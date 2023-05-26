import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './student.component';
import { ExamineComponent } from './examine/examine.component';
import { CreateComponent } from './create/create.component';
import { CoursesResolver } from '../../shared/resolvers/courses.resolver';

const routes: Routes = [
  {
    path: '',
    component: StudentComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'examine',
      },
      {
        path: 'examine',
        component: ExamineComponent,
      },
      { path: 'create', component: CreateComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
