import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotacionCrearComponent } from './votacion-crear.component';

describe('VotacionCrearComponent', () => {
  let component: VotacionCrearComponent;
  let fixture: ComponentFixture<VotacionCrearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotacionCrearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotacionCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
