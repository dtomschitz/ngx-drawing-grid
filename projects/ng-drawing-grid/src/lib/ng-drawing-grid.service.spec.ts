import { TestBed } from '@angular/core/testing';

import { NgDrawingGridService } from './ng-drawing-grid.service';

describe('NgDrawingGridService', () => {
  let service: NgDrawingGridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgDrawingGridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
