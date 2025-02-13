import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarouselWidgetComponent } from './carousel-widget.component';
import { CarouselComponent, CarouselControlComponent } from '@coreui/angular';
import { GantryScreensComponent } from '../carousel-widget-slides/gantry-screens/gantry-screens.component';
import { PeripheralScreensComponent } from '../carousel-widget-slides/peripheral-screens/peripheral-screens.component';
import { ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ChangeDetectorRef, inject, signal } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IndividualConfigurationService } from '../services/individual-configuration.service';
import { GantryLayout } from '../models/individual-gantry-screens.model';
import { MockIndividualTabGantryProfiles } from '../mocks/Individual-tab-gantry-profiles.mock';

describe('CarouselWidgetComponent', () => {
  let individualConfigurationService: IndividualConfigurationService;
  let component: CarouselWidgetComponent;
  let fixture: ComponentFixture<CarouselWidgetComponent>;
  let mockConfigService: jasmine.SpyObj<IndividualConfigurationService>;
  

  beforeEach(async () => {
    mockConfigService = jasmine.createSpyObj('IndividualConfigurationService', ['getActiveGantryLayout']);

    Object.defineProperty(mockConfigService, '_currentLayoutType', {
      value: signal<string>(''),
      writable: true // Allow modification in tests
    });
    
    await TestBed.configureTestingModule({
      imports: [
        CarouselWidgetComponent,
        CarouselComponent,
        CarouselControlComponent,
        GantryScreensComponent,
        PeripheralScreensComponent,
        BrowserAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: {} } }
        },
        { provide: IndividualConfigurationService, useValue: mockConfigService },
        ChangeDetectorRef,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CarouselWidgetComponent);
    individualConfigurationService = TestBed.inject(IndividualConfigurationService);
    component = fixture.componentInstance;

    component.ctrlPrev = jasmine.createSpyObj('ctrlPrev', ['play']);
    component.ctrlNext = jasmine.createSpyObj('ctrlNext', ['play']);

    const changeDetectorRef = fixture.debugElement.injector.get(ChangeDetectorRef);
    changeDetectorRef.detectChanges();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call prev() method and trigger ctrlPrev play', () => {
    spyOn(component.ctrlPrev, 'play');
    component.prev();
    expect(component.ctrlPrev.play).toHaveBeenCalled();
  });

  it('should call next() method and trigger ctrlNext play', () => {
    spyOn(component.ctrlNext, 'play');
    component.next();
    expect(component.ctrlNext.play).toHaveBeenCalled();
  });

  it('should handle item change and update currentIndex', () => {
    const newIndex = 2;
    component.onItemChange(newIndex);
    expect(component.currentIndex).toBe(newIndex);
    expect(component.isFirstSlide).toBeFalse();
    expect(component.isLastSlide).toBeFalse();
  });
});
