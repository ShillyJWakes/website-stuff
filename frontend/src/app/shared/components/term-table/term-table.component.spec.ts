import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermTableComponent } from './term-table.component';

describe('TermTableComponent', () => {
  let component: TermTableComponent;
  let fixture: ComponentFixture<TermTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TermTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
