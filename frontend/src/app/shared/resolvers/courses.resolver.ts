import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { CourseModel } from '../models/course.model';
import { Observable } from 'rxjs';
import { CoursesService } from '../services/courses.service';

@Injectable({ providedIn: 'root' })
export class CoursesResolver implements Resolve<any> {
  constructor(private coursesService: CoursesService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return true;
  }
}
