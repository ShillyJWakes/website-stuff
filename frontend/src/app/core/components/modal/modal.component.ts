import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';

import {
  NgbModal,
  NgbActiveModal,
  NgbModalConfig,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  providers: [NgbModalConfig, NgbActiveModal, NgbModal],
})
export class ModalComponent implements OnChanges {
  @Input() modalTitle: string | undefined;
  @Input() modalId: string | undefined;
  @Input() openModal: boolean = false;
  @Input() icon: string | undefined;
  @Output() modalClosed: EventEmitter<any> = new EventEmitter();
  @ViewChild('content') content: any;
  private closeAll: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {}

  //open the modal with the content and set what will happen upon close and dismiss
  open(content: any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: this.modalId,
        backdrop: 'static',
        keyboard: false,
      })
      .result.then(
        () => {
          this.openModal = false;
          this.modalClosed.emit(true);
        },
        () => {
          this.openModal = false;
        }
      );
  }

  //open modal if input is changed to true, dismiss if changed to false
  ngOnChanges(): void {
    if (this.openModal) {
      this.open(this.content);
      this.activeModal.close();
    } else if (this.closeAll) {
      this.modalService.dismissAll();
    }
  }
}
