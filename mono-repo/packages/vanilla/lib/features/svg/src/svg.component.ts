import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

import { ContentImage, WindowEvent } from '@frontend/vanilla/core';

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'vn-svg',
    templateUrl: './svg.component.html',
})
export class SvgComponent implements OnInit {
    @ViewChild('svg') public svg: ElementRef<HTMLElement>;
    @Input() containerClass: string;
    @Input() displayMode = 'svg';
    @Input() image: ContentImage;
    @Input() viewBox: string;
    @Input() defaultAnimation: boolean;
    @Input() customAnimation: string;
    @Input() iconType: string;
    @Input() size: string;
    @Input() cssClass: string;
    @Input() animationClass: string;

    constructor(private httpClient: HttpClient) {}

    ngOnInit() {
        this.httpClient.get(this.image.src, { responseType: 'text' }).subscribe((value) => {
            const doc = new DOMParser().parseFromString(value, 'image/svg+xml');
            const svgImage = doc.getElementsByTagName('svg')[0]!;

            if (svgImage) {
                if (!svgImage.hasAttribute('viewBox') && this.viewBox) {
                    svgImage.setAttribute('viewBox', this.viewBox);
                }

                if (this.displayMode === 'svg-icon') {
                    this.setClass(svgImage);
                    this.setStyle(svgImage);
                }
            }

            this.svg.nativeElement.appendChild(svgImage);
        });
    }

    setClass(svgImage: SVGElement) {
        svgImage.classList.add('th-icon');

        if (this.cssClass) {
            const classes = this.cssClass.split(',');
            classes.forEach((c) => svgImage.classList.add(c.trim()));
        }

        switch (this.iconType) {
            case 'stroke':
                svgImage.classList.add('th-icon--stk');
                if (this.defaultAnimation) {
                    svgImage.classList.add('th-icon-animate-draw');
                }
                break;
            case 'stroke--bold':
                svgImage.classList.add('th-icon-stk', 'th-icon-stk--bold');
                break;
            case 'stroke--thin':
                svgImage.classList.add('th-icon-stk', 'th-icon-stk--thin');
                break;
            case 'filled':
                svgImage.classList.add('th-icon--fill');
                if (this.defaultAnimation) {
                    svgImage.classList.add('th-icon-animate-fill');
                }
                break;
        }

        switch (this.size) {
            case 'big':
                svgImage.classList.add('th-icon--lg');
                break;
            case 'small':
                svgImage.classList.add('th-icon--sm');
                break;
        }
    }

    setStyle(svgImage: SVGElement) {
        if (this.image.height) {
            svgImage.style.setProperty('height', `${this.image.height}px`);
        }

        if (this.image.width) {
            svgImage.style.setProperty('width', `${this.image.width}px`);
        }

        if (this.customAnimation && !this.defaultAnimation) {
            const customStyle = this.customAnimation.split(';');

            customStyle.forEach((s) => {
                const style = s.split(':');

                if (style?.length > 0) {
                    svgImage.style.setProperty(style[0]!.trim(), style[1]!);
                }
            });
        }
    }

    animate() {
        if (this.animationClass) {
            this.svg.nativeElement.classList.add(this.animationClass);
            this.svg.nativeElement.addEventListener(WindowEvent.AnimationEnd, () => this.svg.nativeElement.classList.remove(this.animationClass));
        }
    }
}
