import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgDrawingGridComponent } from './ng-drawing-grid.component';

describe('NgDrawingGridComponent', () => {
  let component: NgDrawingGridComponent;
  let fixture: ComponentFixture<NgDrawingGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgDrawingGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgDrawingGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
