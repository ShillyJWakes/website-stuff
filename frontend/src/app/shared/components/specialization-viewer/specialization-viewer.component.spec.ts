import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecializationViewerComponent } from './specialization-viewer.component';

describe('SpecializationViewerComponent', () => {
  let component: SpecializationViewerComponent;
  let fixture: ComponentFixture<SpecializationViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecializationViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecializationViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
