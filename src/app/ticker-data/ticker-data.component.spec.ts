import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TickerDataComponent } from './ticker-data.component';

describe('TickerDataComponent', () => {
  let component: TickerDataComponent;
  let fixture: ComponentFixture<TickerDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TickerDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TickerDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
