import { TestBed } from '@angular/core/testing';

import { OpcionService } from './opcion.service';

describe('OpcionService', () => {
  let service: OpcionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpcionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
