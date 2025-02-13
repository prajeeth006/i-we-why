import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input,  ViewEncapsulation } from '@angular/core';
import { CarouselUrl } from '../carousel/models/CarouselUrl';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'gn-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('modalState', [
      state(
        'Step3',
        style({
          transform: 'translateX(-100%)',
        })
      ),
      state(
        'Step2',
        style({
          transform: 'translateX(0%)',
        })
      ),
      state(
        'Step1',
        style({
          transform: 'translateX(100%)',
        })
      ),
      transition('Step1 => Step2', animate('0ms ease')),
      transition('Step2 => Step3', animate('0ms 0ms ease')),
      transition('Step3 => Step1', animate('0s ease')),
    ]),
  ],
})
export class SliderComponent{
    
    private _carouselUrls: CarouselUrl[] = [];
    @Input()
    set carouselUrls(value: CarouselUrl[] ) {
      this._carouselUrls = value;
      this._carouselUrls.forEach(carouselUrl => {
        carouselUrl.state = 'Step1'
      });
      if (value !== null) {
        this.slideNext();
      }
    }
    get carouselUrls() {
      return this._carouselUrls;
    }
    
    slideAfterDuration: NodeJS.Timeout;
    unloadIframeTtimeOut: NodeJS.Timeout;
    loadUrlTimeout: NodeJS.Timeout;
    setAnimateStateTimeOut: NodeJS.Timeout;
    
    minimumDuration: number = 10;
    preloadUrlBefore: number = 3;
    blankUrl: string = "about:blank";
    presentIndex = -1;

    slideNext() {
      let previousIndex = this.presentIndex;
      if (this.presentIndex != -1) {
        this.carouselUrls[this.presentIndex].state = 'Step3';

        //Unloads Iframe url after slideing completed.
        this.unloadIframeTtimeOut = setTimeout(() => {  
          this.clearSelfTimeOut(this.unloadIframeTtimeOut);
          this.carouselUrls[previousIndex].safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.blankUrl);
        },1000)

      } else {
          this.loadNextUrl();
      }

      //Slide the Page.
      this.presentIndex = (this.presentIndex + 1) % this.carouselUrls?.length;
      this.carouselUrls[this.presentIndex].state = 'Step1';
      this.setAnimateStateTimeOut = setTimeout(() => {
        this.clearSelfTimeOut(this.setAnimateStateTimeOut);
        this.carouselUrls[this.presentIndex].state = 'Step2';
      });

      let duration = this.carouselUrls[this.presentIndex]?.carouselDuration;
      duration = (duration && duration >= this.minimumDuration ? duration : this.minimumDuration ) + 1;

      // Loads the next url few seconds before sliding.
      this.loadUrlTimeout = setTimeout(() => { 
        this.clearSelfTimeOut(this.loadUrlTimeout);
        this.loadNextUrl();
      }, (duration - this.preloadUrlBefore) * 1000);

      // Set duration to next sliding
      this.slideAfterDuration = setTimeout(() => { 
        this.clearSelfTimeOut(this.slideAfterDuration);
        this.slideNext();
      }, duration * 1000);
    }

    loadNextUrl(){
      let nextIndex = (this.presentIndex + 1) % this.carouselUrls?.length;
      this.carouselUrls[nextIndex].safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.carouselUrls[nextIndex]?.url ?? this.blankUrl);
    }

    clearSelfTimeOut(timeOutFn: NodeJS.Timeout){
      if(timeOutFn)
        clearTimeout(timeOutFn);
    }

    constructor(private sanitizer: DomSanitizer) {}
}
