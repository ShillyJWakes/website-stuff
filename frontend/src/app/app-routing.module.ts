import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/services/auth.guard';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { UnauthorizedComponent } from './core/components/unauthorized/unauthorized.component';
import { AdminGuard } from './core/services/admin.guard';
import { AdviserGuard } from './core/services/adviser.guard';
import { StudentGuard } from './core/services/student.guard';
import { LoginGuard } from './core/services/login.guard';

const routes: Routes = [
  {
    path: 'student',
    canActivate: [AuthGuard, StudentGuard],
    loadChildren: () =>
      import('./features/student/student.module').then((m) => m.StudentModule),
  },
  {
    path: 'adviser',
    canActivate: [AuthGuard, AdviserGuard],
    loadChildren: () =>
      import('./features/adviser/adviser.module').then((m) => m.AdviserModule),
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    loadChildren: () =>
      import('./features/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'login',
    canActivate: [LoginGuard],
    loadChildren: () =>
      import('./features/login/login.module').then((m) => m.LoginModule),
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'unauthorized', component: UnauthorizedComponent },

  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
