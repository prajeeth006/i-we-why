import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ScItemService } from 'src/app/sitecore/sc-item-service/sc-item.service';
import { LabelSelectorService } from '../../display-manager-header/label-selector/label-selector.service';

describe('LabelSelectorService', () => {
  let service: LabelSelectorService;
  let scItemService: ScItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ScItemService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(LabelSelectorService);
    scItemService = TestBed.inject(ScItemService);
  });

  afterEach(() => {
    // Reset spies after each test to ensure a clean slate
    const spy = scItemService.getDataFromMasterDB as jasmine.Spy;
    if (spy.calls) {
      spy.calls.reset();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not fail when there is no data from the API', () => {
    spyOn(scItemService, 'getDataFromMasterDB').and.returnValue(of(null));

    service.loadLabels();

    expect(service.labels$.value).toEqual([]);
    expect(service).toBeTruthy();
  });

});
