import { Component, Input, OnInit } from '@angular/core';
import { CourseModel } from '../../models/course.model';

@Component({
  selector: 'app-course-view',
  templateUrl: './course-view.component.html',
  styleUrls: ['./course-view.component.scss'],
})
export class CourseViewComponent implements OnInit {
  @Input() course: CourseModel | undefined;
  constructor() {}

  ngOnInit(): void {}
  getRequisitesValues(requisites: any, type: string) {
    if (requisites != null) {
      return requisites.filter((x: { reqType: string }) => x.reqType == type);
    } else {
      return [];
    }
  }
}
