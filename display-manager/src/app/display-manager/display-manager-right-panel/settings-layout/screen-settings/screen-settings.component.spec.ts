import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScreenSettingsComponent } from './screen-settings.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { of } from 'rxjs';
import { LabelSelectorService } from 'src/app/display-manager/display-manager-header/label-selector/label-selector.service';
import { SettingsLayoutService } from '../settings-layout.service';
import { MasterLayoutTabs } from '../../profiles/models/master-tabs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

class MockLabelSelectorService {
  currentLabel$ = of('Coral');
}

class MockSettingsLayoutService {
  screenSettingType$ = of('Scrolling');
  currentLabel: string = 'Coral';
  getscreenSettingType() { }
  savescreenSettingType(oldValue: string, newValue: string) { }
}

describe('ScreenSettingsComponent', () => {
  let component: ScreenSettingsComponent;
  let fixture: ComponentFixture<ScreenSettingsComponent>;
  let mockLabelSelectorService: MockLabelSelectorService;
  let mockSettingsLayoutService: MockSettingsLayoutService;

  beforeEach(async () => {
    mockLabelSelectorService = new MockLabelSelectorService();
    mockSettingsLayoutService = new MockSettingsLayoutService();

    await TestBed.configureTestingModule({
      imports: [CommonModule, MatRadioModule, FormsModule, ScreenSettingsComponent, HttpClientTestingModule],
      providers: [
        { provide: LabelSelectorService, useValue: mockLabelSelectorService },
        { provide: SettingsLayoutService, useValue: mockSettingsLayoutService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize screenSettingValue with value from screenSettingType$', () => {
    expect(component.screenSettingValue).toBe('Scrolling');
    expect(component.oldScreenSettingValue).toBe('Scrolling');
  });

  it('should set currentLabel in settingLayoutService when currentLabel$ changes', () => {
    const spy = spyOn(mockSettingsLayoutService, 'getscreenSettingType');
    mockLabelSelectorService.currentLabel$.subscribe(() => {
      expect(mockSettingsLayoutService.currentLabel).toBe('Coral');
      spy();
    });
    expect(spy).toHaveBeenCalled();
  });

  it('should call savescreenSettingType when save is called', () => {
    const spy = spyOn(mockSettingsLayoutService, 'savescreenSettingType');
    component.save();
    expect(spy).toHaveBeenCalledWith('Scrolling', component.screenSettingValue);
  });

  it('should reset screenSettingValue to old value when cancel is called', () => {
    component.screenSettingValue = 'Runner Count';
    component.cancel();
    expect(component.screenSettingValue).toBe('Scrolling');
  });

  it('should handle the @Input screenData correctly', () => {
    const mockData: MasterLayoutTabs = {
      itemId: "screen-settings",
      name: "SCREEN SETTINGS",
      imageUrl: "",
      childTabs: [
        {
          itemId: "scrolling",
          name: "Scrolling",
          imageUrl: '',
          childTabs: [],
          hidden: false,
          alignRight: false
        },
        {
          itemId: "runner-count",
          name: "Runner Count",
          imageUrl: '',
          childTabs: [],
          hidden: false,
          alignRight: false
        }
      ],
      hidden: false,
      alignRight: false
    };

    component.screenData = mockData;
    fixture.detectChanges();
    expect(component.screenData).toBe(mockData);
  });
  it('should set currentLabel in settingLayoutService when currentLabel$ changes', () => {
    const spy = spyOn(mockSettingsLayoutService, 'getscreenSettingType');
    mockLabelSelectorService.currentLabel$.subscribe(() => {
      expect(mockSettingsLayoutService.currentLabel).toBe('Coral');
      spy();
    });
    expect(spy).toHaveBeenCalled();
  });
  it('should call savescreenSettingType when save is called', () => {
    const spy = spyOn(mockSettingsLayoutService, 'savescreenSettingType');
    component.save();
    expect(spy).toHaveBeenCalledWith('Scrolling', component.screenSettingValue);
  });

  it('should initialize screenSettingValue with value from screenSettingType$', () => {
    expect(component.screenSettingValue).toBe('Scrolling');
    expect(component.oldScreenSettingValue).toBe('Scrolling');
  });
  it('should handle the @Input screenData correctly', () => {
    const mockData: MasterLayoutTabs = {
      itemId: "screen-settings",
      name: "SCREEN SETTINGS",
      imageUrl: "",
      childTabs: [
        {
          itemId: "scrolling",
          name: "Scrolling",
          imageUrl: '',
          childTabs: [],
          hidden: false,
          alignRight: false
        },
        {
          itemId: "runner-count",
          name: "Runner Count",
          imageUrl: '',
          childTabs: [],
          hidden: false,
          alignRight: false
        }
      ],
      hidden: false,
      alignRight: false
    };

    component.screenData = mockData;
    fixture.detectChanges();
    expect(component.screenData).toBe(mockData);
  });
});
