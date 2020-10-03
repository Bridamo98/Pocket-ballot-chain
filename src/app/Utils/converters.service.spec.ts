import { TestBed } from '@angular/core/testing';

import { ConvertersService } from './converters.service';

describe('ConvertersService', () => {
  let service: ConvertersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConvertersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
