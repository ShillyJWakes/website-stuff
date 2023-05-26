import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeleteConfirmationComponent } from './edit-delete-confirmation.component';

describe('EditDeleteConfirmationComponent', () => {
  let component: EditDeleteConfirmationComponent;
  let fixture: ComponentFixture<EditDeleteConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditDeleteConfirmationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDeleteConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
