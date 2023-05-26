import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialResetPasswordFormComponent } from './initial-reset-password-form.component';

describe('InitialResetPasswordFormComponent', () => {
  let component: InitialResetPasswordFormComponent;
  let fixture: ComponentFixture<InitialResetPasswordFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitialResetPasswordFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialResetPasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
