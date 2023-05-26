import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { MessageModel } from '../../models/message.model';
import { MessageService } from '../../services/message.service';
import { PowService } from '../../services/pow.service';
import * as dayjs from 'dayjs';
import { ToastMessageService } from '../../services/toast-message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  activeMessages: MessageModel[] | undefined;

  currentUser: any;

  sender: any;
  receiver: any;

  messages: any;

  ableToSend: any;
  powOnFile: any;

  hasPow: any;

  messageToSend: '' | undefined;

  columns: any;
  actions: any;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private powService: PowService,
    private toastService: ToastMessageService
  ) {
    //getting the current user
    this.currentUser = this.authService.currentUserValue?.id;

    //getting the current POW that has been selected
    this.powOnFile = this.powService.currentPow$.subscribe((pow) => {
      this.hasPow = true;
      //getting all messages when pow is selected
      this.messageService.getAllMessages(pow?.id).subscribe();
    });
    this.ableToSend = false;
  }

  ngOnInit(): void {
    //subscribing to the messaging service
    this.messageService.allMessages$.subscribe((messages) => {
      this.messages = messages;
      if (this.powService.currentPow?.id) {
        this.hasPow = true;
      } else {
        this.hasPow = false;
      }
    });
  }

  updateMyMessage(value: any) {
    this.messageToSend = value;
    this.messageToSend === ''
      ? (this.ableToSend = false)
      : (this.ableToSend = true);
  }

  //Function to send messages to the database
  sendMyMessage() {
    if (this.ableToSend) {
      const newMessage = {
        sender_id: this.currentUser,
        pow_id: this.powService.currentPow?.id,
        message: this.messageToSend,
        send_time: dayjs().toDate(),
      };
      //subitting new messages to the database, recording which POW they relate to
      this.messageService.submitNewMessage(newMessage).subscribe(
        () => {
          this.powService.currentPow$.subscribe((pow) => {
            this.messageService.getAllMessages(pow.id).subscribe();
          });
          this.messageToSend = '';
          this.ableToSend = false;
        },
        //error message
        (error) => {
          this.toastService.setToastMessage({
            type: 'danger',
            title: 'Message Not Sent',
            message: 'There was an error sending your message.',
            delay: 5000,
          });
        }
      );
    }
  }
}
