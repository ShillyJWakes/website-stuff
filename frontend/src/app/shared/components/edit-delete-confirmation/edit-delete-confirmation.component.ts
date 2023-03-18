import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import {
  ConfirmationToastService,
  ConfirmMessageInterface,
} from '../../services/confirmation-toast.service';

@Component({
  selector: 'app-edit-delete-confirmation',
  templateUrl: './edit-delete-confirmation.component.html',
  styleUrls: ['./edit-delete-confirmation.component.scss'],
})
export class EditDeleteConfirmationComponent implements OnInit {
  confirmMessage: ConfirmMessageInterface | undefined;
  constructor(private _confirmationToastService: ConfirmationToastService) {}

  ngOnInit() {
    this._confirmationToastService.confirmationToastMessage$.subscribe(
      (response) => {
        if (response && response.title !== undefined) {
          this.confirmMessage = response;
        } else {
          this.confirmMessage = undefined;
        }
      }
    );
  }

  public accept() {
    this.confirmMessage?.confirmationResponse?.(true);
    this.confirmMessage = undefined;
  }

  public dismiss() {
    this.confirmMessage?.confirmationResponse?.(false);
    this.confirmMessage = undefined;
  }
}
