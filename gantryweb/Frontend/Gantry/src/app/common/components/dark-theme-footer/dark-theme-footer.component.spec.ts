import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeFooterComponent } from './dark-theme-footer.component';

describe('DarkThemeFooterComponent', () => {
  let component: DarkThemeFooterComponent;
  let fixture: ComponentFixture<DarkThemeFooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DarkThemeFooterComponent]
    });
    fixture = TestBed.createComponent(DarkThemeFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
