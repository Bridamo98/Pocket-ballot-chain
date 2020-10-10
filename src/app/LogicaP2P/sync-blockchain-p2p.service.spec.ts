import { TestBed } from '@angular/core/testing';

import { SyncBlockchainP2pService } from './sync-blockchain-p2p.service';

describe('SyncBlockchainP2pService', () => {
  let service: SyncBlockchainP2pService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyncBlockchainP2pService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
