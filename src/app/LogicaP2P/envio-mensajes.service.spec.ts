import { TestBed } from '@angular/core/testing';

import { EnvioMensajesService } from './envio-mensajes.service';

describe('EnvioMensajesService', () => {
  let service: EnvioMensajesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnvioMensajesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
