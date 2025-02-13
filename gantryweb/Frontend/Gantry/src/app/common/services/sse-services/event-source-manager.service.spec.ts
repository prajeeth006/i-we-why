import { TestBed } from '@angular/core/testing';

import { EventSourceManager } from './event-source-manager.service';

describe('EventSourceManager', () => {
  let service: EventSourceManager;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventSourceManager);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
