import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleMarketComponent } from './simple-market.component';

describe('SimpleMarketComponent', () => {
  let component: SimpleMarketComponent;
  let fixture: ComponentFixture<SimpleMarketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleMarketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
