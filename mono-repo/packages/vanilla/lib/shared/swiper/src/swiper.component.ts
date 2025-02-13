import { NgClass } from '@angular/common';
import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild, effect, inject, input } from '@angular/core';

import { RxStrategyProvider } from '@rx-angular/cdk/render-strategies';
import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { SwiperModule, SwiperOptions } from 'swiper/types';
import { NavigationOptions } from 'swiper/types/modules/navigation';
import { PaginationOptions } from 'swiper/types/modules/pagination';

@Component({
    standalone: true,
    selector: 'vn-swiper',
    templateUrl: 'swiper.html',
    imports: [NgClass],
})
export class SwiperComponent implements AfterViewInit, OnDestroy {
    private ngZone = inject(NgZone);
    private strategy = inject(RxStrategyProvider);

    @ViewChild('swiperContainer') swiperRef: ElementRef;

    private readonly defaultOptions: SwiperOptions = {
        modules: [],
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            clickable: true,
            el: '.swiper-pagination',
            type: 'bullets',
        },
    };

    showPagination = input<boolean>(true);
    swiperOptions = input<SwiperOptions, SwiperOptions>(this.defaultOptions, {
        transform: (options) => this.sanitizeOptions(options),
    });
    swiperClass = input<string | string[], string | string[] | undefined>('', {
        transform: (value) => (Array.isArray(value) ? value.filter((v: string) => v !== undefined) : value || ''),
    });

    ngAfterViewInit() {
        this.ngZone.runOutsideAngular(() => {
            this.swiper = new Swiper(this.swiperRef.nativeElement, this.swiperOptions());
        });
    }

    constructor() {
        effect(() => {
            const options = this.swiperOptions();
            if (this.swiper) {
                this.swiper.params = this.syncedSwiperParams(options, this.swiper.params);
            }
        });
    }

    swiper: Swiper;

    private sanitizeOptions(options: SwiperOptions): SwiperOptions {
        const extendedModules: SwiperModule[] = [];

        if (options.navigation === true) {
            options.navigation = <NavigationOptions>this.defaultOptions.navigation;
            extendedModules.push(Navigation);
        }

        if (options.pagination === true) {
            options.pagination = <PaginationOptions>this.defaultOptions.pagination;
            extendedModules.push(Pagination);
        }

        if (options.autoplay === true) {
            extendedModules.push(Autoplay);
        }

        options.modules = [...new Set([...(options.modules || []), ...(extendedModules || [])])];

        return options;
    }

    private syncedSwiperParams(updatedOptions: SwiperOptions, params: SwiperOptions): SwiperOptions {
        return Object.entries(updatedOptions).reduce(
            (acc, [key, value]) => {
                const paramKey = key as keyof SwiperOptions;
                const param = params[paramKey];
                const isObjParam = typeof value === 'object' && typeof param === 'object';
                return { ...acc, [paramKey]: isObjParam ? { ...param, ...value } : value };
            },
            { ...params },
        );
    }

    ngOnDestroy() {
        this.strategy.schedule(() => this.swiper.destroy(false, false)).subscribe();
    }
}
