import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivePOWsComponent } from './active-pows.component';

describe('ActivePOWsComponent', () => {
  let component: ActivePOWsComponent;
  let fixture: ComponentFixture<ActivePOWsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivePOWsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivePOWsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
