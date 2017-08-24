import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplexMarketComponent } from './complex-market.component';

describe('ComplexMarketComponent', () => {
  let component: ComplexMarketComponent;
  let fixture: ComponentFixture<ComplexMarketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplexMarketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplexMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
