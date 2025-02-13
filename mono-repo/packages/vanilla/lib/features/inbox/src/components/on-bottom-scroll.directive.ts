import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
    selector: '[lhOnBottomScroll]',
    standalone: true,
})
export class OnBottomScrollDirective {
    @Output() lhOnBottomScroll: EventEmitter<any> = new EventEmitter();
    @Input() elementsNumberBottomPadding: number;
    private scrollToHeight: number = 0;

    @HostListener('scroll', ['$event'])
    hostScrolled(event: Event) {
        const element = event.target as HTMLElement;
        this.scrollToHeight = this.getScrollToHeight(this.scrollToHeight, element.offsetHeight);
        if (element.scrollTop === element.scrollHeight - element.offsetHeight) {
            this.lhOnBottomScroll.emit();
        }
    }

    private getScrollToHeight(scrollToHeight: number, offsetHeight: number) {
        if (!scrollToHeight) {
            return this.elementsNumberBottomPadding ? offsetHeight * this.elementsNumberBottomPadding : offsetHeight;
        }
        return scrollToHeight;
    }
}
