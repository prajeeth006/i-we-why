import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalSixesComponent } from './total-sixes.component';

describe('TotalSixesComponent', () => {
  let component: TotalSixesComponent;
  let fixture: ComponentFixture<TotalSixesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalSixesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalSixesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
