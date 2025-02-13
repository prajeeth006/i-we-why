import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GantryScreensComponent } from './gantry-screens.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GantryScreensComponent', () => {
  let component: GantryScreensComponent;
  let fixture: ComponentFixture<GantryScreensComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GantryScreensComponent, HttpClientTestingModule]
    });
    fixture = TestBed.createComponent(GantryScreensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
