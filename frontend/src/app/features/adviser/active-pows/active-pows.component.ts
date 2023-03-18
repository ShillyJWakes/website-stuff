import { Component, Input, OnInit } from '@angular/core';
import { PowModel } from 'src/app/shared/models/pow.model';
import { UserRoleModel } from 'src/app/core/models/user-role.model';
import { UserModel } from 'src/app/core/models/user.model';
import { PowService } from 'src/app/shared/services/pow.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-active-pows',
  templateUrl: './active-pows.component.html',
  styleUrls: ['./active-pows.component.scss'],
})
export class ActivePOWsComponent implements OnInit {
  isAdviser: any;
  messages = 'Messages';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  getUserTypes() {
    return this.authService.currentUserValue?.userRoles?.map((userRole) => {});
  }
}
