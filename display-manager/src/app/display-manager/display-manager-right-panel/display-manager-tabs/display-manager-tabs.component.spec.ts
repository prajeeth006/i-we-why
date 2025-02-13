import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayManagerTabsComponent } from './display-manager-tabs.component';
import { of } from 'rxjs';
import { LabelSelectorService } from '../../display-manager-header/label-selector/label-selector.service';
import { MasterToggleStateService } from '../../display-manager-header/master-toggle/master-toggle-state.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AssetDesignService } from '../services/AssetDesignService/asset-design.service';
import { MasterConfigurationService } from '../master-layout/services/master-configuration.service';
import { MatTabsModule } from '@angular/material/tabs';

class MockLabelSelectorService {
  sequencingEnabled$ = of(true);
  switchingTabs$ = of(['tab1', 'tab2']);
  tabDotColors$ = of({ green: 'green', red: 'red' });
  currentLabel$ = of('label1'); // Mock currentLabel$
}

class MockMasterToggleStateService {
  sequencingToggle$ = of(true);
}

class MockAssetDesignService {
  // Mock necessary methods from AssetDesignService
}

class MockMasterConfigurationService {
  masterLayoutTabs$ = of([]); // Mock the required observable
}

describe('DisplayManagerTabsComponent', () => {
  let component: DisplayManagerTabsComponent;
  let fixture: ComponentFixture<DisplayManagerTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayManagerTabsComponent ],
      providers: [
        { provide: LabelSelectorService, useClass: MockLabelSelectorService },
        { provide: MasterToggleStateService, useClass: MockMasterToggleStateService },
        { provide: AssetDesignService, useClass: MockAssetDesignService },
        { provide: MasterConfigurationService, useClass: MockMasterConfigurationService }
      ],
      imports: [ HttpClientTestingModule, MatTabsModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayManagerTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isSequencingEnabled to true', () => {
    expect(component.isSequencingEnabled).toBe(true);
  });

  it('should set tabNames to lowercase tab names', () => {
    expect(component.tabNames).toEqual(['tab1', 'tab2']);
  });

  it('should set colours to the provided color object', () => {
    expect(component.tabDotColours).toEqual({ green: 'green', red: 'red' });
  });

  it('should disable tabs when sequenceJourneyStatus is true', () => {    
    spyOnProperty(component, 'sequenceJourneyStatus', 'get').and.returnValue(true);  
    const areTabsDisabled = component.tabNames.map(() => component.sequenceJourneyStatus); 
    expect(areTabsDisabled.every((status) => status === true)).toBeTrue(); 
  });
  
  it('should enable tabs when sequenceJourneyStatus is false', () => {    
    spyOnProperty(component, 'sequenceJourneyStatus', 'get').and.returnValue(false);  
    const areTabsDisabled = component.tabNames.map(() => component.sequenceJourneyStatus);
    expect(areTabsDisabled.every((status) => status === false)).toBeTrue();
  });
  
});
