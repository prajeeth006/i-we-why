import { provideHttpClientTesting } from '@angular/common/http/testing';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ScItemService } from '../../sitecore/sc-item-service/sc-item.service';

import { DisplayManagerHeaderComponent } from './display-manager-header.component';
import { LabelSelectorService } from './label-selector/label-selector.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('DisplayManagerHeaderComponent', () => {
  let component: DisplayManagerHeaderComponent;
  let fixture: ComponentFixture<DisplayManagerHeaderComponent>;
  let labelSelectorService: LabelSelectorService;
  let scItemService: ScItemService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [DisplayManagerHeaderComponent],
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
    labelSelectorService = TestBed.inject(LabelSelectorService);
    scItemService = TestBed.inject(ScItemService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayManagerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load label logo image when image data is fetched', () => {
    labelSelectorService.currentLabel$.next('coral');
    spyOn(scItemService, 'getDataFromMasterDB').and.returnValue(of({ ItemMedialUrl: 'test', ItemID: '', ItemName: '', Level: 0, HasChildren: '', TemplateName: '' }));
    component.ngOnInit();
    fixture.detectChanges();
    let imgElNode: NamedNodeMap = fixture.nativeElement.querySelector('img').attributes;
    expect(component.logoImageUrl).toBe('test');
    expect(imgElNode[imgElNode.length - 1].nodeValue).toBe('test');
  });

  it('should update label css class when image data is fetched', () => {
    labelSelectorService.currentLabel$.next('coral');
    spyOn(scItemService, 'getDataFromMasterDB').and.returnValue(of({ ItemMedialUrl: '', ItemID: '', ItemName: '', Level: 0, HasChildren: '', TemplateName: '' }));
    component.ngOnInit();
    fixture.detectChanges();
    expect(labelSelectorService.labelCssClass).toBe('coral-background-colour');
  });
});
