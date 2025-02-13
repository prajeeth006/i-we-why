import { Directive, ElementRef, HostListener, Input, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { ImageStatus } from '../../horse-racing/models/fallback-src.constant';
import { DefaultImageService } from '../services/default-image.service';
import { Log, LogType, LoggerService } from '../services/logger.service';

@Directive({
    selector: '[retrySrc]',
})
export class RetrySrcDirective implements OnDestroy {
    private _timer: any;
    private defaultImage: string;
    private actualImage: string;
    private isDefaultImageExists: boolean = false;
    defaultImgSubscription: Subscription;

    @Input() hasFallback = 'false';
    @Input() fallbackImage?: string;

    @Input()
    set retrySrc(value: string) {
        this.actualImage = value;
        this.clearTimer();
        if (this.actualImage) {
            if (this.actualImage === ImageStatus.Default) {
                // we still didn't get image from racing content
            } else if (this.actualImage === ImageStatus.ImageNotPresent) {
                if (this.hasFallback === 'true') {
                    if (this.defaultImage) {
                        this.element.nativeElement.src = this.defaultImage;
                    } else {
                        this.setDefaultImage();
                    }
                }
            } else {
                this.element.nativeElement.src = this.actualImage;
            }
        }
    }

    constructor(
        private element: ElementRef<HTMLImageElement>,
        private loggerService: LoggerService,
        private defaultImageService: DefaultImageService,
    ) {}

    @HostListener('error', ['$event'])
    loadError(event: Event) {
        this.clearTimer();
        const img = (event.target as HTMLImageElement)?.src;
        this.log('Loading Image Failed : ' + img, LogType.Error, 'ImageloadingFailed', true);
        if (this.hasFallback === 'true') {
            if (!!this.defaultImage && img !== this.defaultImage) {
                this.element.nativeElement.src = this.defaultImage;
            } else {
                if (!this.isDefaultImageExists) {
                    this.setDefaultImage();
                    this.isDefaultImageExists = true;
                }
            }
        }
        this.retryWithActualImage();
    }

    setDefaultImage() {
        if (this.fallbackImage) {
            this.defaultImage = this.fallbackImage;
            if (this.defaultImage) {
                this.element.nativeElement.src = this.defaultImage;
            }
        } else {
            const imagePath = '/Gantry/GantryWeb/HorseRacingContent/DarkThemeManualHorseRacingImage';
            this.defaultImgSubscription = this.defaultImageService.getDefaultImage(imagePath).subscribe((brandImageData) => {
                this.defaultImage = brandImageData?.brandImage?.src;
                if (this.defaultImage) {
                    this.element.nativeElement.src = this.defaultImage;
                }
            });
        }
    }

    retryWithActualImage() {
        this._timer = setTimeout(() => {
            if (!!this.actualImage && this.actualImage !== ImageStatus.Default && this.actualImage !== ImageStatus.ImageNotPresent) {
                this.element.nativeElement.src = this.actualImage;
            }
        }, 30000);
    }

    ngOnDestroy() {
        this.clearTimer();
        if (this.defaultImgSubscription) {
            this.defaultImgSubscription.unsubscribe();
        }
    }

    clearTimer() {
        if (this._timer) {
            clearTimeout(this._timer);
            delete this._timer;
        }
    }

    log(message: string, level: LogType = LogType.Error, status: string, fatal: boolean = false) {
        const log: Log = {
            level: level,
            message: `${message}`,
            status: status,
            fatal: fatal,
        };
        this.loggerService.log(log);
    }
}
