import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotacionListaComponent } from './votacion-lista.component';

describe('VotacionListaComponent', () => {
  let component: VotacionListaComponent;
  let fixture: ComponentFixture<VotacionListaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotacionListaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotacionListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
