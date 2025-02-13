import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SequencePresetModelPopUpComponent } from './sequence-popup.component';
import { ApiService } from 'src/app/common/api.service';
import { SitecoreImageService, SitecoreImages } from 'src/app/display-manager/display-manager-left-panel/services/sitecore-image/sitecore-image.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { IndividualConfigurationService } from '../../../individual-layout/services/individual-configuration.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { PresetAssetData } from '../../../individual-layout/models/sequence-preset';
import { ProfileConstants } from '../../../profiles/constants/profile-constants';
import { Constants } from '../../../constants/constants';
import { DialogueComponent } from 'src/app/common/dialogue/dialogue.component';
import { SequencePresetService } from '../../services/sequence-preset.service';

describe('SequencePresetModelPopUpComponent', () => {
  let component: SequencePresetModelPopUpComponent;
  let fixture: ComponentFixture<SequencePresetModelPopUpComponent>;
  let sitecoreImageService: SitecoreImageService;
  let individualConfigurationServiceMock: jasmine.SpyObj<IndividualConfigurationService>;
  let sitecoreImageServiceMock: jasmine.SpyObj<SitecoreImageService>;
  let fb: UntypedFormBuilder;
  let sequencePresetService: jasmine.SpyObj<SequencePresetService>;


  const mockDialogData = {
    presetNames: ['All Horseracing', 'All UK and IRE Horseracing'],
    stage: 'edit',
    value: { presetName: 'Existing Preset' },
    disableType: true,  // To test disabling of presetName control
  };

  beforeEach(() => {
    individualConfigurationServiceMock = jasmine.createSpyObj('IndividualConfigurationService', ['sequencePresetData$', 'initialPresetData$']);
    sitecoreImageServiceMock = jasmine.createSpyObj('SitecoreImageService', ['mediaAssets$']);

    sitecoreImageServiceMock.mediaAssets$ = new BehaviorSubject<SitecoreImages | null>({
      HamburgerIcon: 'path/to/hamburger/icon',
      resetIconPath: 'reset.png',
      copyIcon:  'copy.png',
    });
    const sequencePresetServiceSpy = jasmine.createSpyObj('SequencePresetService', [
      'getPresetList',
      'deleteSequencePreset',
      'getSequencePreset',
      'populateForm',
    ]);

    individualConfigurationServiceMock.sequencePresetData$ = new BehaviorSubject<PresetAssetData>({} as PresetAssetData);
    individualConfigurationServiceMock.initialPresetData$ = new BehaviorSubject<PresetAssetData>({} as PresetAssetData);

    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        SitecoreImageService,
        ApiService,
        UntypedFormBuilder,
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData  },
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: SequencePresetService, useValue: sequencePresetServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SequencePresetModelPopUpComponent);
    component = fixture.componentInstance;
    sitecoreImageService = TestBed.inject(SitecoreImageService);
    sequencePresetService = TestBed.inject(SequencePresetService) as jasmine.SpyObj<SequencePresetService>;
    (window as any).DefaultToggleNodes = {
      GreyHounds: 'Greyhounds',
    };

    fixture.detectChanges();
  });

  it('should prepare New Preset List success', () => {
    const data =[{"eventName":"02:20 Kasamatsu","categoryCode":"HORSE_RACING","racingEvent":{"id":6484277,"typeName":"Kasamatsu","name":"WinorEachWay","markets":[{"id":185695574,"name":"Win or Each Way","startTime":"2025-01-24T02:20:00.000+0000","eventName":null,"participants":[{"id":"608824946","name":"Matchan Fight","categoryCode":"HORSE_RACING","className":"Horse Racing - Live","startTime":"2025-01-24T02:20:00.000+0000"},{"id":"608824963","name":"Tale Spinner","categoryCode":"HORSE_RACING","className":"Horse Racing - Live","startTime":"2025-01-24T02:20:00.000+0000"},{"id":"608824996","name":"Win Dorato","categoryCode":"HORSE_RACING","className":"Horse Racing - Live","startTime":"2025-01-24T02:20:00.000+0000"},{"id":"608824929","name":"Chuwa Spell","categoryCode":"HORSE_RACING","className":"Horse Racing - Live","startTime":"2025-01-24T02:20:00.000+0000"},{"id":"608824971","name":"Unnamed 2nd Favourite","categoryCode":"HORSE_RACING","className":"Horse Racing - Live","startTime":"2025-01-24T02:20:00.000+0000"},{"id":"608824953","name":"Sugino Volcano","categoryCode":"HORSE_RACING","className":"Horse Racing - Live","startTime":"2025-01-24T02:20:00.000+0000"},{"id":"608824940","name":"Hayabusa Sontakun","categoryCode":"HORSE_RACING","className":"Horse Racing - Live","startTime":"2025-01-24T02:20:00.000+0000"},{"id":"608824988","name":"Variabile","categoryCode":"HORSE_RACING","className":"Horse Racing - Live","startTime":"2025-01-24T02:20:00.000+0000"},{"id":"608824980","name":"Unnamed Favourite","categoryCode":"HORSE_RACING","className":"Horse Racing - Live","startTime":"2025-01-24T02:20:00.000+0000"},{"id":"608824935","name":"Enrai","categoryCode":"HORSE_RACING","className":"Horse Racing - Live","startTime":"2025-01-24T02:20:00.000+0000"}],"runnersCount":8}],"marketsWhichAreDropped":"Win or Each Way","typeId":0,"className":"Horse Racing - Live","categoryCode":"HORSE_RACING","isStandardTemplatesLoaded":true,"isExpandable":false,"virtual":false,"startTime":"1/24/2025 2:20:00 AM","eventName":"Kasamatsu - BM","tabName":"Racing","targetLink":"{DED7D36F-2FE0-4D24-A139-BA8995D5ED18}","isMeetingPages":false,"meetingPageRelativePath":null,"version":null,"sportType":null,"sportId":null,"regionId":null,"competitionId":null,"fixtureId":null,"isBothVersionsForOutright":false,"contentMediaType":"{12AA31FC-B96F-4B80-8CDE-2CB02DAE367F}","tradingPartitionId":null,"assetType":"Scrolling","assetsPath":"{E3E73C5D-D82E-46C2-8AAD-0457EF22C00A}","isAutoExpand":false,"splitScreen":{"splitScreenStartRange":null,"splitScreenEndRange":null,"splitScreenPageNo":null,"splitScreenTotalPages":null,"displayAssetNameOnScreenWhenDragged":"","maxRunnerCount":null},"contentProvider":"{97FCB55C-A91C-47F5-BABC-C05C77DC08C7}","isResulted":null,"isSettled":null},"label":"","marketSelectedOption":"Win or Each Way","templateHalfType":"Scrolling","templateQuadType":"Scrolling","filteredMarketTypes":["Win or Each Way"],"displayOrder":1,"presetName":"","isResulted":false}];
    const name = 'sample';
    const result =component.prepareNewPresetList(data,name);
    expect(result.assets.length).toBe(1);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return null if the preset name does not exist in the list', () => {
    const control = { value: 'My Custom Preset' } as AbstractControl;
    const result = component.presetNameExistsValidator(mockDialogData.presetNames)(control);
    expect(result).toBeNull();
  });
  
  it('should return error if the preset name exists in the list', () => {
    const control = { value: 'All Horseracing' } as AbstractControl;
    const result = component.presetNameExistsValidator(mockDialogData.presetNames)(control);
    expect(result).toEqual({ presetNameExists: true });
  });

  it('should return null if control value is empty', () => {
    const control = { value: '' } as AbstractControl;
    const result = component.presetNameExistsValidator(mockDialogData.presetNames)(control);
    expect(result).toEqual({ required: true });
  });
  
  it('should reset the sequence when `resetSequence` is called', () => {
    spyOn(component, 'populatePresetForm');
    component.resetSequence();
    expect(component.newPresetForm.pristine).toBeTrue();
  });

  it('should return null if control is not touched or dirty', () => {
    expect(component.getPresetNameError()).toBeNull();
  });

  it('should reset form and disable create preset', () => {
    component.resetSequence();
    expect(component.isCreatePresetEnabled).toBeFalse();
    expect(component.newPresetForm.pristine).toBeTrue();
  });

  it('should return preset name exists error', () => {
    const control = component.newPresetForm.get('presetName');
    control?.setValue('ExistingName'); 
    control?.markAsTouched(); 
    control?.setErrors({ presetNameExists: true }); 
    expect(component.getPresetNameError()).toBe(Constants.preset_name_exists);
  });

  it('should return required error message if presetName is required', () => {
    const control = component.newPresetForm.get('presetName');
    control?.markAsTouched();
    component.newPresetForm.get('presetName')?.setErrors({ required: true});
    expect(component.getPresetNameError()).toBe(Constants.preset_name_required);
  });

  it('should return pattern error message if pattern error is present', () => {
    component.newPresetForm.get('presetName')?.markAsTouched();
    component.newPresetForm.get('presetName')?.setErrors({ pattern: true });
    expect(component.getPresetNameError()).toBe(Constants.fine_name_error);
  });

  it('should set isCreatePresetEnabled to false in ngAfterViewInit', () => {
    component.ngAfterViewInit();
    expect(component.isCreatePresetEnabled).toBeFalse();
  });

  it('should populate the preset form when preset data is available', () => {
    spyOn(component, 'populatePresetForm');
    component.initializeData(); // Or call any method that populates the form
    expect(component.populatePresetForm).toHaveBeenCalled();
  });

  it('should populate the form with preset data', () => {
    const presetData = mockDialogData.value;

    component.populatePresetForm(presetData);

    // Check if the presetName field is patched correctly
    expect(component.newPresetForm.get('presetName')?.value).toBe('');

    // Check if the presetName field is disabled (because disableType is set to true)
    expect(component.newPresetForm.get('presetName')?.disabled).toBeTrue();
  });

  it('should not disable presetName if disableType is not provided', () => {
    const presetDataWithoutDisableType = { presetName: 'New Preset' };
    component.populatePresetForm(presetDataWithoutDisableType);

    // Check if the presetName field is not disabled
    expect(component.newPresetForm.get('presetName')?.disabled).toBeTrue();
  });

});
