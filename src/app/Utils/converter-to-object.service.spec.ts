import { TestBed } from '@angular/core/testing';

import { ConverterToObjectService } from './converter-to-object.service';

describe('ConverterToObjectService', () => {
  let service: ConverterToObjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConverterToObjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
