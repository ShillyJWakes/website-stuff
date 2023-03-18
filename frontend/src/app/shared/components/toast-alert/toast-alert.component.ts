import { Component, OnInit } from '@angular/core';
import {
  ToastMessageInterface,
  ToastMessageService,
} from '../../services/toast-message.service';

@Component({
  selector: 'app-toast-alert',
  templateUrl: './toast-alert.component.html',
  styleUrls: ['./toast-alert.component.scss'],
})
export class ToastAlertComponent implements OnInit {
  toastMessage: ToastMessageInterface | undefined;
  show: boolean = true;

  constructor(private toastService: ToastMessageService) {}

  ngOnInit(): void {
    //subscribe to toast service to change upon the toast message changing.
    this.toastService.toastMessage$.subscribe((message) => {
      if (message && message.type !== undefined) {
        this.toastMessage = message;
        this.show = true;
      } else {
        this.toastMessage = {};
        this.show = false;
      }
      //time out message after set delay
      setTimeout(() => {
        this.toastMessage = {};
        this.show = false;
      }, this.toastMessage.delay);
    });
  }
}
