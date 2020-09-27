import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingGridComponent } from './drawing-grid.component';

describe('DrawingGridComponent', () => {
  let component: DrawingGridComponent;
  let fixture: ComponentFixture<DrawingGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DrawingGridComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
