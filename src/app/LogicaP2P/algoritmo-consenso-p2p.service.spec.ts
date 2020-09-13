import { TestBed } from '@angular/core/testing';

import { AlgoritmoConsensoP2pService } from './algoritmo-consenso-p2p.service';

describe('AlgoritmoConsensoP2pService', () => {
  let service: AlgoritmoConsensoP2pService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlgoritmoConsensoP2pService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
