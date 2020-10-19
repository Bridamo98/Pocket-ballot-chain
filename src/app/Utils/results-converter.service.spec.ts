import { TestBed } from '@angular/core/testing';

import { ResultsConverterService } from './results-converter.service';

describe('ResultsConverterService', () => {
  let service: ResultsConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultsConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
