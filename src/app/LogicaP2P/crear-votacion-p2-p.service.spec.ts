import { TestBed } from '@angular/core/testing';

import { CrearVotacionP2PService } from './crear-votacion-p2-p.service';

describe('CrearVotacionP2PService', () => {
  let service: CrearVotacionP2PService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrearVotacionP2PService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
