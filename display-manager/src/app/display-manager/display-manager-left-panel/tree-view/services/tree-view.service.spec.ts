import { TestBed } from '@angular/core/testing';

import { TreeViewService } from './tree-view.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ScItemService } from 'src/app/sitecore/sc-item-service/sc-item.service';
import { CarouselItemNamePipe } from '../../carousel/filters/carousel-item-name.pipe';

describe('TreeViewService', () => {
  let service: TreeViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ScItemService,CarouselItemNamePipe]
    });
    service = TestBed.inject(TreeViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
