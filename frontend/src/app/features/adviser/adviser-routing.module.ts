import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdviserComponent } from './adviser.component';
import { ActivePOWsComponent } from './active-pows/active-pows.component';

const routes: Routes = [
  {
    path: '',
    component: AdviserComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'active-pows',
      },
      { path: 'active-pows', component: ActivePOWsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdviserRoutingModule {}
