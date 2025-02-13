import {
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  Input,
  signal,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  CarouselComponent,
  CarouselControlComponent,
  CarouselIndicatorsComponent,
  CarouselInnerComponent,
  CarouselItemComponent,
  ThemeDirective,
} from '@coreui/angular';
import { GantryScreensComponent } from '../carousel-widget-slides/gantry-screens/gantry-screens.component';

import { PeripheralScreensComponent } from '../carousel-widget-slides/peripheral-screens/peripheral-screens.component';
import { GantryLayout, SortedScreensData } from '../models/individual-gantry-screens.model';
import { IndividualConfigurationService } from '../services/individual-configuration.service';

@Component({
  selector: 'app-carousel-widget',
  standalone: true,
  templateUrl: './carousel-widget.component.html',
  styleUrl: './carousel-widget.component.scss',
  imports: [
    ThemeDirective,
    CarouselComponent,
    CarouselInnerComponent,
    CarouselItemComponent,
    CarouselIndicatorsComponent,
    CarouselControlComponent,
    RouterLink,
    GantryScreensComponent,
    PeripheralScreensComponent,
  ],
})
export class CarouselWidgetComponent {
  @ViewChild('carousel') carousel!: CarouselComponent;
  @ViewChild('ctrlPrev') ctrlPrev: any;
  @ViewChild('ctrlNext') ctrlNext: any;

  isFirstSlide = false;
  isLastSlide = false;
  totalSlides: number = 2;
  _gantryLayout: GantryLayout | undefined;
  _gantryScreenData: SortedScreensData | undefined;
  _peripheralScreenData: SortedScreensData | undefined;
  currentIndex = 0;
  private individualConfigurationService = inject(IndividualConfigurationService);

  currentSlides: any[] = [];
  constructor(private cdr: ChangeDetectorRef) {
    effect(() => {
      this._gantryLayout = this.individualConfigurationService.getActiveGantryLayout();
      if(this._gantryLayout?.GantryType.SortedGantryScreenData){
        this._gantryScreenData = {...this._gantryLayout?.GantryType.SortedGantryScreenData};
      }
      if(this._gantryLayout?.GantryType.SortedPeripheralScreenData){
        this._peripheralScreenData = {...this._gantryLayout?.GantryType.SortedPeripheralScreenData};
      }

      let activeSlide = this._gantryLayout?.GantryType?.ActiveSlide ?? 0;

      if(activeSlide == 0 && this.currentIndex == 1){
        this.prev();
        this.currentIndex = 0;
      } else if(activeSlide == 1 && this.currentIndex == 0){
        this.next();
        this.currentIndex = 1;
      } 

    })
  }

  onItemChange($event: any): void {
    this.currentIndex = $event;
    if(this._gantryLayout){
      this._gantryLayout.GantryType.ActiveSlide = this.currentIndex ?? 0;
    }
    setTimeout(() => {
      this.isFirstSlide = this.currentIndex === 0;
      this.isLastSlide = this.currentIndex === this.totalSlides - 1;
    }, 0);
  }

  prev(): void {
    this.ctrlPrev.play();
  }

  next(): void {
    this.ctrlNext.play();
  }
}
