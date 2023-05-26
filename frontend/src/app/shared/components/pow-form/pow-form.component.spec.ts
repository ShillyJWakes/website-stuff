import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowFormComponent } from './pow-form.component';

describe('PowFormComponent', () => {
  let component: PowFormComponent;
  let fixture: ComponentFixture<PowFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PowFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PowFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
