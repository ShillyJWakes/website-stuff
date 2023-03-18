import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CoursesComponent } from './courses/courses.component';
import { TermsComponent } from './terms/terms.component';
import { UserMgmtComponent } from './user-mgmt/user-mgmt.component';
import { PowsComponent } from './pows/pows.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'course-mgmt',
      },
      { path: 'course-mgmt', component: CoursesComponent },
      { path: 'course-mgmt/course/:id', component: CoursesComponent },
      { path: 'terms', component: TermsComponent },
      { path: 'users', component: UserMgmtComponent },
      { path: 'pows', component: PowsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
