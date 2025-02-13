import { TestBed } from '@angular/core/testing';

import { IndividualSaveService } from './individual-save.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockIndividualTabGantryProfiles } from '../mocks/Individual-tab-gantry-profiles.mock';
import { GantryLayout } from '../models/individual-gantry-screens.model';
import { ApiService } from 'src/app/common/api.service';
import { of, ReplaySubject } from 'rxjs';
import { LabelSelectorService } from 'src/app/display-manager/display-manager-header/label-selector/label-selector.service';
import { IndividualConfigurationService } from './individual-configuration.service';
import { IndividualScreenAsset } from '../models/individual-asset.model';

describe('IndividualSaveService', () => {
  let service: IndividualSaveService;
  let labelSelectorService: LabelSelectorService;
  let individualConfigservice: IndividualConfigurationService;
  let apiService: ApiService;
  let labelSubject: ReplaySubject<string>;

  beforeEach(() => {
    labelSubject = new ReplaySubject<string>(1);
    TestBed.configureTestingModule({
          imports: [HttpClientTestingModule],
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
    service = TestBed.inject(IndividualSaveService);
    
    labelSelectorService = TestBed.inject(LabelSelectorService);
    apiService = TestBed.inject(ApiService);
    individualConfigservice = TestBed.inject(IndividualConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
