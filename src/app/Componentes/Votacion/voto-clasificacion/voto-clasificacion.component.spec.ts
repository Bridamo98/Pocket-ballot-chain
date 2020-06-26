import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotoClasificacionComponent } from './voto-clasificacion.component';

describe('VotoClasificacionComponent', () => {
  let component: VotoClasificacionComponent;
  let fixture: ComponentFixture<VotoClasificacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotoClasificacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotoClasificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
