import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HalfViewComponent } from './half-view.component';

describe('HalfViewComponent', () => {
  let component: HalfViewComponent;
  let fixture: ComponentFixture<HalfViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HalfViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HalfViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
