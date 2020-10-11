import { TestBed } from '@angular/core/testing';

import { ObtenerResultadosService } from './obtener-resultados.service';

describe('ObtenerResultadosService', () => {
  let service: ObtenerResultadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObtenerResultadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
