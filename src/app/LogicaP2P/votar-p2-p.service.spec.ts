import { TestBed } from '@angular/core/testing';

import { VotarP2PService } from './votar-p2-p.service';

describe('VotarP2PService', () => {
  let service: VotarP2PService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VotarP2PService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
