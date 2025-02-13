import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvrBannerComponent } from './avr-banner.component';

describe('AvrBannerComponent', () => {
  let component: AvrBannerComponent;
  let fixture: ComponentFixture<AvrBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvrBannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvrBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
