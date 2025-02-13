import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';

import { IconFastCoreService } from '@frontend/vanilla/core';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';
import { firstValueFrom } from 'rxjs';

import { IconFastService } from './icon-fast.service';
import { IconsetConfig } from './icons.client-config';

/**
 * <vn-icon [name]="dynamicName" />
 * @input `name` is required and should be the name of the icon in site core.
 * @input `size` if provided then width and height not required.
 * @input `width` if provided then height is required.
 * @input `height` if provided then width is required.
 * @input `extraClass` if provided as input then it will apply to svg otherwise extraClass witll be taken from sitecore item parameters if available.
 *
 */

@Component({
    standalone: true,
    imports: [FastSvgComponent],
    selector: 'vn-icon',
    template: `@if (width && height) {
            <fast-svg [name]="name" [width]="width" [height]="height" [class]="extraClass"></fast-svg>
        } @else {
            <fast-svg [name]="name" [size]="size" [class]="extraClass"></fast-svg>
        } `,
    styles: ['vn-icon {display: contents;} .fast-svg {margin: 0!important; height: auto; width: auto;}'],
    encapsulation: ViewEncapsulation.None,
})
export class IconCustomComponent implements OnInit, AfterViewInit {
    @Input({ required: true }) name: string;
    @Input() size: string;
    @Input() width: string;
    @Input() height: string;
    @Input() extraClass: string;
    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private iconFastCoreService: IconFastCoreService,
        private iconFastService: IconFastService,
        private iconsConfig: IconsetConfig,
    ) {}

    async ngOnInit(): Promise<void> {
        await firstValueFrom(this.iconsConfig.whenReady);
        this.iconFastCoreService.set(this.iconFastService);

        const hostElement = this.el.nativeElement as HTMLElement;
        if (this.name === undefined) {
            this.name = hostElement.getAttribute('name') || hostElement.getAttribute('text') || 'not defined';
        }

        if (this.size === undefined) {
            const parentSize = <string>hostElement.getAttribute('size') || '21';
            this.size = this.iconFastService.getIconParameter(this.name, 'size') || parentSize;
        }

        if (!this.extraClass) {
            this.extraClass = this.iconFastService.getIconParameter(this.name, 'extraClass') || '';
        }
    }

    ngAfterViewInit(): void {
        const svgElement = this.el.nativeElement.querySelector('svg') as HTMLElement;

        if (svgElement) {
            this.renderer.setAttribute(svgElement, 'role', 'img');

            this.iconsConfig.whenReady.subscribe(() => {
                const fillColor = this.iconFastService.getIconParameter(this.name, 'fillColor');
                if (fillColor) this.renderer.setAttribute(svgElement, 'fill', fillColor);

                const iconTitle = this.iconFastService.getIconParameter(this.name, 'title');
                if (iconTitle) this.renderer.setAttribute(svgElement, 'title', iconTitle);
            });
        }
    }
}
