import { TestBed } from '@angular/core/testing';

import { CifradoService } from './cifrado.service';

describe('CifradoService', () => {
  let service: CifradoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CifradoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
