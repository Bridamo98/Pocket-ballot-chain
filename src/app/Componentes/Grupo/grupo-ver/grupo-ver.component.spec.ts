import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoVerComponent } from './grupo-ver.component';

describe('GrupoVerComponent', () => {
  let component: GrupoVerComponent;
  let fixture: ComponentFixture<GrupoVerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrupoVerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
