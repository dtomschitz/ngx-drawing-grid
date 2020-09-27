import { TestBed } from '@angular/core/testing';
import { DrawingGridService } from './drawing-grid.service';

describe('DrawingGridService', () => {
  let service: DrawingGridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawingGridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
