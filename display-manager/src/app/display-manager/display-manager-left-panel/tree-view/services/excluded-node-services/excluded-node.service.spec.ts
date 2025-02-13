import { TestBed } from '@angular/core/testing';
import { ExcludedNodeService } from './excluded-node.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { IncludeExcludeNodeService } from '../include-exclude-node/include-exclude-node.service';
import { MainTreeNode } from '../../models/main-tree-node.model';
import { ExcludeConfig, ExcludingTypes } from '../../models/excluded-model';
describe('ExcludedNodeService', () => {
  let service: ExcludedNodeService;
  let includeExcludeNodeService: jasmine.SpyObj<IncludeExcludeNodeService>;

  beforeEach(() => {
    const includeExcludeNodeSpy = jasmine.createSpyObj('IncludeExcludeNodeService', ['setIncludeExcludeNodeData']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ExcludedNodeService,
        { provide: IncludeExcludeNodeService, useValue: includeExcludeNodeSpy }
      ]
    });

    service = TestBed.inject(ExcludedNodeService);
    includeExcludeNodeService = TestBed.inject(IncludeExcludeNodeService) as jasmine.SpyObj<IncludeExcludeNodeService>;
  });

  it('should toggle node exclusion and call setIncludeExcludeNodeData', (done) => {
    const mockNode: MainTreeNode = {
      nodeOptions: { isExcluded: false },
    } as MainTreeNode;

    const currentLabel = 'Test Label';
    const parentList = ['Category1'];

    spyOn(service, 'getNodeType').and.returnValue(ExcludingTypes.Type);
    spyOn(service, 'getNodeValue').and.returnValue('ExcludeValue');
    includeExcludeNodeService.setIncludeExcludeNodeData.and.returnValue(of('{}'));

    service.addEditExcludedNode(currentLabel, mockNode, parentList).subscribe(() => {
      expect(mockNode.nodeOptions.isExcluded).toBeTrue();
      expect(includeExcludeNodeService.setIncludeExcludeNodeData).toHaveBeenCalled();
      done();
    });
  });

  it('should return true if node is in excluded paths', () => {
    const mockNode: MainTreeNode = {} as MainTreeNode;
    const parentList = ['Category1', 'SubCategoryA'];

    spyOn(service, 'getNodeType').and.returnValue(ExcludingTypes.Type);
    spyOn(service, 'getNodeValue').and.returnValue('ExcludeValue');

    service.excludedPaths = [['Category1', 'SubCategoryA', 'ExcludeValue']];

    const result = service.hasToShowIcon(parentList, mockNode);
    expect(result).toBeTrue();
  });

  it('should return false if node is not in excluded paths', () => {
    const mockNode: MainTreeNode = {} as MainTreeNode;
    const parentList = ['Category2', 'DifferentSubCategory'];

    spyOn(service, 'getNodeType').and.returnValue(ExcludingTypes.Type);
    spyOn(service, 'getNodeValue').and.returnValue('ExcludeValue');

    service.excludedPaths = [['Category1', 'SubCategoryA', 'ExcludeValue']];

    const result = service.hasToShowIcon(parentList, mockNode);
    expect(result).toBeFalse();
  });

  it('should return true if node is in delete paths', () => {
    const mockNode: MainTreeNode = {} as MainTreeNode;
    const parentList = ['Category1', 'SubCategoryA'];

    spyOn(service, 'getNodeType').and.returnValue(ExcludingTypes.Type);
    spyOn(service, 'getNodeValue').and.returnValue('DeleteValue');

    service.deletePaths = [['Category1', 'SubCategoryA', 'DeleteValue']];

    const result = service.hasToShowDeleteIcon(parentList, mockNode);
    expect(result).toBeTrue();
  });

  it('should return false if node is not in delete paths', () => {
    const mockNode: MainTreeNode = {} as MainTreeNode;
    const parentList = ['Category2', 'DifferentSubCategory'];

    spyOn(service, 'getNodeType').and.returnValue(ExcludingTypes.Type);
    spyOn(service, 'getNodeValue').and.returnValue('DeleteValue');

    service.deletePaths = [['Category1', 'SubCategoryA', 'DeleteValue']];

    const result = service.hasToShowDeleteIcon(parentList, mockNode);
    expect(result).toBeFalse();
  });

  it('should return true if node is in edit paths', () => {
    const mockNode: MainTreeNode = {} as MainTreeNode;
    const parentList = ['Category1', 'SubCategoryA'];

    spyOn(service, 'getNodeType').and.returnValue(ExcludingTypes.Type);
    spyOn(service, 'getNodeValue').and.returnValue('EditValue');

    service.editPaths = [['Category1', 'SubCategoryA', 'EditValue']];

    const result = service.hasToShowEditIcon(parentList, mockNode);
    expect(result).toBeTrue();
  });

  it('should return false if node is not in edit paths', () => {
    const mockNode: MainTreeNode = {} as MainTreeNode;
    const parentList = ['Category2', 'DifferentSubCategory'];

    spyOn(service, 'getNodeType').and.returnValue(ExcludingTypes.Type);
    spyOn(service, 'getNodeValue').and.returnValue('EditValue');

    service.editPaths = [['Category1', 'SubCategoryA', 'EditValue']];

    const result = service.hasToShowEditIcon(parentList, mockNode);
    expect(result).toBeFalse();
  });

  it('should return true if node is in override paths and overrideMarkets includes dropped market', () => {
    const mockNode: MainTreeNode = {
      event: {
        marketsWhichAreDropped: 'TestMarket'
      }
    } as MainTreeNode;
    const parentList = ['Category1', 'SubCategoryA'];

    spyOn(service, 'getNodeType').and.returnValue(ExcludingTypes.Type);
    spyOn(service, 'getNodeValue').and.returnValue('OverrideValue');

    service.overridePaths = [['Category1', 'SubCategoryA', 'OverrideValue']];
    service.overrideMarkets = ['testmarket'];

    const result = service.hasToShowOverrideIcon(parentList, mockNode);
    expect(result).toBeTrue();
  });

  it('should return true if node is excluded in the cookie data', () => {
    const mockNode: MainTreeNode = {} as MainTreeNode;
    const currentLabel = 'TestLabel';
    const parentList = ['Category1'];

    spyOn(service, 'hasToShowIcon').and.returnValue(true);
    spyOn(service, 'getNodeType').and.returnValue(ExcludingTypes.Type);
    spyOn(service, 'getNodeValue').and.returnValue('ExcludeValue');
    spyOn(service, 'getExcludedNodesFromCookie').and.returnValue({
      [ExcludingTypes.Type]: 'ExcludeValue|OtherValue'
    });

    const result = service.isNodeExcluded(currentLabel, mockNode, parentList);
    expect(result).toBeTrue();
  });

  it('should return a comma-separated list of excluded nodes from cookie data', () => {
    const currentLabel = 'TestLabel';
    const typeOfExclude = ExcludingTypes.Type;
    const parentList = ['Category1'];

    spyOn(service, 'getExcludedNodesFromCookie').and.returnValue({
      [typeOfExclude]: 'Value1|Value2|Value3'
    });

    const result = service.getExcludedNodesList(currentLabel, typeOfExclude, parentList);

    expect(service.getExcludedNodesFromCookie).toHaveBeenCalledWith(currentLabel, parentList[0]);
    expect(result).toBe('Value1,Value2,Value3');
  });

  it('should process and assign excluded paths correctly when configData contains valid settings', () => {
    const configData: ExcludeConfig = {
      Settings: {
        bwinnamevalue: {
          entry: [
            {
              key: ['ExcludedPaths'],
              value: 'Category1|SubCategoryA|ExcludeValue||Category2|SubCategoryB|ExcludeValue'
            }
          ]
        }
      }
    };

    spyOn(service, 'parseString').and.callFake((data, callback) => {
      callback(null, data);
    });

    service.loadConfigValues(configData);

    expect(service.excludedPaths).toEqual([
      ['Category1', 'SubCategoryA', 'ExcludeValue'],
      ['Category2', 'SubCategoryB', 'ExcludeValue']
    ]);
  });

  it('should return excluded nodes from cookie if type and excludedNode exist', () => {
    const currentLabel = 'TestLabel';
    const type = 'TestType';
    service.excludedNode = {
      TestKey: {
        TestType: 'ExcludedValue|OtherExcludedValue',
      },
    };

    const result = service.getExcludedNodesFromCookie(currentLabel, type);

    expect(result).toEqual('ExcludedValue|OtherExcludedValue');
  });

  it('should return empty object if type is undefined', () => {
    const currentLabel = 'TestLabel';
    const type = undefined;
    service.excludedNode = {
      TestKey: {
        TestType: 'ExcludedValue|OtherExcludedValue',
      },
    };

    const result = service.getExcludedNodesFromCookie(currentLabel, type);

    expect(result).toEqual({});
  });

  it('should correctly parse and assign deletePaths when configData contains valid delete paths', () => {
    const configData: ExcludeConfig = {
      Settings: {
        bwinnamevalue: {
          entry: [
            {
              key: ['DeletePaths'],
              value: 'Category1|SubCategoryA|DeleteValue||Category2|SubCategoryB|DeleteValue'
            }
          ]
        }
      }
    };

    spyOn(service, 'parseString').and.callFake((data, callback) => {
      callback(null, data);
    });

    service.loadDeleteConfigValues(configData);

    expect(service.deletePaths).toEqual([
      ['Category1', 'SubCategoryA', 'DeleteValue'],
      ['Category2', 'SubCategoryB', 'DeleteValue']
    ]);
  });

  it('should process and assign edit paths correctly when configData contains valid settings', () => {
    const configData: ExcludeConfig = {
      Settings: {
        bwinnamevalue: {
          entry: [
            {
              key: ['EditPaths'],
              value: 'Category1|SubCategoryA|EditValue||Category2|SubCategoryB|EditValue'
            }
          ]
        }
      }
    };

    spyOn(service, 'parseString').and.callFake((data, callback) => {
      callback(null, data);
    });

    service.loadEditConfigValues(configData);

    expect(service.editPaths).toEqual([
      ['Category1', 'SubCategoryA', 'EditValue'],
      ['Category2', 'SubCategoryB', 'EditValue']
    ]);
  });


  it('should process and assign override paths, override markets, and API URLs correctly when configData contains valid override settings', () => {
    const configData: ExcludeConfig = {
      Settings: {
        bwinnamevalue: {
          entry: [
            {
              key: ['OverridePaths'],
              value: 'Category1|SubCategoryA|OverrideValue||Category2|SubCategoryB|OverrideValue'
            },
            {
              key: ['OverrideMarkets'],
              value: 'testmarket|anothermarket'
            },
            {
              key: ['EventFeedApi'],
              value: 'http://eventfeedapi.com'
            },
            {
              key: ['EventFeedRacingContentApi'],
              value: 'http://racingcontentapi.com'
            },
            {
              key: ['SnapshotTimeOut'],
              value: '5000'
            }
          ]
        }
      }
    };

    spyOn(service, 'parseString').and.callFake((data, callback) => {
      callback(null, data);
    });

    service.loadOverrideConfigValues(configData);

    expect(service.overridePaths).toEqual([
      ['Category1', 'SubCategoryA', 'OverrideValue'],
      ['Category2', 'SubCategoryB', 'OverrideValue']
    ]);

    expect(service.overrideMarkets).toEqual(['testmarket', 'anothermarket']);

    expect(service.sportsbookApiUrl).toBe('http://eventfeedapi.com');
    expect(service.racingContentApiUrl).toBe('http://racingcontentapi.com');

  });

  it('should return ExcludingTypes.Event when eventName is present', () => {
    const mockNode: MainTreeNode = {
      event: {
        eventName: 'Test Event'
      }
    } as MainTreeNode;

    const result = service.getNodeType(mockNode);

    expect(result).toBe(ExcludingTypes.Event);
  });

  it('should return the correct value based on excludingType', () => {
    const mockNode: MainTreeNode = {
      event: {
        id: 'event123'
      },
      nodeProperties: {
        name: 'nodeName'
      }
    } as MainTreeNode;

    let result = service.getNodeValue(ExcludingTypes.Event, mockNode);
    expect(result).toBe('event123');

    result = service.getNodeValue(ExcludingTypes.Type, mockNode);
    expect(result).toBe('nodeName');

    result = service.getNodeValue(ExcludingTypes.Class, mockNode);
    expect(result).toBe('nodeName');

    result = service.getNodeValue(ExcludingTypes.Category, mockNode);
    expect(result).toBe('nodeName');

    result = service.getNodeValue(undefined, mockNode);
    expect(result).toBe('nodeName');
  });
  
});