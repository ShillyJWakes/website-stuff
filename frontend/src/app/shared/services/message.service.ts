import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { FilterInterface } from '../../core/models/filter.interface';
import { MessageModel } from '../models/message.model';
import { PowService } from './pow.service';

@Injectable()
export class MessageService {
  public activePOW = PowService.currentPow$;
  private _allMessages$ = new BehaviorSubject<MessageModel[]>([]);
  public allMessages$ = this._allMessages$.asObservable();

  constructor(private http: HttpClient) {}

  public get allMessages(): MessageModel[] | undefined {
    return this._allMessages$.value;
  }

  //recording all the messages in order for them to be usable with the service
  setAllMessages(messages: any[]) {
    this._allMessages$.next(
      messages.map((message) => {
        return new MessageModel(
          message.id,
          message.sender.first_name,
          message.sender_id,
          message.message,
          message.sendTime,
          message.pow
        );
      })
    );
  }

  //API call that gets all the messages based on a POW ID
  getAllMessages(powId: number | undefined): Observable<void> {
    return this.http.get<any>(`${environment.apiUrl}/messages/${powId}`).pipe(
      map((response) => {
        this.setAllMessages(response);
      })
    );
  }

  //Writes to the database that creates the messages
  submitNewMessage(message: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/message`, message);
  }
}
