import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamineComponent } from './examine.component';

describe('ExamineComponent', () => {
  let component: ExamineComponent;
  let fixture: ComponentFixture<ExamineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExamineComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
