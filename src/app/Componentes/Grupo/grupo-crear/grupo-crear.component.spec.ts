import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoCrearComponent } from './grupo-crear.component';

describe('GrupoCrearComponent', () => {
  let component: GrupoCrearComponent;
  let fixture: ComponentFixture<GrupoCrearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrupoCrearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
