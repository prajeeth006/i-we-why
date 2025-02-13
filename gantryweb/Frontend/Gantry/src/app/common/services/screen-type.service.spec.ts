import { TestBed } from '@angular/core/testing';

import { ScreenTypeService } from './screen-type.service';

describe('ScreenTypeService', () => {
  let service: ScreenTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScreenTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('to set screenType half', () => {
    let screenType = "half";
    expect(service.setScreenType(screenType));
  });

  it('to set screenType quad', () => {
    let screenType = "quad";
    expect(service.setScreenType(screenType));
  });

  it('to set screenType full', () => {
    let screenType = "full";
    expect(service.setScreenType(screenType));
  });

});
