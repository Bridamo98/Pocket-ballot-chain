import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotoPopularComponent } from './voto-popular.component';

describe('VotoPopularComponent', () => {
  let component: VotoPopularComponent;
  let fixture: ComponentFixture<VotoPopularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotoPopularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotoPopularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
