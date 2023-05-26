import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ToastMessageInterface {
  type?: string;
  message?: string;
  title?: string;
  delay?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastMessageService {
  private _toastMessage$ = new BehaviorSubject<ToastMessageInterface>({});
  public toastMessage$ = this._toastMessage$.asObservable();

  constructor() {}

  setToastMessage(message: ToastMessageInterface) {
    this._toastMessage$.next(message);
  }

  deleteToastMessage() {
    this._toastMessage$.next({});
  }
}
