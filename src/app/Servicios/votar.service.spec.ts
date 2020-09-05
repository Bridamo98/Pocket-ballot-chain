import { TestBed } from '@angular/core/testing';

import { VotarService } from './votar.service';

describe('VotarService', () => {
  let service: VotarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VotarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
