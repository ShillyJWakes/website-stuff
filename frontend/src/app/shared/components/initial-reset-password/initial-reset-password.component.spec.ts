import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialResetPasswordComponent } from './initial-reset-password.component';

describe('InitialResetPasswordComponent', () => {
  let component: InitialResetPasswordComponent;
  let fixture: ComponentFixture<InitialResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InitialResetPasswordComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
