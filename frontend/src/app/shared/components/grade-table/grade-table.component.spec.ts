import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeTableComponent } from './grade-table.component';

describe('GradeTableComponent', () => {
  let component: GradeTableComponent;
  let fixture: ComponentFixture<GradeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradeTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
