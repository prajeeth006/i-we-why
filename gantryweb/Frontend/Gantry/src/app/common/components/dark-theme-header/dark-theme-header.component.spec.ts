import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeHeaderComponent } from './dark-theme-header.component';

describe('DarkThemeHeaderComponent', () => {
  let component: DarkThemeHeaderComponent;
  let fixture: ComponentFixture<DarkThemeHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DarkThemeHeaderComponent]
    });
    fixture = TestBed.createComponent(DarkThemeHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
