import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCsvUploadComponent } from './user-csv-upload.component';

describe('UserCsvUploadComponent', () => {
  let component: UserCsvUploadComponent;
  let fixture: ComponentFixture<UserCsvUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCsvUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCsvUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
