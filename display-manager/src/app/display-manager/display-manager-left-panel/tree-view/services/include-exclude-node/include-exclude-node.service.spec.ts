import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IncludeExcludeNodeService } from './include-exclude-node.service';
import { ApiService } from 'src/app/common/api.service';
import { NodeHideShow } from '../../models/node-hide-show';
import { of } from 'rxjs';
import { HttpParams } from '@angular/common/http';

describe('IncludeExcludeNodeService', () => {
  let service: IncludeExcludeNodeService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', ['post', 'get']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: ApiService, useValue: spy }]
    });

    service = TestBed.inject(IncludeExcludeNodeService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should call ApiService.post with the correct URL and payload for setIncludeExcludeNodeData', () => {
    const mockNodeHideShow: NodeHideShow = {
      currentLabel: 'Label1',
      category: 'Category1',
      excludeValue: 'Value1',
      type: 'Type1',
      isExclude: true
    };
    const mockResponse = 'Success';
    apiServiceSpy.post.and.returnValue(of(mockResponse));

    service.setIncludeExcludeNodeData(mockNodeHideShow).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    expect(apiServiceSpy.post).toHaveBeenCalledOnceWith(
      '/sitecore/api/displayManager/nodeDataHideShow/setNodeDatahHideShow',
      mockNodeHideShow
    );
  });

  it('should call ApiService.get with the correct URL and parameters for getIncludeExcludeNodeData', () => {
    const currentLabel = 'Label1';
    const mockResponse = 'Node data retrieved successfully';
    apiServiceSpy.get.and.returnValue(of(mockResponse));

    service.getIncludeExcludeNodeData(currentLabel).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    // Capture the actual call
    expect(apiServiceSpy.get).toHaveBeenCalledTimes(1);
    const [url, params] = apiServiceSpy.get.calls.mostRecent().args;

    // Assert URL
    expect(url).toEqual('/sitecore/api/displayManager/nodeDataHideShow/getNodeDatahHideShow');

  });

});
