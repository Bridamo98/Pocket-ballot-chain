import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotoRankingComponent } from './voto-ranking.component';

describe('VotoRankingComponent', () => {
  let component: VotoRankingComponent;
  let fixture: ComponentFixture<VotoRankingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotoRankingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotoRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
