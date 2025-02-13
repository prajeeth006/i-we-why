import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlusNewComponent } from './plus-new.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LabelSelectorService } from '../label-selector/label-selector.service';
import { ApiService } from 'src/app/common/api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { of } from 'rxjs';
import { CarouselService } from 'src/app/display-manager/display-manager-left-panel/tree-view/services/carousel-service/carousel.service';
import { RightPanelTabControlService } from 'src/app/display-manager/display-manager-right-panel/services/tab-control.service';
import { CarouselComponent } from 'src/app/display-manager/display-manager-left-panel/carousel/carousel.component';
import { Constants } from 'src/app/display-manager/display-manager-right-panel/constants/constants';

describe('PlusNewComponent', () => {
  let component: PlusNewComponent;
  let fixture: ComponentFixture<PlusNewComponent>;
  let carouselServiceMock: any;
  let dialogMock: any;
  let labelSelectorServiceMock: any;
  let rightPanelTabControlServiceMock: any;

  beforeEach(async () => {
    carouselServiceMock = {
      setScreenForCarousel: jasmine.createSpy('setScreenForCarousel'),
      setCarouselPopupClose: jasmine.createSpy('setCarouselPopupClose'),
      setCarouselPopupOpen: jasmine.createSpy('setCarouselPopupOpen'),
      dialogRef: { closeAll: jasmine.createSpy('closeAll') },
    };

    dialogMock = {
      open: jasmine.createSpy('open'),
    };

    labelSelectorServiceMock = {
      currentLabel$: of('TestLabel'),
    };

    rightPanelTabControlServiceMock = {
      onNewSportclick: jasmine.createSpy('onNewSportclick'),
    };

    await TestBed.configureTestingModule({
      declarations: [PlusNewComponent],
      imports: [HttpClientTestingModule, MatMenuModule],
      providers: [
        { provide: CarouselService, useValue: carouselServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: LabelSelectorService, useValue: labelSelectorServiceMock },
        { provide: RightPanelTabControlService, useValue: rightPanelTabControlServiceMock },
        ApiService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlusNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set activeLabelClass based on currentLabel$', () => {
    expect(component.activeLabelClass).toBe('in-testlabel');
  });

  describe('newCarousel', () => {
    it('should open a new carousel dialog', (done) => {
      component.newCarousel();

      setTimeout(() => {
        expect(carouselServiceMock.setScreenForCarousel).toHaveBeenCalledWith(undefined);
        expect(carouselServiceMock.setCarouselPopupClose).toHaveBeenCalled();
        expect(carouselServiceMock.dialogRef.closeAll).toHaveBeenCalled();
        expect(dialogMock.open).toHaveBeenCalledWith(CarouselComponent, jasmine.objectContaining({
          id: 'create-new-carousel',
          width: '820px',
          height: '820px',
        }));
        expect(carouselServiceMock.setCarouselPopupOpen).toHaveBeenCalled();
        done();
      }, 150);
    });
  });

  describe('newSportsCoupon', () => {
    it('should call onNewSportclick with sports tab', () => {
      component.newSportsCoupon();
      expect(rightPanelTabControlServiceMock.onNewSportclick).toHaveBeenCalledWith(Constants.sports);
    });
  });

  describe('newRacingChallenge', () => {
    it('should call onNewSportclick with racing tab', () => {
      component.newRacingChallenge();
      expect(rightPanelTabControlServiceMock.onNewSportclick).toHaveBeenCalledWith(Constants.racing);
    });
  });

  describe('isOpened', () => {
    it('should set isMenuOpened to true', () => {
      component.isOpened();
      expect(component.isMenuOpened).toBeTrue();
    });
  });

  describe('isClosed', () => {
    it('should set isMenuOpened to false', () => {
      component.isClosed();
      expect(component.isMenuOpened).toBeFalse();
    });
  });

  describe('newManualRacingTemplate', () => {
    it('should call onNewSportclick with manual tab', () => {
      component.newManualRacingTemplate();
      expect(rightPanelTabControlServiceMock.onNewSportclick).toHaveBeenCalledWith(Constants.manual);
    });
  });

  describe('newManualSportsTemplate', () => {
    it('should call onNewSportclick with provided menuName', () => {
      const menuName = 'customMenu';
      component.newManualSportsTemplate(menuName);
      expect(rightPanelTabControlServiceMock.onNewSportclick).toHaveBeenCalledWith(menuName);
    });

  
  });
});
