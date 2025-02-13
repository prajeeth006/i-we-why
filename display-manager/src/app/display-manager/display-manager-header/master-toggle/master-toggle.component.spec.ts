import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MasterToggleComponent } from './master-toggle.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LabelSelectorService } from '../label-selector/label-selector.service';
import { SequencencingHelperService } from '../../services/sequencencing-helper/sequencencing-helper.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { CarouselItemNamePipe } from '../../display-manager-left-panel/carousel/filters/carousel-item-name.pipe';

describe('MasterToggleComponent', () => {
  let component: MasterToggleComponent;
  let fixture: ComponentFixture<MasterToggleComponent>;
  let mockSequencencingHelper: jasmine.SpyObj<SequencencingHelperService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockSequencencingHelper = jasmine.createSpyObj('SequencencingHelperService', ['sequenceJourneyStatus']);

    TestBed.configureTestingModule({
      declarations: [MasterToggleComponent, CarouselItemNamePipe],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: SequencencingHelperService, useValue: mockSequencencingHelper },
        { provide: LabelSelectorService, useClass: LabelSelectorService },
        { provide: MatDialog, useValue: mockDialog },
        CarouselItemNamePipe
      ]
    });

    fixture = TestBed.createComponent(MasterToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true when sequenceJourneyStatus is true', () => {
    mockSequencencingHelper.sequenceJourneyStatus.and.returnValue(true);
    expect(component.sequenceJourneyStatus).toBeTrue();
    expect(mockSequencencingHelper.sequenceJourneyStatus).toHaveBeenCalled();
  });

  it('should return false when sequenceJourneyStatus is false', () => {
    mockSequencencingHelper.sequenceJourneyStatus.and.returnValue(false);
    expect(component.sequenceJourneyStatus).toBeFalse();
    expect(mockSequencencingHelper.sequenceJourneyStatus).toHaveBeenCalled();
  });

  it('should open confirmation dialog on toggle change', () => {
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true) });
    mockDialog.open.and.returnValue(dialogRefSpyObj);

    component.onToggleChange();

    expect(mockDialog.open).toHaveBeenCalled();
    expect(dialogRefSpyObj.afterClosed).toHaveBeenCalled();
  });

});
