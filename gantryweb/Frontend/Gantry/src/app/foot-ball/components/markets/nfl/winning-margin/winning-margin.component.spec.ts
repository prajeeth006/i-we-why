import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinningMarginComponent } from './winning-margin.component';

describe('WinningMarginComponent', () => {
  let component: WinningMarginComponent;
  let fixture: ComponentFixture<WinningMarginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WinningMarginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WinningMarginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
