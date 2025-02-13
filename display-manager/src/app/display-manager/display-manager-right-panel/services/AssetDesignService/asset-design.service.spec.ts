import { TestBed } from '@angular/core/testing';
import { AssetDesignService } from './asset-design.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AssetTypes } from 'src/app/common/models/AssetTypes';
import { FilterRacingCategories } from 'src/app/display-manager/display-manager-left-panel/generic-tab-service/model/filter-racingcategories.enum';
import { AssetIcon } from '../../models/AssetIcon';
import { PrepareScreenRuleRequest } from 'src/app/helpers/prepare-screen-rule-request';
import { DroppedItem } from '../../display-manager-screens/models/display-screen.model';
import { ApiService } from 'src/app/common/api.service';
import { of } from 'rxjs';

describe('AssetDesignService', () => {
  let service: AssetDesignService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AssetDesignService],
    });
    service = TestBed.inject(AssetDesignService);
  });

  it('should return HorseMeetingResult when racingEvent category is Horses and isMeetingPages is true', () => {
    const screenRuleRequest = {
      racingEvent: {
        id: "1",
        typeId: 2,
        categoryCode: FilterRacingCategories.Horses,
        isMeetingPages: true,
      },
    } as any;

    const result = service.getAssetType(screenRuleRequest, null);
    expect(result).toBe(AssetTypes.HorseMeetingResult);
  });

  it('should return GreyhoundsMeetingResult when racingEvent category is Greyhounds and isMeetingPages is true', () => {
    const screenRuleRequest = {
      racingEvent: {
        id: "1",
        typeId: 2,
        categoryCode: FilterRacingCategories.GreyHounds,
        isMeetingPages: true,
      },
    } as any;

    const result = service.getAssetType(screenRuleRequest, null);
    expect(result).toBe(AssetTypes.GreyhoundsMeetingResult);
  });

  it('should return Racing when racingEvent category is Horses but isMeetingPages is false', () => {
    const screenRuleRequest = {
      racingEvent: {
        id: "1",
        typeId: 2,
        categoryCode: FilterRacingCategories.Horses,
        isMeetingPages: false,
      },
    } as any;

    const result = service.getAssetType(screenRuleRequest, null);
    expect(result).toBe(AssetTypes.Racing);
  });

  it('should return Sports when racingEvent does not match any specific category', () => {
    const screenRuleRequest = {
      racingEvent: {
        id: "1",
        typeId: 2,
        categoryCode: "Football", // Non-matching category
        isMeetingPages: false,
      },
    } as any;

    const result = service.getAssetType(screenRuleRequest, null);
    expect(result).toBe(AssetTypes.Sports);
  });

  it('should return HorseRacingMultiEvent when racingEvent category is Horses in a multi-event tree node', () => {
    const screenRuleRequest = {
      isMultiEventTreeNode: true,
    } as any;

    const droppedItem = {
      nodeProperties: {
        eventList: JSON.stringify({
          racingEvents: [
            {
              categoryCode: FilterRacingCategories.Horses,
            },
          ],
        }),
      },
    } as any;

    const result = service.getAssetType(screenRuleRequest, droppedItem);
    expect(result).toBe(AssetTypes.HorseRacingMultiEvent);
  });
  it('should return the correct AssetType based on the screenRuleRequest flags', () => {
    // Test case for isPromotionTreeNode
    let screenRuleRequest = { isPromotionTreeNode: true } as any;
    let result = service.getAssetType(screenRuleRequest, null);
    expect(result).toBe(AssetTypes.Promotion);

    // Test case for isCarouselTreeNode
    screenRuleRequest = { isCarouselTreeNode: true } as any;
    result = service.getAssetType(screenRuleRequest, null);
    expect(result).toBe(AssetTypes.Carousel);

    // Test case for isSkyChannelTreeNode
    screenRuleRequest = { isSkyChannelTreeNode: true } as any;
    result = service.getAssetType(screenRuleRequest, null);
    expect(result).toBe(AssetTypes.Sky);

    // Test case for isManualTreeNode
    screenRuleRequest = { isManualTreeNode: true } as any;
    result = service.getAssetType(screenRuleRequest, null);
    expect(result).toBe(AssetTypes.ManualCreateTemplate);

    // Test case for assetType property
    screenRuleRequest = { assetType: AssetTypes.HorseMeetingResult } as any;
    result = service.getAssetType(screenRuleRequest, null);
    expect(result).toBe(AssetTypes.HorseMeetingResult);

    // Test case for default null
    screenRuleRequest = {} as any;
    result = service.getAssetType(screenRuleRequest, null);
    expect(result).toBeNull();
  });
  it('should return the correct AssetIcon based on AssetType and droppedItem details', () => {
    // Arrange
    const screenRuleRequest = { assetType: AssetTypes.Racing } as any;
    const droppedItem = {
      event: {
        virtual: false,
        categoryCode: FilterRacingCategories.Horses,
      },
    } as any;

    // Mock asset icons available in the service
    const mockAssetIcons = [
      { Name: AssetTypes.Racing },
      { Name: AssetTypes.Virtuals },
      { Name: FilterRacingCategories.Horses },
    ].map(icon => ({
      ...icon,
      TypeName: '',
      ScreenBorderColor: '',
      ScreenBackgroundColor: '',
      AssetColor: '',
      AssetActiveIcon: '',
      AssetDisabledIcon: '',
      PlaceholderIcon: '',
      PlaceholderDisabledIcon: ''
    }));

    service['assetIcons'] = mockAssetIcons;

    // Act
    const result = service.getPriorityImage(screenRuleRequest, droppedItem);

    // Assert
    expect(result).toBeDefined();
    expect(result?.Name).toBe(FilterRacingCategories.Horses);
  });

  it('should return the correct AssetIcon for Racing', () => {
    // Mock data for AssetIcons
    const mockAssetIcons: AssetIcon[] = [
      {
        Name: AssetTypes.Racing,
        TypeName: 'RacingType',
        ScreenBorderColor: 'blue',
        ScreenBackgroundColor: 'lightblue',
        AssetColor: 'red',
        AssetActiveIcon: 'racing-active-icon',
        AssetDisabledIcon: 'racing-disabled-icon',
        PlaceholderIcon: 'racing-placeholder-icon',
        PlaceholderDisabledIcon: 'racing-placeholder-disabled-icon',
      },
      {
        Name: AssetTypes.Horses,
        TypeName: 'HorseType',
        ScreenBorderColor: 'green',
        ScreenBackgroundColor: 'lightgreen',
        AssetColor: 'yellow',
        AssetActiveIcon: 'horse-active-icon',
        AssetDisabledIcon: 'horse-disabled-icon',
        PlaceholderIcon: 'horse-placeholder-icon',
        PlaceholderDisabledIcon: 'horse-placeholder-disabled-icon',
      },
    ];

    // Mock the assetIcons property in the service
    service['assetIcons'] = mockAssetIcons;

    // Input data for the test
    const screenRuleRequest = { assetType: AssetTypes.Racing } as any;
    const droppedItem = {
      event: {
        virtual: false,
        categoryCode: AssetTypes.Racing,
      },
    } as any;

    // Call the method
    const result = service.getPriorityImage(screenRuleRequest, droppedItem);

    // Assertions
    expect(result).toBeDefined();
    expect(result?.Name).toBe(AssetTypes.Racing, 'Expected the Name to be Racing');
    expect(result?.TypeName).toBe('RacingType', 'Expected the TypeName to be RacingType');
    expect(result?.ScreenBorderColor).toBe('blue', 'Expected the ScreenBorderColor to be blue');
    expect(result?.AssetActiveIcon).toBe('racing-active-icon', 'Expected the AssetActiveIcon to be racing-active-icon');
  });
  it('should assign the correct assetIcon based on assetType and droppedItem event details', () => {
    // Arrange
    const createAssetIcon = (name: string): AssetIcon => ({
      Name: name,
      TypeName: '',
      ScreenBorderColor: '',
      ScreenBackgroundColor: '',
      AssetColor: '',
      AssetActiveIcon: '',
      AssetDisabledIcon: '',
      PlaceholderIcon: '',
      PlaceholderDisabledIcon: '',
    });

    service['assetIcons'] = [
      createAssetIcon(AssetTypes.Racing),
      createAssetIcon(AssetTypes.Virtuals),
      createAssetIcon(AssetTypes.Sports),
      createAssetIcon(AssetTypes.Promotion),
      createAssetIcon(AssetTypes.ManualCreateTemplate),
      createAssetIcon('CustomCategory'),
    ];

    const screenRuleRequest = { assetType: AssetTypes.Racing } as any;
    const droppedItem = {
      event: {
        virtual: true,
        categoryCode: 'CustomCategory',
      },
    } as any;

    // Act
    const assetIcon = service.getPriorityImage(screenRuleRequest, droppedItem);

    // Assert
    expect(assetIcon).toBeDefined();
    expect(assetIcon?.Name).toBe(
      AssetTypes.Virtuals,
      'Expected the Virtuals asset icon to be selected for a virtual event'
    );
  });


  it('should correctly update the screen design based on the screen and droppedItem properties', () => {
    // Arrange: Mock asset icons
    const mockAssetIcons: AssetIcon[] = [
      {
        Name: 'default',
        ScreenBorderColor: 'gray',
        ScreenBackgroundColor: 'lightgray',
        AssetColor: 'black',
        AssetActiveIcon: 'default-active-icon',
        AssetDisabledIcon: 'default-disabled-icon',
        PlaceholderIcon: 'default-placeholder-icon',
        PlaceholderDisabledIcon: 'default-placeholder-disabled-icon',
        TypeName: ''
      },
      {
        Name: 'racing',
        ScreenBorderColor: 'blue',
        ScreenBackgroundColor: 'lightblue',
        AssetColor: 'red',
        AssetActiveIcon: 'racing-active-icon',
        AssetDisabledIcon: 'racing-disabled-icon',
        PlaceholderIcon: 'racing-placeholder-icon',
        PlaceholderDisabledIcon: 'racing-placeholder-disabled-icon',
        TypeName: ''
      },
    ];
    service['assetIcons'] = mockAssetIcons;

    const screen = {
      AssetType: 'racing',
      IsDisabled: false,
      NowPlaying: {
        ScreenRuleRequest: {},
      },
      ScreenDesign: {},
    } as any;

    const droppedItem = {
      event: {
        categoryCode: 'racing',
      },
    } as any;

    // Act: Call the method
    service.getAssetImage(screen, droppedItem);

    // Assert: Verify screen design updates
    expect(screen.ScreenDesign.ScreenBorderColor).toBe(
      'blue',
      'Expected ScreenBorderColor to match the racing asset'
    );
    expect(screen.ScreenDesign.ScreenBackgroundColor).toBe(
      'lightblue',
      'Expected ScreenBackgroundColor to match the racing asset'
    );


  });

  it('should return the default asset icon if getPriorityImage returns null', () => {
    // Arrange
    const defaultIcon: AssetIcon = {
      Name: 'default',
      ScreenBorderColor: 'gray',
      ScreenBackgroundColor: 'lightgray',
      AssetColor: 'black',
      AssetActiveIcon: 'default-active-icon',
      AssetDisabledIcon: 'default-disabled-icon',
      PlaceholderIcon: 'default-placeholder-icon',
      PlaceholderDisabledIcon: 'default-placeholder-disabled-icon',
      TypeName: '',
    };

    const mockAssetIcons = [defaultIcon];
    service['assetIcons'] = mockAssetIcons;

    const mockDroppedItem: DroppedItem = { id: 'item1', name: 'SampleItem' } as any;

    //spyOn(service, 'getPriorityImage').and.returnValue(null);
    spyOn(PrepareScreenRuleRequest, 'createRuleRequest').and.returnValue({} as any);

    // Act
    const result = service.getAssetImageForDroppedItem(mockDroppedItem);

    // Assert
    expect(result).toBe(defaultIcon, 'Expected default asset icon to be returned');
  });

  it('should return the priority asset icon if getPriorityImage returns a valid asset', () => {
    // Arrange
    const priorityIcon: AssetIcon = {
      Name: 'priority',
      ScreenBorderColor: 'blue',
      ScreenBackgroundColor: 'lightblue',
      AssetColor: 'red',
      AssetActiveIcon: 'priority-active-icon',
      AssetDisabledIcon: 'priority-disabled-icon',
      PlaceholderIcon: 'priority-placeholder-icon',
      PlaceholderDisabledIcon: 'priority-placeholder-disabled-icon',
      TypeName: '',
    };

    const defaultIcon: AssetIcon = {
      Name: 'default',
      ScreenBorderColor: 'gray',
      ScreenBackgroundColor: 'lightgray',
      AssetColor: 'black',
      AssetActiveIcon: 'default-active-icon',
      AssetDisabledIcon: 'default-disabled-icon',
      PlaceholderIcon: 'default-placeholder-icon',
      PlaceholderDisabledIcon: 'default-placeholder-disabled-icon',
      TypeName: '',
    };

    const mockAssetIcons = [defaultIcon, priorityIcon];
    service['assetIcons'] = mockAssetIcons;

    const mockDroppedItem: DroppedItem = { id: 'item2', name: 'SamplePriorityItem' } as any;

    spyOn(service, 'getPriorityImage').and.returnValue(priorityIcon);
    spyOn(PrepareScreenRuleRequest, 'createRuleRequest').and.returnValue({} as any);

    // Act
    const result = service.getAssetImageForDroppedItem(mockDroppedItem);

    // Assert
    expect(result).toBe(priorityIcon, 'Expected priority asset icon to be returned');
  });

  it('should call createRuleRequest with correct arguments', () => {
    // Arrange
    const mockDroppedItem: DroppedItem = { id: 'item3', name: 'SampleDroppedItem' } as any;
    spyOn(PrepareScreenRuleRequest, 'createRuleRequest').and.returnValue({} as any);

    // Act
    service.getAssetImageForDroppedItem(mockDroppedItem);

    // Assert
    expect(PrepareScreenRuleRequest.createRuleRequest).toHaveBeenCalledWith(
      service['labelSelectorService'].getCurrentLabel(),
      '',
      mockDroppedItem,
      '',
      false
    );
  });
  it('should call the API and return an array of AssetIcon objects', (done) => {
    // Arrange
    const mockResponse: AssetIcon[] = [
      {
        Name: 'Icon1',
        TypeName: 'Type1',
        ScreenBorderColor: 'blue',
        ScreenBackgroundColor: 'lightblue',
        AssetColor: 'red',
        AssetActiveIcon: 'icon1-active',
        AssetDisabledIcon: 'icon1-disabled',
        PlaceholderIcon: 'icon1-placeholder',
        PlaceholderDisabledIcon: 'icon1-placeholder-disabled',
      },
      {
        Name: 'Icon2',
        TypeName: 'Type2',
        ScreenBorderColor: 'green',
        ScreenBackgroundColor: 'lightgreen',
        AssetColor: 'yellow',
        AssetActiveIcon: 'icon2-active',
        AssetDisabledIcon: 'icon2-disabled',
        PlaceholderIcon: 'icon2-placeholder',
        PlaceholderDisabledIcon: 'icon2-placeholder-disabled',
      },
    ];

    const currentLabel = 'testLabel';

    // Mock the API service
    const apiService = TestBed.inject(ApiService);
    spyOn(apiService, 'get').and.returnValue(of(mockResponse));

    // Act
    service.getAssetIcons(currentLabel).subscribe((result) => {
      // Assert
      expect(apiService.get).toHaveBeenCalledWith(
        '/sitecore/api/displayManager/assetIcons/GetAssetIcons',
        jasmine.any(Object)
      );
      expect(result).toEqual(mockResponse);
      done();
    });
  });

  it('should return GreyhoundsMultiEvent when the first racing event is Greyhounds and isMultiEventTreeNode is true', () => {
    // Arrange
    const screenRuleRequest = {
      isMultiEventTreeNode: true,
    } as any;

    const droppedItem = {
      nodeProperties: {
        eventList: JSON.stringify({
          racingEvents: [
            {
              categoryCode: FilterRacingCategories.GreyHounds,
            },
          ],
        }),
      },
    } as any;

    // Act
    const result = service.getAssetType(screenRuleRequest, droppedItem);

    // Assert
    expect(result).toBe(AssetTypes.GreyhoundsMultiEvent, 'Expected AssetType to be GreyhoundsMultiEvent for the given conditions');
  });

});
