import { TestBed } from '@angular/core/testing';

import { CalcularResultadosP2pService } from './calcular-resultados-p2p.service';

describe('CalcularResultadosP2pService', () => {
  let service: CalcularResultadosP2pService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalcularResultadosP2pService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
