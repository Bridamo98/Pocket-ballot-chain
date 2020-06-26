import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotacionCrearInformacionComponent } from './votacion-crear-informacion.component';

describe('VotacionCrearInformacionComponent', () => {
  let component: VotacionCrearInformacionComponent;
  let fixture: ComponentFixture<VotacionCrearInformacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotacionCrearInformacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotacionCrearInformacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
