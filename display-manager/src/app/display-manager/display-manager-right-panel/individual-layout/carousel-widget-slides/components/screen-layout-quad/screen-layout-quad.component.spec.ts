import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenLayoutQuadComponent } from './screen-layout-quad.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ScreenLayoutQuadComponent', () => {
  let component: ScreenLayoutQuadComponent;
  let fixture: ComponentFixture<ScreenLayoutQuadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenLayoutQuadComponent, HttpClientTestingModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenLayoutQuadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
