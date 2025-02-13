import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeripheralScreensComponent } from './peripheral-screens.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PeripheralScreensComponent', () => {
  let component: PeripheralScreensComponent;
  let fixture: ComponentFixture<PeripheralScreensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeripheralScreensComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeripheralScreensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
