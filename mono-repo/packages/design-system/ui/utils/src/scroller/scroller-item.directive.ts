import { Directive, ElementRef, Input, booleanAttribute, inject } from '@angular/core';

@Directive({
    selector: '[dsScrollerItem]',
    standalone: true,
    host: {
        'class': 'ds-scroll-item',
        '[style.display]': "'inline-block'",
        '[style.scroll-snap-align]': 'scrollSnapAlign',
        '[style.scroll-snap-stop]': 'scrollSnapStop',
    },
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class DsScrollerItem {
    elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    // they serve the same purpose to check the selected item or active item
    @Input({ transform: booleanAttribute }) active = false;
    @Input({ transform: booleanAttribute }) selected = false;

    @Input() scrollSnapAlign: 'start' | 'center' | 'end' = 'start';

    @Input() scrollSnapStop: 'normal' | 'always' = 'normal';

    isActive() {
        return this.active || this.selected;
    }
}
