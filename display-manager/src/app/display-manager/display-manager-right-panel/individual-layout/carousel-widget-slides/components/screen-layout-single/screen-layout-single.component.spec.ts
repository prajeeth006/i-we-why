import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenLayoutSingleComponent } from './screen-layout-single.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ScreenLayoutSingleComponent', () => {
  let component: ScreenLayoutSingleComponent;
  let fixture: ComponentFixture<ScreenLayoutSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenLayoutSingleComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenLayoutSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
