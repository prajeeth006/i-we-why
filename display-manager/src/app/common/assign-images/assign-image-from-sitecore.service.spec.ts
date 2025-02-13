import { TestBed } from '@angular/core/testing';
import { AssignImageFromSitecoreService } from './assign-image-from-sitecore.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ScItemService } from 'src/app/sitecore/sc-item-service/sc-item.service';
import { of } from 'rxjs';
import { Image } from '../../sitecore/sc-models/sc-image.model';
import { GantryTab } from 'src/app/display-manager/display-manager-left-panel/product-tabs/product-tabs.component';

describe('AssignImageFromSitecoreService', () => {
  let service: AssignImageFromSitecoreService;
  let scItemServiceMock: jasmine.SpyObj<ScItemService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ScItemService', ['getDataFromMasterDB']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AssignImageFromSitecoreService,
        { provide: ScItemService, useValue: spy }
      ]
    });
    service = TestBed.inject(AssignImageFromSitecoreService);
    scItemServiceMock = TestBed.inject(ScItemService) as jasmine.SpyObj<ScItemService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getDataFromMasterDB and return image data', () => {
    const mockImage: Image = { ItemMedialUrl: 'mockUrl' };
    const gantryTab: GantryTab = {
      Image: '<img mediaid="mockMediaId" />',
      Title: '',
      imageUrl: '',
      ItemID: '',
      ItemName: '',
      Level: 0,
      HasChildren: '',
      TemplateName: '',
      TargetLink: ''
    };

    scItemServiceMock.getDataFromMasterDB.and.returnValue(of(mockImage));

    service.assignImage(gantryTab).subscribe((image) => {
      expect(image).toEqual(mockImage);
      expect(scItemServiceMock.getDataFromMasterDB).toHaveBeenCalledWith('/sitecore/api/ssc/item/mockMediaId');
    });
  });

  it('should handle cases where no image is found', () => {
    const gantryTab: GantryTab = {
      Image: '<img mediaid="mockMediaId" />',
      Title: '',
      imageUrl: '',
      ItemID: '',
      ItemName: '',
      Level: 0,
      HasChildren: '',
      TemplateName: '',
      TargetLink: ''
    };

    scItemServiceMock.getDataFromMasterDB.and.returnValue(of(null));

    service.assignImage(gantryTab).subscribe((image) => {
      expect(image).toBeNull();
      expect(scItemServiceMock.getDataFromMasterDB).toHaveBeenCalledWith('/sitecore/api/ssc/item/mockMediaId');
    });
  });

});
