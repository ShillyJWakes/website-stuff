import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermCourseTableComponent } from './term-course-table.component';

describe('TermCourseTableComponent', () => {
  let component: TermCourseTableComponent;
  let fixture: ComponentFixture<TermCourseTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermCourseTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermCourseTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
