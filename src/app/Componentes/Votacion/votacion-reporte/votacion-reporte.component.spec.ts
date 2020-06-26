import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotacionReporteComponent } from './votacion-reporte.component';

describe('VotacionReporteComponent', () => {
  let component: VotacionReporteComponent;
  let fixture: ComponentFixture<VotacionReporteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotacionReporteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotacionReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
