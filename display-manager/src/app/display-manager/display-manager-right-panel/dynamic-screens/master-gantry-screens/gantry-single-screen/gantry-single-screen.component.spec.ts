import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GantrySingleScreenComponent } from './gantry-single-screen.component';
import { AssetnamePipe } from '../../../filters/assetname/assetname.pipe';

describe('GantrySingleScreenComponent', () => {
  let component: GantrySingleScreenComponent;
  let fixture: ComponentFixture<GantrySingleScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GantrySingleScreenComponent, AssetnamePipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GantrySingleScreenComponent);
    component = fixture.componentInstance;

    // Mock data
    component.data = {
      Name: 'Test Screen',
      NowPlaying: { Asset: { event: { eventName: 'Test Event', categoryCode: 'Horses' } } },
      ScreenDesign: { ScreenBackgroundColor: '#ffffff', TextColor: '#000000' },
      ScreenCoordinate: { Size: 'L', Name: 'Screen1' },
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
