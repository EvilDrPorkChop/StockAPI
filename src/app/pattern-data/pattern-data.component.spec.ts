import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatternDataComponent } from './pattern-data.component';

describe('PatternDataComponent', () => {
  let component: PatternDataComponent;
  let fixture: ComponentFixture<PatternDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatternDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatternDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
