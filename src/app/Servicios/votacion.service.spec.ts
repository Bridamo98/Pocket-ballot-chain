import { TestBed } from '@angular/core/testing';

import { VotacionService } from './votacion.service';

describe('VotacionService', () => {
  let service: VotacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VotacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
