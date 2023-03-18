import { Component, OnInit } from '@angular/core';
import { ToastMessageService } from '../../services/toast-message.service';
import { UsersService } from '../../services/users.service';
import { ConfirmationToastService } from '../../services/confirmation-toast.service';

@Component({
  selector: 'app-user-csv-upload',
  templateUrl: './user-csv-upload.component.html',
  styleUrls: ['./user-csv-upload.component.scss'],
})
export class UserCsvUploadComponent {
  usersFile: File | undefined;
  sending = false;
  success = false;
  error = false;
  disableButton = true;
  files: File[] = [];

  constructor(
    private userService: UsersService,
    private toastService: ToastMessageService,
    private confirmationToastService: ConfirmationToastService
  ) {}

  //records the file that was given in the form. If there is already a file in the array, remove it and replace it with the current one
  onSelect(event: any) {
    this.error = false;
    this.files.splice(this.files.indexOf(event), 1);
    this.files.push(...event.addedFiles);
    this.disableButton = false;
  }

  //removes the file that was on the form
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
    this.disableButton = true;
  }

  sendFile() {
    this.confirmationToastService.setConfirmationToastMessage({
      title: 'User Creation',
      message: 'Are you sure you want to create these users?',
      btnOkText: 'Yes',
      btnCancelText: 'No',
      show: true,
      confirmationResponse: (response: boolean) => {
        if (response) {
          this.success = false;
          this.sending = true;
          this.error = false;

          //if there is a file recorded in the array, continue
          if (this.files[0]) {
            //sending the file in the request
            this.userService.uploadCsvFile(this.files[0]).subscribe(
              () => {
                this.success = true;
                this.sending = false;
                //confirmation message
                this.toastService.setToastMessage({
                  type: 'success',
                  title: 'Users Created',
                  message:
                    'The users have been created from the provided CSV file.',
                  delay: 5000,
                });

                //retrieving all the users from the database in order to keep the existing users section up to date.
                this.userService.getAllUsers(1, 10).subscribe();
              },

              //error message
              (error) => {
                this.success = false;
                this.error = true;
                this.sending = false;
                this.toastService.setToastMessage({
                  type: 'danger',
                  title: 'Error Creating Users',
                  message:
                    'There was an error creating the users from the CSV file provided.',
                  delay: 5000,
                });
              }
            );
          } else {
            this.sending = false;
            this.error = true;
          }
        }
      },
    });
  }
}
