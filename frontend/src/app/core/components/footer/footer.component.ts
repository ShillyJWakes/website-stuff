import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RoleModel } from '../../models/role.model';
import { UserRoleModel } from '../../models/user-role.model';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  rolesList: UserRoleModel[] | undefined;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    //get role list of current user
    this.authService.currentUser$?.subscribe((currentUser) => {
      this.rolesList = currentUser.userRoles;
    });
  }
}
