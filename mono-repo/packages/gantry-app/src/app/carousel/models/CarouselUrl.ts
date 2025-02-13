import { SafeResourceUrl } from '@angular/platform-browser';

export class CarouselUrl {
    url: string;
    displayOrder: number;
    carouselDuration: number;
    safeUrl: SafeResourceUrl;
    state: string;
}

export class UrlState {
    index: number;
    url: string;
    showError: boolean;
    isUrlLoaded: boolean;
    isTimeOut: boolean;
}
