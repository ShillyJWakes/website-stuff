import { Component, Input, OnInit } from '@angular/core';
import { CourseModel } from '../../models/course.model';
import { SpecializationModel } from '../../models/specialization.model';
import { ActiveRenderComponent } from '../course-table/course-table.component';
import { SpecializationService } from '../../services/specialization.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-specialization-table',
  templateUrl: './specialization-table.component.html',
  styleUrls: ['./specialization-table.component.scss'],
})
export class SpecializationTableComponent implements OnInit {
  @Input() viewSpecs: boolean = false;
  @Input() role: string | undefined;
  actions: any;
  columns: any;

  specializations: SpecializationModel[] | undefined;
  openModal: boolean = false;
  openedSpecialization: SpecializationModel | undefined;
  private filter: {} = {};

  constructor(private specializationService: SpecializationService) {
    this.getSpecializations();
  }

  ngOnInit(): void {
    //set specialization columns, render active component if not student
    this.columns = {
      specialization: {
        title: 'Degree',
      },
      ...(this.role !== 'student' && {
        active: {
          title: 'Active',
          editable: true,
          width: '100px',
          type: 'custom',
          renderComponent: ActiveRenderComponent,
          editor: {
            type: 'checkbox',
            config: {
              true: true,
              false: false,
            },
          },
        },
      }),
    };
    this.actions = {
      edit: this.role !== 'student',
      delete: false,
      add: false,
      custom: [
        {
          name: 'open',
          title: '<span class="material-icons table-icons">open_in_new</span>',
        },
      ],
    };
    this.specializationService.allSpecializations$.subscribe(
      (specializations) => {
        this.specializations = specializations;
      }
    );
  }

  getSpecializations() {
      this.specializationService
      .getAllSpecializations({
        filter: this.filter,
        order: '',
        page: 1,
        perPage: 100,
      })
      .subscribe();
    }

  closeModal(event: any) {
    this.openModal = !event;
    this.openedSpecialization = undefined;
  }

  openSpecializationInfo(event: any) {
    if (this.viewSpecs) {
      this.specializationService.removeSpecialization();
      this.specializationService.removeAllSpecializationCourses();
      this.specializationService.setCurrentSpecialization(event.data);
    } else {
      this.openedSpecialization = undefined;
      this.openModal = true;
      this.openedSpecialization = event.data;
    }
  }

  patchEditedSpec(event: any) {
    this.specializationService
      .editSpecialization(event.newData)
      .subscribe(() => {
        this.getSpecializations();
      });
  }
}
