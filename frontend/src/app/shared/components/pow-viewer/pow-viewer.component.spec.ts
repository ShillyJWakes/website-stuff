import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowViewerComponent } from './pow-viewer.component';

describe('PowViewerComponent', () => {
  let component: PowViewerComponent;
  let fixture: ComponentFixture<PowViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PowViewerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PowViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
