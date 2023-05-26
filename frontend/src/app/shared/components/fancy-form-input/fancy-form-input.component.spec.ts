import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FancyFormInputComponent } from './fancy-form-input.component';

describe('FancyFormInputComponent', () => {
  let component: FancyFormInputComponent;
  let fixture: ComponentFixture<FancyFormInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FancyFormInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FancyFormInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
