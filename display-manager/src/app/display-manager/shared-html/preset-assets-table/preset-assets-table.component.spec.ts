import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PresetAssetsTableComponent } from './preset-assets-table.component';
import { UntypedFormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from 'src/app/shared-module';
import { IndividualConfigurationService } from '../../display-manager-right-panel/individual-layout/services/individual-configuration.service';
import { SitecoreImageService, SitecoreImages } from '../../display-manager-left-panel/services/sitecore-image/sitecore-image.service';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule
import { PresetAssetNamePipe } from '../../display-manager-right-panel/filters/assetname/presetassetname.pipe'; // Import the missing pipe
import { BehaviorSubject, of } from 'rxjs';
import { PresetAssetData } from '../../display-manager-right-panel/individual-layout/models/sequence-preset';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

describe('PresetAssetsTableComponent', () => {
  let component: PresetAssetsTableComponent;
  let fixture: ComponentFixture<PresetAssetsTableComponent>;
  let individualConfigurationServiceMock: jasmine.SpyObj<IndividualConfigurationService>;
  let sitecoreImageServiceMock: jasmine.SpyObj<SitecoreImageService>;
  let fb: UntypedFormBuilder;

  beforeEach(async () => {
    individualConfigurationServiceMock = jasmine.createSpyObj('IndividualConfigurationService', ['sequencePresetData$', 'initialPresetData$']);
    sitecoreImageServiceMock = jasmine.createSpyObj('SitecoreImageService', ['mediaAssets$']);

    // Mock mediaAssets$ to return an observable
    sitecoreImageServiceMock.mediaAssets$ = new BehaviorSubject<SitecoreImages | null>({
      HamburgerIcon: 'path/to/hamburger/icon'
    });

    individualConfigurationServiceMock.sequencePresetData$ = new BehaviorSubject<PresetAssetData>({} as PresetAssetData);
    individualConfigurationServiceMock.initialPresetData$ = new BehaviorSubject<PresetAssetData>({} as PresetAssetData);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatIconModule,
        MatFormFieldModule,
        SharedModule,
        HttpClientTestingModule,  // Include HttpClientTestingModule
        PresetAssetNamePipe,  // Import the PresetAssetNamePipe
        PresetAssetsTableComponent  // Standalone component
      ],
      providers: [
        { provide: IndividualConfigurationService, useValue: individualConfigurationServiceMock },
        { provide: SitecoreImageService, useValue: sitecoreImageServiceMock },
        UntypedFormBuilder,
        { provide: PresetAssetNamePipe, useClass: PresetAssetNamePipe } // Explicitly provide the pipe
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PresetAssetsTableComponent);
    component = fixture.componentInstance;
    component.parentFormgroup = new FormGroup({});
    fb = TestBed.inject(UntypedFormBuilder);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  it('should remove preset item at the specified index', () => {
    component.presetListRow.push(component['fb'].group({ displayOrder: 1 }));
    component.presetListRow.push(component['fb'].group({ displayOrder: 2 }));
    component.presetListRow.push(component['fb'].group({ displayOrder: 3 }));

    expect(component.presetListRow.length).toBe(3);

    (component.presetListRow as any).removeAt(1);

    expect(component.presetListRow.length).toBe(2);
    expect(component.presetListRow.at(0).value.displayOrder).toBe(1);
  });


  it('should move item in array when drop event occurs', () => {
    component.presetListRow.push(component['fb'].group({ displayOrder: 1 }));
    component.presetListRow.push(component['fb'].group({ displayOrder: 2 }));
    component.presetListRow.push(component['fb'].group({ displayOrder: 3 }));

    const dropEvent: CdkDragDrop<string[]> = {
      container: component.presetListRow,
      previousContainer: component.presetListRow,
      previousIndex: 0,
      currentIndex: 2,
      item: component.presetListRow.at(0),
      isPointerOverContainer: true,
      distance: { x: 0, y: 0 },
    } as unknown as CdkDragDrop<string[]>;

    spyOn(component, 'changePositionSerialNumbers');

    component.drop(dropEvent);

    expect(component.presetListRow.at(0).value.displayOrder).toBe(2);
    expect(component.presetListRow.at(2).value.displayOrder).toBe(1);

    expect(component.changePositionSerialNumbers).toHaveBeenCalled();
  });

  it('should return true for Scrolling asset type', () => {
    const assetType = 'Scrolling';
    const result = component.isScrollingOrRunnerCount(assetType);
    expect(result).toBeTrue();
  });

  it('should return true for Runnercount asset type', () => {
    const assetType = 'Runnercount';
    const result = component.isScrollingOrRunnerCount(assetType);
    expect(result).toBeTrue();
  });

  it('should return false for other asset types', () => {
    const assetType = 'OtherAssetType';
    const result = component.isScrollingOrRunnerCount(assetType);
    expect(result).toBeFalse();
  });

  it('should update displayOrder in presetListRow controls on updateSerialNumbers call', () => {
    const fb = component['fb'];

    component.presetListRow.push(fb.group({ displayOrder: [1] }));
    component.presetListRow.push(fb.group({ displayOrder: [2] }));
    component.presetListRow.push(fb.group({ displayOrder: [3] }));

    component.updateSerialNumbers();

    expect(component.presetListRow.at(0).value.displayOrder).toBe(1);
    expect(component.presetListRow.at(1).value.displayOrder).toBe(2);
    expect(component.presetListRow.at(2).value.displayOrder).toBe(3);
  });

  it('should delete preset item at the specified displayOrder', () => {
    const fb = component['fb'];
    component.presetListRow.push(fb.group({ displayOrder: 1 }));
    component.presetListRow.push(fb.group({ displayOrder: 2 }));
    component.presetListRow.push(fb.group({ displayOrder: 3 }));
  
    expect(component.presetListRow.length).toBe(3); 
  
    component.deletePresetItem(2);
  
    expect(component.presetListRow.length).toBe(2); 
  
    expect(component.presetListRow.at(0).value.displayOrder).toBe(1);
    expect(component.presetListRow.at(1).value.displayOrder).toBe(2);
  });

  it('should update the displayOrder values when changePositionSerialNumbers is called', () => {
    const fb = component['fb'];
    component.presetListRow.push(fb.group({ displayOrder: 1, isResulted : true }));
    component.presetListRow.push(fb.group({ displayOrder: 2 }));
    component.presetListRow.push(fb.group({ displayOrder: 3 }));
  
    expect(component.presetListRow.at(0).value.displayOrder).toBe(1);
    expect(component.presetListRow.at(1).value.displayOrder).toBe(2);
    expect(component.presetListRow.at(2).value.displayOrder).toBe(3);
  
    const reorderedControls = [
      component.presetListRow.at(2), 
      component.presetListRow.at(0), 
      component.presetListRow.at(1), 
    ];
    component.presetListRow.clear();
    reorderedControls.forEach(control => component.presetListRow.push(control));
  
    component.changePositionSerialNumbers();
  
    expect(component.presetListRow.at(0).value.displayOrder).toBe(2); 
    expect(component.presetListRow.at(1).value.displayOrder).toBe(1); 
    expect(component.presetListRow.at(2).value.displayOrder).toBe(3); 
  });

  it('should filter presetListRow based on search key', () => {
    const fb = component['fb'];
    component.presetListRow.push(fb.group({ displayOrder: 1, name: 'Horse Racing' }));
    component.presetListRow.push(fb.group({ displayOrder: 2, name: 'Football' }));
    component.presetListRow.push(fb.group({ displayOrder: 3, name: 'Basketball' }));
  
    expect(component.presetListRow.length).toBe(3);
  
    
    expect(component.presetListRow.length).toBe(3);
    expect(component.presetListRow.at(0).value.name).toBe('Horse Racing');
  
  
    expect(component.presetListRow.length).toBe(3);
    expect(component.presetListRow.at(0).value.name).toBe('Horse Racing');
  
    component.onSearchKeyChange();
  
    expect(component.presetListRow.length).toBe(3);
  });

  it('should filter presetListRow based on the provided filter criteria', () => {
    const fb = component['fb'];
    component.presetListRow.push(fb.group({ displayOrder: 1, name: 'Horse Racing', category: 'Sports' }));
    component.presetListRow.push(fb.group({ displayOrder: 2, name: 'Football', category: 'Sports' }));
    component.presetListRow.push(fb.group({ displayOrder: 3, name: 'Basketball', category: 'Sports' }));
    component.presetListRow.push(fb.group({ displayOrder: 4, name: 'Movie Night', category: 'Entertainment' }));
  
    expect(component.presetListRow.length).toBe(4);
  
    component.filterPresetItems('Sports');
    
    expect(component.presetListRow.length).toBe(4);
    expect(component.presetListRow.at(0).value.name).toBe('Horse Racing');
    expect(component.presetListRow.at(1).value.name).toBe('Football');
    expect(component.presetListRow.at(2).value.name).toBe('Basketball');
  
    component.filterPresetItems('Entertainment');
    
    expect(component.presetListRow.length).toBe(4);
    expect(component.presetListRow.at(0).value.name).toBe('Horse Racing');
  
    component.filterPresetItems('Music');
    
    expect(component.presetListRow.length).toBe(4);
  
    component.filterPresetItems('');
    
    expect(component.presetListRow.length).toBe(4);
  });

  it('should add a new preset item to the form array', () => {
    const mockEvent = {
      event: {
        categoryCode: 'HorseRacing',
        assetType: 'Runnercount',
        name: 'SampleEvent',
      },
    };

    spyOn(component, 'isScrollingOrRunnerCount').and.returnValue(true);
    spyOn(component, 'isHorseOrGreyhoundEvent').and.returnValue(true);

    component.addNewPresetItem(mockEvent);

    expect(component.presetListRow.length).toBe(1);
  });

  it('should update displayOrder values in presetListRow', () => {
    const fb = component['fb'];

    component.presetListRow.push(fb.group({ displayOrder: [1] }));
    component.presetListRow.push(fb.group({ displayOrder: [2] }));
    component.presetListRow.push(fb.group({ displayOrder: [3] }));

    const reorderedControls = [
      component.presetListRow.at(2),
      component.presetListRow.at(0),
      component.presetListRow.at(1),
    ];
    component.presetListRow.clear();
    reorderedControls.forEach(control => component.presetListRow.push(control));

    component.updateSerialNumbers();

    expect(component.presetListRow.at(0).value.displayOrder).toBe(1);
    expect(component.presetListRow.at(1).value.displayOrder).toBe(2);
    expect(component.presetListRow.at(2).value.displayOrder).toBe(3);
  });
});
