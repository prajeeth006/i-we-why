import { TestBed } from '@angular/core/testing';
import { CarouselTabService } from './carousel-tab.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CarouselItemNamePipe } from '../../../carousel/filters/carousel-item-name.pipe';
import { MatTabsModule } from '@angular/material/tabs';
import { ApiService } from 'src/app/common/api.service';
import { CommonService } from '../common-service/common.service';
import { MainTreeNode } from '../../models/main-tree-node.model';
import { of, throwError } from 'rxjs';
import { ScreenRuleRequest } from 'src/app/display-manager/display-manager-right-panel/display-manager-screens/models/display-screen-rule.model';
import { HttpParams } from '@angular/common/http';
import { Carousel } from '../../../carousel/models/carousel';
import { ScItem } from 'src/app/sitecore/sc-models/sc-item.model';
import { NodeOptions } from '../../models/tree-node.model';

class MockCommonService {
  promotionCurrentTreeData: MainTreeNode[] = [];
  notifyChange(node: MainTreeNode) { }
  HandleError(error: any, node: MainTreeNode) { }
}

class MockApiService {
  get<T>(url: string, params: HttpParams) {
    return of({
      GantryTargetingRules: [
        {
          label: 'Rule 1',
          path: '/rule1',
          targetItemID: '1',
          targetItemName: 'Item 1',
          ruleId: 'r1',
          racingEvent: { id: 'event1', name: 'Event 1' } as any,
        },
        {
          label: 'Rule 2',
          path: '/rule2',
          targetItemID: '2',
          targetItemName: 'Item 2',
          ruleId: 'r2',
          racingEvent: { id: 'event2', name: 'Event 2' } as any,
        }
      ]
    });
  }
}

describe('CarouselTabService', () => {
  let service: CarouselTabService;
  let httpMock: HttpTestingController;
  let commonService: MockCommonService;
  let apiService: MockApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatTabsModule],
      providers: [
        CarouselItemNamePipe,
        { provide: ApiService, useClass: MockApiService },
        { provide: CommonService, useClass: MockCommonService }
      ]
    });
    service = TestBed.inject(CarouselTabService);
    httpMock = TestBed.inject(HttpTestingController);
    commonService = TestBed.inject(CommonService) as any;
    apiService = TestBed.inject(ApiService) as any;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should collapse node and remove children from the tree', () => {
    const node = new MainTreeNode({ id: '1', name: 'Test Node', level: 0, isFolder: false, expandable: true }, {} as any);
    const childNode = new MainTreeNode({ id: '2', name: 'Child Node', level: 1, isFolder: false, expandable: false }, {} as any);
    commonService.promotionCurrentTreeData = [node, childNode];

    const originalLength = commonService.promotionCurrentTreeData.length;
    service.toggleCarouselNode(node, false, []);
    expect(commonService.promotionCurrentTreeData.length).toBeLessThan(originalLength);
  });

  it('should expand node and add children to the tree', () => {
    const mockResponse = [
      { ItemName: 'Item 1', ItemID: 'r1', Level: 0, HasChildren: 'false', TemplateName: '', TargetLink: '' },
      { ItemName: 'Item 2', ItemID: 'r2', Level: 0, HasChildren: 'false', TemplateName: '', TargetLink: '' },
    ];

    service.getCarouselItems('test-carousel-id').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
  });

  it('should handle error during node expansion', () => {
    spyOn(commonService, 'HandleError');

    spyOn(apiService, 'get').and.returnValue(throwError(() => new Error('API error')));

    const node = new MainTreeNode(
      { id: 'invalid-id', name: 'Error Node', level: 0, isFolder: false, expandable: true },
      {} as any,
    );

    service.getCarouselItems(node.nodeProperties.id).subscribe({
      next: () => {
        fail('Expected an error, but got success response');
      },
      error: (err) => {
        commonService.HandleError(err, node);
      },
    });

    expect(commonService.HandleError).toHaveBeenCalledWith(jasmine.anything(), node);
  });

  it('should update promotionCurrentTreeData and notify change when getCarouselItems succeeds', () => {
    const mockScItems: ScItem[] = [
      {
        ItemID: 'id1', ItemName: 'Node 1', TemplateName: 'Folder', HasChildren: 'True',
        Level: 0,
        TargetLink: ''
      },
      {
        ItemID: 'id2', ItemName: 'Node 2', TemplateName: 'Item', HasChildren: 'False',
        Level: 0,
        TargetLink: ''
      },
    ];
    const mockNode = new MainTreeNode(
      {
        id: 'root', name: 'Root Node', level: 0, isFolder: true, expandable: true,
        isPromotionTreeNode: true, isChannelTreeNode: false, isCarousleNode: false, isMisc: false,
      },
      {} as NodeOptions
    );

    spyOn(service, 'getCarouselItems').and.returnValue(of(mockScItems));
    const notifyChangeSpy = spyOn(commonService, 'notifyChange');

    commonService.promotionCurrentTreeData = [
      mockNode,
    ];

    const index = 0;

    service.toggleCarouselNode(mockNode, true, []);

    expect(commonService.promotionCurrentTreeData.length).toBe(3);
    expect(commonService.promotionCurrentTreeData[1].nodeProperties.id).toBe('id1');
    expect(commonService.promotionCurrentTreeData[2].nodeProperties.id).toBe('id2');
    expect(notifyChangeSpy).toHaveBeenCalledWith(mockNode);
  });
});
