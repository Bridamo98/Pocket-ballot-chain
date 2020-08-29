import { TestBed } from '@angular/core/testing';

import { ManejadorMensajesService } from './manejador-mensajes.service';

describe('ManejadorMensajesService', () => {
  let service: ManejadorMensajesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManejadorMensajesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
