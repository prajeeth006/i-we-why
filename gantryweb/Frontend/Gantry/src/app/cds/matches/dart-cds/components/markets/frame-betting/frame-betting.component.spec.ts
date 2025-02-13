import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameBettingComponent } from './frame-betting.component';

describe('FrameBettingComponent', () => {
  let component: FrameBettingComponent;
  let fixture: ComponentFixture<FrameBettingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FrameBettingComponent]
    });
    fixture = TestBed.createComponent(FrameBettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
