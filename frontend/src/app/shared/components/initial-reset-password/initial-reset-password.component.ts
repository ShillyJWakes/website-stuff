import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserModel } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-initial-reset-password',
  templateUrl: './initial-reset-password.component.html',
  styleUrls: ['./initial-reset-password.component.scss'],
})
export class InitialResetPasswordComponent implements OnInit {
  columns: any;
  actions: any;
  allUsers: UserModel[] | undefined;

  openModal: boolean = false;
  openedUser: UserModel | undefined;

  userActive: any;

  currentUser: UserModel | undefined;

  constructor(
    private userService: UsersService,
    private authService: AuthService
  ) {
    this.userService.getAllUsers(1, 10).subscribe();
    this.currentUser = this.authService.currentUserValue;
    this.openedUser = this.currentUser;
  }

  ngOnInit(): void {
    this.userActive = this.currentUser?.active;
  }

  openUserInfo(event: any) {
    this.openModal = true;
    this.openedUser = event.data;
  }

  closeModal(event: any) {
    this.openModal = !event;
    this.openedUser = undefined;
  }
}
