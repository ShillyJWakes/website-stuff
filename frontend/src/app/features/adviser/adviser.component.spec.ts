import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdviserComponent } from './adviser.component';

describe('AdviserComponent', () => {
  let component: AdviserComponent;
  let fixture: ComponentFixture<AdviserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdviserComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdviserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
