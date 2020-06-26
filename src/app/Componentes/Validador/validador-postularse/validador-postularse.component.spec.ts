import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidadorPostularseComponent } from './validador-postularse.component';

describe('ValidadorPostularseComponent', () => {
  let component: ValidadorPostularseComponent;
  let fixture: ComponentFixture<ValidadorPostularseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidadorPostularseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidadorPostularseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
