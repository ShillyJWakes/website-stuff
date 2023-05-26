import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { MessageService } from '../../services/message.service';
import { PowService } from '../../services/pow.service';

@Component({
  selector: 'app-pows-for-approval',
  templateUrl: './pows-for-approval.component.html',
  styleUrls: ['./pows-for-approval.component.scss'],
})
export class PowsForApprovalComponent implements OnInit {
  columns: any;
  actions: any;
  pows: any;
  @Input() isAdmin: any;
  @Input() isAdviser: any;
  viewPows: boolean = false;
  private filter: { status?: string[] } = {
    status: ['eq', 'Pending Graduation'],
  };

  constructor(
    private powService: PowService,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.getPows();
  }

  getPows() {
    this.powService
      .getAllPows({
        filter: this.filter,
        order: '',
        page: 1,
        perPage: 10,
      })
      .subscribe();
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
      student: {
        title: 'Student',
        width: '100px',
      },
      specialization: {
        title: 'Specialization',
        width: '100px',
      },
      status: {
        title: 'Status',
        width: '100px',
      },
    };
    this.powService.allPows$.subscribe((pows) => {
      this.viewPows = pows.length > 0;
      this.pows = pows.map((pow) => ({
        id: pow.id,
        student: pow.student?.user?.firstName,
        specialization: pow.specialization?.specialization,
        status: pow.status,
      }));
    });
    if (this.isAdmin) {
      this.powService
        .getAllPows({
          filter: { status: ['eq', 'Pending Graduation'] },
          order: '',
          page: 1,
          perPage: 10,
        })
        .subscribe();
    } else if (this.isAdviser) {
      this.powService
        .getAllPows({
          filter: { status: ['eq', 'Pending Approval'] },
          order: '',
          page: 1,
          perPage: 10,
        })
        .subscribe();
    }
  }

  openPow(event: any) {
    this.powService.removeCurrentPow();
    this.powService.getPow(event.data.id).subscribe();
    this.messageService.getAllMessages(event.data.id).subscribe();
  }

  seeAllPows(event: any) {
    if (event.target?.checked === true) {
      delete this.filter.status;
      this.getPows();
    } else {
      if (this.isAdmin) {
        this.powService
          .getAllPows({
            filter: { status: ['eq', 'Pending Graduation'] },
            order: '',
            page: 1,
            perPage: 10,
          })
          .subscribe();
      } else if (this.isAdviser) {
        this.powService
          .getAllPows({
            filter: { status: ['eq', 'Pending Approval'] },
            order: '',
            page: 1,
            perPage: 10,
          })
          .subscribe();
      }
    }
  }
}
