import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SingleScreenComponent } from './single-screen.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AssetnamePipe } from '../../../filters/assetname/assetname.pipe';

describe('SingleScreenComponent', () => {
  let component: SingleScreenComponent;
  let fixture: ComponentFixture<SingleScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingleScreenComponent, AssetnamePipe],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleScreenComponent);
    component = fixture.componentInstance;

    // Mock data setup
    component.data = {
      IsDisabled: false,
      ScreenDesign: {
        AssetColor: '#FFFFFF',
        ScreenBorderColor: '#000000',
        Image: 'https://example.com/sample-image.jpg',
      },
      NowPlaying: {
        Asset: { event: { splitScreen: { displayAssetNameOnScreenWhenDragged: 'TestAsset' } } },
        Name: 'NowPlayingTest',
      },
      screenDisplayAssetType: 'TestType',
      Name: 'Test Screen',
      IsMinAssetScreen: true,
    } as any; // Cast to 'any' to accommodate flexible data structures.

    component.currentActiveScreen = { Name: 'Test Screen', ScreenNumber: 1 } as any;
    component.isActiveScreensReset = false;
    component.isSkyTv = false;
    component.currentScreen = "1";

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
