import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { UserModel } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss'],
})
export class UserTableComponent implements OnInit {
  columns: any;
  actions: any;
  allUsers: UserModel[] | undefined;
  openModal: boolean = false;
  openedUser: UserModel | undefined;
  constructor(private userService: UsersService) {
    this.userService.getAllUsers(1, 10).subscribe();
  }

  ngOnInit(): void {
    this.actions = {
      edit: false,
      delete: false,
      add: false,
      custom: [
        {
          name: 'open',
          title: '<span class="material-icons table-icons">open_in_new</span>',
        },
      ],
    };
    this.columns = {
      firstName: {
        title: 'First Name',
      },
      lastName: {
        title: 'last Name',
      },
      accessID: {
        title: 'Access ID',
      },
    };
    this.userService.allUsers$.subscribe((users) => {
      this.allUsers = users;
    });
  }

  openUserInfo(event: any) {
    this.openModal = true;
    this.openedUser = event.data;
  }

  closeModal(event: any) {
    this.openModal = !event;
    this.openedUser = undefined;
  }

  loadCurrentPage(event: { perPage: number; pageNumber: number }) {
    this.userService.getAllUsers(event.pageNumber, event.perPage).subscribe();
  }
}
