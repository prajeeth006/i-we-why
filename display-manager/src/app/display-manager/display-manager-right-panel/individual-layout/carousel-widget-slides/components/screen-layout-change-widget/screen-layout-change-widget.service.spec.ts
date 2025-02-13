import { TestBed } from '@angular/core/testing';

import { ScreenLayoutChangeWidgetService } from './screen-layout-change-widget.service';

describe('ScreenLayoutChangeWidgetService', () => {
  let service: ScreenLayoutChangeWidgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScreenLayoutChangeWidgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
