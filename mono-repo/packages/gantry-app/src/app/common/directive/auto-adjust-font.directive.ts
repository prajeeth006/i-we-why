import { AfterContentChecked, AfterViewInit, Directive, ElementRef, HostListener, OnInit } from '@angular/core';

import { AutoAdjustFont } from '../constants/brands';

@Directive({
    selector: '[autoAdjustFont]',
})
export class AutoAdjustFontDirective implements OnInit, AfterViewInit, AfterContentChecked {
    index: number = 0;
    isFontsloaded = false;
    prevTextLength: number = 0;
    newTextLength: number = 0;
    constructor(private elementRef: ElementRef) {}

    @HostListener('window:resize', ['$event'])
    onResize() {
        const parentElement = this.elementRef.nativeElement;
        const spans = parentElement.querySelectorAll('span');
        for (let i = 0; i < spans.length; i++) {
            const spanElement = spans[i];
            spanElement.removeAttribute('style');
        }
        this.adjustFontSize();
    }

    ngOnInit() {
        document.fonts.ready.then(() => {
            this.isFontsloaded = true;
            this.adjustFontSize();
        });
    }

    ngAfterViewInit() {
        if (this.isFontsloaded) {
            this.adjustFontSize();
        }
    }

    ngAfterContentChecked() {
        const parentElement = this.elementRef.nativeElement;
        const spans = parentElement.querySelectorAll('span');
        if (spans.length === 0) return;
        this.newTextLength = 0;
        for (let i = 0; i < spans.length; i++) {
            const spanElement = spans[i];
            this.newTextLength += spanElement.textContent.trim().length;
        }
        if (this.isFontsloaded) {
            this.adjustFontSize();
        }
    }

    adjustFontSize() {
        if (this.index <= 1 || this.prevTextLength != this.newTextLength) {
            const parentElement = this.elementRef.nativeElement;
            const spans = parentElement.querySelectorAll('span');
            if (spans.length === 0) return;
            let totalWidth = 0;
            // Calculate the total width of all spans
            for (let i = 0; i < spans.length; i++) {
                const spanElement = spans[i];
                spanElement.removeAttribute('style');
                totalWidth += spanElement.offsetWidth;
                this.prevTextLength += spanElement.textContent.trim().length;
            }

            if (spans[0]) {
                this.index += 1;
                const currentFontSize = parseFloat(window.getComputedStyle(parentElement).fontSize);
                let newFontSize = Math.floor(currentFontSize * ((parentElement.offsetWidth - AutoAdjustFont.paddingVertical) / totalWidth));
                const minFontSize = (currentFontSize / 100) * AutoAdjustFont.minimumFontSize;

                newFontSize = newFontSize > minFontSize ? newFontSize : minFontSize;

                if (parentElement.offsetWidth - AutoAdjustFont.paddingVertical <= totalWidth) {
                    if (newFontSize < currentFontSize) {
                        for (let i = 0; i < spans.length; i++) {
                            const spanElement = spans[i];
                            spanElement.style.fontSize = newFontSize + 'px';
                        }
                    }
                }
            }
        }
    }
}
