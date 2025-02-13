import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TreeViewComponent } from './tree-view.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CarouselItemNamePipe } from '../../../carousel/filters/carousel-item-name.pipe';
import { TreeViewService } from '../../services/tree-view.service';
import { CarouselTabService } from '../../services/carousel-tab-services/carousel-tab.service';

class MockTreeViewService {
  // Mock any needed methods here
}

class MockCarouselTabService {
  // Mock any needed methods here
}

describe('TreeViewComponent', () => {
  let component: TreeViewComponent;
  let fixture: ComponentFixture<TreeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TreeViewComponent, CarouselItemNamePipe],
      providers: [
        { provide: TreeViewService, useClass: MockTreeViewService },
        { provide: CarouselTabService, useClass: MockCarouselTabService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParams: {} },
            paramMap: of({})
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeViewComponent);
    component = fixture.componentInstance;

    // Mock the subscription with a jasmine spy object for the unsubscribe method
    component['staticPromotionsFolderIdSubscription'] = jasmine.createSpyObj('staticPromotionsFolderIdSubscription', ['unsubscribe']);

    fixture.detectChanges(); // Trigger change detection after component creation
  });

  afterEach(() => {
    // Explicitly call ngOnDestroy to simulate cleanup
    if (component.ngOnDestroy) {
      component.ngOnDestroy(); // Call ngOnDestroy method to ensure cleanup
    }

    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
