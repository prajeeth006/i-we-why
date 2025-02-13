import { TestBed } from '@angular/core/testing';

import { TreeBreadCrumbService } from './tree-bread-crumb.service';

describe('TreeBreadCrumbService', () => {
  let service: TreeBreadCrumbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreeBreadCrumbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
