import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoleFormComponent } from './user-role-form.component';

describe('UserRoleFormComponent', () => {
  let component: UserRoleFormComponent;
  let fixture: ComponentFixture<UserRoleFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRoleFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRoleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
