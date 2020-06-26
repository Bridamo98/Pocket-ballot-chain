import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoEditarComponent } from './grupo-editar.component';

describe('GrupoEditarComponent', () => {
  let component: GrupoEditarComponent;
  let fixture: ComponentFixture<GrupoEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrupoEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
