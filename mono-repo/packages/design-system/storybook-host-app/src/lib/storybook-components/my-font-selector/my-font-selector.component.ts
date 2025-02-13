import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';

@Component({
    selector: 'ds-my-font-selector',
    template: `
        <div class="font-selector-wrapper">
            <p #textOne class="font-one">{{ title }}</p>
            <p #textTwo class="font-two" [class.overlap]="overlapElement">{{ title }}</p>
        </div>
    `,
    styleUrls: ['./my-font-selector.component.scss'],
    imports: [CommonModule],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsMyFontSelector implements AfterViewInit, OnChanges {
    @Input({ required: true }) title!: string;
    @Input() fontFamilyOne = 'Arial, sans-serif';
    @Input() fontFamilyTwo = 'GT America, sans-serif';
    @Input() fontSize = 48;
    @Input() lineHeight = 1.5;
    @Input() overlapElement = false; // New control for overlapping fonts

    fontFamilyOneHeight = 0;
    fontFamilyTwoHeight = 0;

    @ViewChild('textOne', { static: true }) textOne!: ElementRef<HTMLElement>;
    @ViewChild('textTwo', { static: true }) textTwo!: ElementRef<HTMLElement>;

    constructor(private host: ElementRef) {}

    ngAfterViewInit() {
        // Calculate height after view is initialized
        this.calculateHeights();
    }

    ngOnChanges() {
        this.updateFontFamilies();
        // Recalculate height if font family inputs change
        this.calculateHeights();
    }

    calculateHeights() {
        if (this.textOne.nativeElement && this.textTwo.nativeElement) {
            this.fontFamilyOneHeight = Number(this.textOne.nativeElement.offsetHeight);
            this.fontFamilyTwoHeight = Number(this.textTwo.nativeElement.offsetHeight);
        }
    }

    updateFontFamilies() {
        // Access host element and set CSS variables directly
        const hostEl = this.host.nativeElement as HTMLElement;
        hostEl.style.setProperty('--font-family-one', this.fontFamilyOne);
        hostEl.style.setProperty('--font-family-two', this.fontFamilyTwo);
        hostEl.style.setProperty('--font-size', `${this.fontSize}px`);
        hostEl.style.setProperty('--line-height', this.lineHeight.toString());
    }
}
