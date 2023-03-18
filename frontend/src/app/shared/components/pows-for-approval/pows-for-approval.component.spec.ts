import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowsForApprovalComponent } from './pows-for-approval.component';

describe('PowsForApprovalComponent', () => {
  let component: PowsForApprovalComponent;
  let fixture: ComponentFixture<PowsForApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PowsForApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PowsForApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
