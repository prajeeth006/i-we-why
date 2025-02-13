import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, Input, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { CarouselUrl, UrlState } from '../carousel/models/CarouselUrl';
import { ErrorService } from '../common/services/error.service';

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
                }),
            ),
            state(
                'Step2',
                style({
                    transform: 'translateX(0%)',
                }),
            ),
            state(
                'Step1',
                style({
                    transform: 'translateX(100%)',
                }),
            ),
            transition('Step1 => Step2', animate('0ms ease')),
            transition('Step2 => Step3', animate('0ms 0ms ease')),
            transition('Step3 => Step1', animate('0s ease')),
        ]),
    ],
})
export class SliderComponent {
    private _carouselUrls: CarouselUrl[] = [];
    @Input()
    set carouselUrls(value: CarouselUrl[]) {
        this._carouselUrls = value;

        if (value !== null && value?.length > 1) {
            this._carouselUrls.forEach((carouselUrl) => {
                carouselUrl.state = 'Step1';
            });
            this.slideNext();
        } else if (value !== null && value?.length == 1) {
            this._carouselUrls.forEach((carouselUrl) => {
                carouselUrl.state = 'Step2';
                carouselUrl.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                    carouselUrl?.url ? this.getUrlWithCarouselParameters(carouselUrl?.url, 0) : this.blankUrl,
                );
            });
            this.setURLState(this._carouselUrls[0].url, 0);
            this.setURLErrorState(0);
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
    preloadUrlBefore: number = 8;
    blankUrl: string = 'about:blank';
    presentIndex = -1;

    urlState: UrlState = {
        index: -1,
        showError: false,
        isUrlLoaded: false,
        isTimeOut: false,
        url: '',
    };

    errorMessage$ = this.errorService.errorMessage$;
    slideNext() {
        const previousIndex = this.presentIndex;
        if (this.presentIndex != -1) {
            this.carouselUrls[this.presentIndex].state = 'Step3';

            //Unloads Iframe url after slideing completed.
            this.unloadIframeTtimeOut = setTimeout(() => {
                this.clearSelfTimeOut(this.unloadIframeTtimeOut);
                this.carouselUrls[previousIndex].safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.blankUrl);
            }, 1000);
        } else {
            this.loadNextUrl();
        }

        //Slide the Page.
        this.presentIndex = (this.presentIndex + 1) % this.carouselUrls?.length;
        this.carouselUrls[this.presentIndex].state = 'Step1';
        this.setAnimateStateTimeOut = setTimeout(() => {
            this.clearSelfTimeOut(this.setAnimateStateTimeOut);
            this.carouselUrls[this.presentIndex].state = 'Step2';
            this.setURLErrorState(this.presentIndex);
        });

        let duration = this.carouselUrls[this.presentIndex]?.carouselDuration;
        duration = (duration && duration >= this.minimumDuration ? duration : this.minimumDuration) + 1;

        // Loads the next url few seconds before sliding.
        this.loadUrlTimeout = setTimeout(
            () => {
                this.clearSelfTimeOut(this.loadUrlTimeout);
                console.log('Preloading next URL now');
                this.loadNextUrl();
            },
            (duration - this.preloadUrlBefore) * 1000,
        );

        // Set duration to next sliding
        this.slideAfterDuration = setTimeout(() => {
            this.clearSelfTimeOut(this.slideAfterDuration);
            this.slideNext();
        }, duration * 1000);
    }

    loadNextUrl() {
        const nextIndex = (this.presentIndex + 1) % this.carouselUrls?.length;
        this.setURLState(this._carouselUrls[nextIndex].url, nextIndex);
        this.carouselUrls[nextIndex].safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            this.carouselUrls[nextIndex]?.url ? this.getUrlWithCarouselParameters(this.carouselUrls[nextIndex]?.url, nextIndex) : this.blankUrl,
        );
    }

    clearSelfTimeOut(timeOutFn: NodeJS.Timeout) {
        if (timeOutFn) clearTimeout(timeOutFn);
    }

    constructor(
        private errorService: ErrorService,
        private sanitizer: DomSanitizer,
    ) {}

    getUrlWithCarouselParameters(url: string, index: number) {
        const updatedUrl = new URL(url);
        updatedUrl.searchParams.set('index', index.toString());
        return updatedUrl.toString();
    }

    setURLState(url: string, index: number) {
        this.urlState = {
            index: index,
            isUrlLoaded: false,
            showError: this.urlState.showError,
            isTimeOut: false,
            url: url,
        };
    }

    setURLErrorState(index: number) {
        if (index == this.urlState.index) {
            if (!this.urlState.isUrlLoaded) {
                this.urlState.isTimeOut = true;
                this.errorService.setError('Url not loaded with in time in carousel.' + this.urlState.url);
            } else {
                this.errorService.unSetError();
            }
        }
    }

    @HostListener('window:message', ['$event'])
    onMessage(event: any) {
        if (!!event.data?.url) {
            const urlParams = new URLSearchParams(event.data?.url);
            const indexString = urlParams.get('index');
            const index: number = indexString ? +indexString : -1;
            if (index == this.urlState.index) {
                this.urlState.isUrlLoaded = true;
                if (this.urlState.isTimeOut) {
                    this.errorService.unSetError();
                }
            }
        }
    }
}
