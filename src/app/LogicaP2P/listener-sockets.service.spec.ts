import { TestBed } from '@angular/core/testing';

import { ListenerSocketsService } from './listener-sockets.service';

describe('ListenerSocketsService', () => {
  let service: ListenerSocketsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListenerSocketsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
