import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodOfVictoryComponent } from './method-of-victory.component';

describe('MethodOfVictoryComponent', () => {
  let component: MethodOfVictoryComponent;
  let fixture: ComponentFixture<MethodOfVictoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MethodOfVictoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MethodOfVictoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
