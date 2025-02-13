import { TestBed } from '@angular/core/testing';
import { LabelSelectorService, ConfigItem } from './label-selector.service';
import { ApiService } from 'src/app/common/api.service';
import { BehaviorSubject, of } from 'rxjs';
import { TreeBreadCrumbService } from 'src/app/display-manager/display-manager-left-panel/tree-view/services/tree-bread-crumb-services/tree-bread-crumb.service';
import { CommonService } from 'src/app/display-manager/display-manager-left-panel/tree-view/services/common-service/common.service';
import { RealTimeUpdatesHelperService } from 'src/app/common/services/real-time-updates/real-time-updates-helper.service';
import { RealTimeUpdatesLoggerService } from 'src/app/common/services/real-time-updates/real-time-updates-logger.service';
import { UserActions } from 'src/app/common/services/real-time-updates/models/real-time-logger.model';

describe('LabelSelectorService', () => {
  let labelSelectorService: LabelSelectorService;
  let apiServiceMock: jasmine.SpyObj<ApiService>;
  let realTimeUpdatesHelperServiceMock: jasmine.SpyObj<RealTimeUpdatesHelperService>;
  let realTimeUpdatesLoggerServiceMock: jasmine.SpyObj<RealTimeUpdatesLoggerService>;
  let treeBreadCrumbServiceMock: jasmine.SpyObj<TreeBreadCrumbService>;
  let commonServiceMock: jasmine.SpyObj<CommonService>;

  // Mock ConfigItem object
  const mockConfigItem: ConfigItem = {
    basepath: 'https://example.com',
    labels: 'label1|label2',
    Coral: 'coral_url',
    Ladbrokes: 'ladbrokes_url',
    leftPanelPath: '/left-panel-path/',
    IsMasterEnabled: true,
    IsPreviewPostMetod: false,
    enableHttpInterceptor: true,
    isPreviewAssetRefactored: false,
    IsNewRuleProcessFlow: true,
    sequencingEnabled: true,
    SwitchingTabs: 'tab1|tab2',
    TabDotColors: '{"tab1": "red", "tab2": "blue"}',
    masterToIndividual_allAssigned: '',
    masterToIndividual_notAllAssigned: '',
    individualToMaster_allAssigned: '',
    individualToMaster_notAllAssigned: '',
    CoralCarouselPath: false,
    LadbrokesCarouselPath: false,
    individual_screen_disruptedMsg: '',
    layout_confirmation_msg: '',
    layout_confirmation_sub_msg: '',
  };


  beforeEach(() => {
    // Create mock services
    apiServiceMock = jasmine.createSpyObj('ApiService', ['get']);
    realTimeUpdatesHelperServiceMock = jasmine.createSpyObj('RealTimeUpdatesHelperService', ['resetMasterLayoutTouchedStatus']);
    realTimeUpdatesLoggerServiceMock = jasmine.createSpyObj('RealTimeUpdatesLoggerService', ['saveLog']);
    treeBreadCrumbServiceMock = jasmine.createSpyObj('TreeBreadCrumbService', ['breadCrumbData']);
    commonServiceMock = jasmine.createSpyObj('CommonService', ['filterRacingEventVal']);

    TestBed.configureTestingModule({
      providers: [
        LabelSelectorService,
        { provide: ApiService, useValue: apiServiceMock },
        { provide: RealTimeUpdatesHelperService, useValue: realTimeUpdatesHelperServiceMock },
        { provide: RealTimeUpdatesLoggerService, useValue: realTimeUpdatesLoggerServiceMock },
        { provide: TreeBreadCrumbService, useValue: treeBreadCrumbServiceMock },
        { provide: CommonService, useValue: commonServiceMock }
      ]
    });

    labelSelectorService = TestBed.inject(LabelSelectorService);
  });

  it('should be created', () => {
    expect(labelSelectorService).toBeTruthy();
  });

  it('should return the current label if set in session storage', () => {
    // Simulate a label in session storage
    sessionStorage.setItem('selectedLabel', 'label2');

    const currentLabel = labelSelectorService.getCurrentLabel();
    expect(currentLabel).toBe('label2');
  });

  it('should return the default label if not set in session storage', () => {
    // Simulate session storage being empty
    sessionStorage.removeItem('selectedLabel');

    // Mock the labels$ BehaviorSubject
    labelSelectorService.labels$.next(['label1', 'label2']);

    const currentLabel = labelSelectorService.getCurrentLabel();
    expect(currentLabel).toBe('label1');
  });

  it('should return the correct label URLs', () => {
    // Ensure the mockConfigItem data is used
    labelSelectorService.configItemValues = mockConfigItem;

    // Test for Coral label
    const coralUrl = labelSelectorService.getLabelUrls('coral');
    expect(coralUrl).toBe('coral_url');

    // Test for Ladbrokes label
    const ladbrokesUrl = labelSelectorService.getLabelUrls('ladbrokes');
    expect(ladbrokesUrl).toBe('ladbrokes_url');
  });

  it('should update the current label correctly', () => {
    const breadCrumbDataSubject = new BehaviorSubject<any>({});
    treeBreadCrumbServiceMock.breadCrumbData = breadCrumbDataSubject;  // Mocking breadCrumbData as a BehaviorSubject

    spyOn(sessionStorage, 'setItem');
    labelSelectorService.configItemValues = mockConfigItem;
    const currentLabel = 'label2';

    labelSelectorService.updateCurrentLabel(currentLabel);

    expect(sessionStorage.setItem).toHaveBeenCalledWith('selectedLabel', currentLabel);
    expect(labelSelectorService.currentLabelLeftPanelPath).toBe(mockConfigItem.leftPanelPath + currentLabel);
    expect(labelSelectorService.labelCssClass).toBe(currentLabel + '-background-colour');
    expect(commonServiceMock.filterRacingEventVal).toBe('Next 15');
    expect(realTimeUpdatesLoggerServiceMock.saveLog).toHaveBeenCalledWith({
      userAction: UserActions.ChangeLabel,
      currentLabel: currentLabel
    });
  });

  it('should return the correct label URLs based on config item booleans', () => {
    // Case 1: CoralCarouselPath is true
    mockConfigItem.CoralCarouselPath = true;
    mockConfigItem.LadbrokesCarouselPath = false; // Ensure Ladbrokes is false
    labelSelectorService.configItemValues = mockConfigItem; // Set the config in the service
    expect(labelSelectorService.getLabelCoralUrls('coral')).toBe(true);  // Expect true since CoralCarouselPath is true

    // Case 2: LadbrokesCarouselPath is true
    mockConfigItem.CoralCarouselPath = false;  // Coral is false
    mockConfigItem.LadbrokesCarouselPath = true;
    labelSelectorService.configItemValues = mockConfigItem; // Set the config in the service
    expect(labelSelectorService.getLabelCoralUrls('ladbrokes')).toBe(true);  // Expect true since LadbrokesCarouselPath is true

    // Case 3: Neither path is true, expect false
    mockConfigItem.CoralCarouselPath = false;
    mockConfigItem.LadbrokesCarouselPath = false;
    labelSelectorService.configItemValues = mockConfigItem; // Set the config in the service
    expect(labelSelectorService.getLabelCoralUrls('default')).toBe(false);  // Expect false as neither path is true
  });
  describe('updateSequencingEnabled', () => {
    it('should update sequencingEnabledSubject with the given value', () => {
      const testValue = true; // Value to be passed

      // Spy on the BehaviorSubject's next method
      spyOn(labelSelectorService['sequencingEnabledSubject'], 'next');

      // Call the method
      labelSelectorService.updatesequencingEnabled(testValue);

      // Expect that next was called with the correct value
      expect(labelSelectorService['sequencingEnabledSubject'].next).toHaveBeenCalledWith(testValue);
    });
  });

});
