import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScreenLayoutChangeWidgetComponent } from './screen-layout-change-widget.component';

describe('ScreenLayoutChangeWidgetComponent', () => {
  let component: ScreenLayoutChangeWidgetComponent;
  let fixture: ComponentFixture<ScreenLayoutChangeWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenLayoutChangeWidgetComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScreenLayoutChangeWidgetComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
