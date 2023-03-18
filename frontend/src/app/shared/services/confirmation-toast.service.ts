import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ConfirmMessageInterface {
  title?: string | undefined;
  message?: string | undefined;
  btnOkText?: string | undefined;
  btnCancelText?: string | undefined;
  show?: boolean;
  confirmationResponse?: (response: boolean) => void | undefined | boolean;
}

@Injectable({ providedIn: 'root' })
export class ConfirmationToastService {
  private _confirmationToastMessage$ =
    new BehaviorSubject<ConfirmMessageInterface>({});
  public confirmationToastMessage$ =
    this._confirmationToastMessage$.asObservable();

  constructor() {}

  setConfirmationToastMessage(
    confirmMessageInterface: ConfirmMessageInterface
  ) {
    this._confirmationToastMessage$.next(confirmMessageInterface);
  }
}
