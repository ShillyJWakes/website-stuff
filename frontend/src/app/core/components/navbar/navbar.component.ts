import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  showLogout: boolean = false;
  constructor(private authService: AuthService) {}

  //function to call logout from auth service
  logOut() {
    this.authService.logout();
  }

  ngOnInit() {
    //subscribe to current user to show logout button if user is logged in
    this.authService.currentUser$.subscribe((user) => {
      this.showLogout = user.id !== undefined;
    });
  }
}
