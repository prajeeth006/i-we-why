import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyLineComponent } from './money-line.component';

describe('MoneyLineComponent', () => {
  let component: MoneyLineComponent;
  let fixture: ComponentFixture<MoneyLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoneyLineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoneyLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
