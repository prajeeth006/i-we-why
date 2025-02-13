import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalgoalsinthematchComponent } from './totalgoalsinthematch.component';

describe('TotalgoalsinthematchComponent', () => {
  let component: TotalgoalsinthematchComponent;
  let fixture: ComponentFixture<TotalgoalsinthematchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TotalgoalsinthematchComponent]
    });
    fixture = TestBed.createComponent(TotalgoalsinthematchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
