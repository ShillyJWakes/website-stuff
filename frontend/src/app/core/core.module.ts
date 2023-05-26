import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CardComponent } from './components/card/card.component';

import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { ModalComponent } from './components/modal/modal.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';

@NgModule({
  declarations: [
    NavbarComponent,
    SidenavComponent,
    MainContentComponent,
    CardComponent,
    FooterComponent,
    ModalComponent,
    NotFoundComponent,
    UnauthorizedComponent,
  ],
  imports: [CommonModule, NgbModule, RouterModule],
  exports: [
    NavbarComponent,
    CommonModule,
    SidenavComponent,
    MainContentComponent,
    CardComponent,
    FooterComponent,
    ModalComponent,
  ],
})
export class CoreModule {}
