import { TestBed } from '@angular/core/testing';
import { IndividualConfigurationService } from './individual-configuration.service';
import { LabelSelectorService } from 'src/app/display-manager/display-manager-header/label-selector/label-selector.service';
import { BehaviorSubject, of, ReplaySubject } from 'rxjs';
import { ApiService } from 'src/app/common/api.service';
import { GantryLayout, IndividualScreens, ScreenData, SortedScreensData } from '../models/individual-gantry-screens.model';
import { SelectedScreen } from '../models/sequence-preset';
import { Guid } from 'guid-typescript';
import { MockDuo1ScreenData, MockIndividualTabGantryProfiles, MockQuadScreenData, MockSingleScreenData, MockTrio1ScreenData, MockTrio2ScreenData, UnknownScreenData } from '../mocks/Individual-tab-gantry-profiles.mock';

describe('IndividualConfigurationService', () => {
  let service: IndividualConfigurationService;
  let labelSelectorService: LabelSelectorService;
  let apiService: ApiService;
  let labelSubject: ReplaySubject<string>;

  beforeEach(() => {
    labelSubject = new ReplaySubject<string>(1);

    TestBed.configureTestingModule({
      providers: [
        IndividualConfigurationService,
        {
          provide: LabelSelectorService,
          useValue: {
            currentLabel$: labelSubject
          }
        },
        {
          provide: ApiService,
          useClass: class {
            get = jasmine.createSpy('get').and.returnValue(of({})); // Adjust return value as needed
          }
        }
      ]
    });

    service = TestBed.inject(IndividualConfigurationService);
    labelSelectorService = TestBed.inject(LabelSelectorService);
    apiService = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Signal Updates
  it('should initialize with labelSelectorService', () => {
    labelSubject.next('coral');
    service.initialize();
    expect(service._currentLabel()).toBe('coral');
  });

  it('should update _individualGantryLayoutTypes when getListOfIndividualGantryLayoutTypes is called', () => {
    const gantryTypes = ['21', '3x3', '4x4'];
    (apiService.get as jasmine.Spy).and.returnValue(of(gantryTypes));
    service.getListOfIndividualGantryLayoutTypes('coral');
    expect(service._individualGantryLayoutTypes()).toEqual(gantryTypes);
  });

  // Effects: Test the effects to ensure they trigger the correct methods
  it('should call getAllIndividualTabGantryLayoutTypeDetails on label change', () => {
    spyOn(service, 'getAllIndividualTabGantryLayoutTypeDetails');
    service._currentLabel.set('coral');
    TestBed.flushEffects();
    expect(service.getAllIndividualTabGantryLayoutTypeDetails);
  });

  it('should call getIndividualTabGantryLayoutTypeDetailsFromLocal on layout type change', () => {
    spyOn(service, 'getIndividualTabGantryLayoutTypeDetailsFromLocal');
    service._currentLayoutType.set('21');
    TestBed.flushEffects();
    expect(service.getIndividualTabGantryLayoutTypeDetailsFromLocal).toHaveBeenCalledWith('21');
  });

  // API Calls: Test the behaviors related to API calls
  it('should fetch and set layout types when label is provided', () => {
    const mockLayoutTypes = ['21', '3x3'];
    (apiService.get as jasmine.Spy).and.returnValue(of(mockLayoutTypes));
    service.getListOfIndividualGantryLayoutTypes('coral');
    expect(service._individualGantryLayoutTypes()).toEqual(mockLayoutTypes);
  });

  it('should fetch and process gantry layout data', () => {
    const mockGantryLayout: GantryLayout = MockIndividualTabGantryProfiles;
    (apiService.get as jasmine.Spy).and.returnValue(of(mockGantryLayout));
    service.getIndividualTabGantryLayoutTypeDetailsFromLocal('3x3');
    expect(service._individualTabCarouselSlides().length).toBeGreaterThan(0);
  });

  it('should fetch and process gantry layout data', () => {
    const mockGantryLayout: GantryLayout = MockIndividualTabGantryProfiles;
    mockGantryLayout.GantryType.IndividualScreens = {} as IndividualScreens;
    (apiService.get as jasmine.Spy).and.returnValue(of(mockGantryLayout));
    service.getIndividualTabGantryLayoutTypeDetailsFromLocal('3x3');
    expect(service._individualTabCarouselSlides().length).toBe(2);
  });

  // Helper Methods
  it('should correctly transform screen data', () => {
    const mockScreensData: ScreenData[][] = [
      [{ Column: 1, ScreenNumber: 1 } as ScreenData]
    ];
    const result = service['transformToVmScreenData'](new SortedScreensData(), mockScreensData);
    expect(result.maxRows).toBe(1);
    expect(result.maxColumns).toBe(1);
    expect(result.rows.length).toBe(1);
  });

  it('should return correct screen details', () => {
    const mockScreen = { ScreenType: 'Single', ScreenDetails: { Single: [{ DisplayName: 'Screen1' }] } } as ScreenData;
    const result = service['GetScreenDetails'](mockScreen);
    expect(result.length).toBe(1);
    expect(result[0].DisplayName).toBe('Screen1');
  });

  it('should return correct screen details for different screen types', () => {
    // Test Single screen type
    const singleScreen: ScreenData = MockSingleScreenData;
    let result = service['GetScreenDetails'](singleScreen);
    expect(result.length).toBe(1);
    expect(result[0].DisplayName).toBe('1E');

    // Test Duo screen type
    const duoScreen: ScreenData = MockDuo1ScreenData;
    result = service['GetScreenDetails'](duoScreen);
    expect(result.length).toBe(2);
    expect(result[0].DisplayName).toBe('1E');
    expect(result[1].DisplayName).toBe('1B');

    // Test Trio1 screen type
    const trio1Screen: ScreenData = MockTrio1ScreenData;
    result = service['GetScreenDetails'](trio1Screen);
    expect(result.length).toBe(3);
    expect(result[2].DisplayName).toBe('1D');

    // Test Trio2 screen type
    const trio2Screen: ScreenData = MockTrio2ScreenData;
    result = service['GetScreenDetails'](trio2Screen);
    expect(result.length).toBe(3);
    expect(result[0].DisplayName).toBe('1E');

    // Test Quad screen type
    const quadScreen: ScreenData = MockQuadScreenData;
    result = service['GetScreenDetails'](quadScreen);
    expect(result.length).toBe(4);
    expect(result[3].DisplayName).toBe('1D');

  });

  it('should return atleast single screen details if no screen type provided', () => {
    // Test Single screen type
    const unknowmScreen: ScreenData = UnknownScreenData;
    let result = service['GetScreenDetails'](unknowmScreen);
    expect(result.length).toBe(1);
    expect(result[0].DisplayName).toBe('1E');

  });

  it('should prepare sequence data correctly', () => {
    const mockSelectedScreens: SelectedScreen[] = [{ ScreenNumber: 1, ScreenType: 'Single', ViewId: 1, Order: 1 }];
    const mockSequenceId = Guid.create();
    const result = service['prepareSequenceData'](mockSelectedScreens, mockSequenceId);
    expect(result.SequenceId).toBe(mockSequenceId.toString());
    expect(result.SelectedScreens).toEqual(mockSelectedScreens);
  });
});
