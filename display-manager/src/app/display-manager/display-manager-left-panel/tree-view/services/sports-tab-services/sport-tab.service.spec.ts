import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SportTabService } from './sport-tab.service';
import { BaseTreeViewService } from 'src/app/display-manager/display-manager-left-panel/generic-tab-service/services/base-tree-view.service';
import { CommonService } from '../common-service/common.service';
import { LabelSelectorService } from 'src/app/display-manager/display-manager-header/label-selector/label-selector.service';
import { MainTreeNode } from '../../models/main-tree-node.model';
import { RacingEvents } from '../../models/event.model';

describe('SportTabService', () => {
  let service: SportTabService;
  let mockBaseTreeViewService: jasmine.SpyObj<BaseTreeViewService>;
  let mockCommonService: jasmine.SpyObj<CommonService>;
  let mockLabelSelectorService: jasmine.SpyObj<LabelSelectorService>;

  beforeEach(() => {
    mockBaseTreeViewService = jasmine.createSpyObj('BaseTreeViewService', ['getRacingTabNodes']);
    mockCommonService = jasmine.createSpyObj('CommonService', ['notifyChange', 'HandleError', 'createEvent'], { promotionCurrentTreeData: [] });
    mockLabelSelectorService = jasmine.createSpyObj('LabelSelectorService', ['getCurrentLabel']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SportTabService,
        { provide: BaseTreeViewService, useValue: mockBaseTreeViewService },
        { provide: CommonService, useValue: mockCommonService },
        { provide: LabelSelectorService, useValue: mockLabelSelectorService },
      ]
    });
    service = TestBed.inject(SportTabService);
  });

  it('should expand the sports node and add child nodes when expand is true', () => {
    // Arrange
    const mockNode: MainTreeNode = {
      nodeProperties: { isLoading: false, level: 1, name: 'Football', id: '1' },
      event: { sportType: 'Trading' } as any,
    } as MainTreeNode;
    mockCommonService.promotionCurrentTreeData.push(mockNode);
    const mockRacingEvents: RacingEvents = {
      content: [
        {
          id: '101',
          name: 'Match 1',
          isExpandable: true,
          sportType: 'Trading',
        },
      ],
    } as RacingEvents;

    mockLabelSelectorService.getCurrentLabel.and.returnValue('Label1');
    mockBaseTreeViewService.getRacingTabNodes.and.returnValue(of(mockRacingEvents));

    // Act
    service.toggleSportsNode(mockNode, true, []);

    // Assert
    expect(mockNode.nodeProperties.isLoading).toBe(true);
    expect(mockBaseTreeViewService.getRacingTabNodes).toHaveBeenCalledWith('Label1', mockNode.event, service.filters, false);
    expect(mockCommonService.promotionCurrentTreeData.length).toBeGreaterThan(1);
    expect(mockCommonService.notifyChange).toHaveBeenCalledWith(mockNode);
  });

  it('should handle errors when fetching racing nodes fails', () => {
    // Arrange
    const mockNode: MainTreeNode = {
      nodeProperties: { isLoading: false, level: 1, name: 'Football', id: '1' },
      event: { sportType: 'Trading' } as any,
    } as MainTreeNode;
    mockCommonService.promotionCurrentTreeData.push(mockNode);

    mockLabelSelectorService.getCurrentLabel.and.returnValue('Label1');
    mockBaseTreeViewService.getRacingTabNodes.and.returnValue(throwError(() => new Error('API Error')));

    // Act
    service.toggleSportsNode(mockNode, true, []);

    // Assert
    expect(mockNode.nodeProperties.isLoading).toBe(true);
    expect(mockBaseTreeViewService.getRacingTabNodes).toHaveBeenCalledWith('Label1', mockNode.event, service.filters, false);
    expect(mockCommonService.HandleError).toHaveBeenCalled();
  });
});
