import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';

import { TimerService, WINDOW, WindowEvent } from '@frontend/vanilla/core';

@Directive({
    standalone: true,
    selector: '[vnScrollMenu]',
})
export class NavScrollDirective implements OnInit, OnDestroy {
    @Input() menuTimeOut: number = 0;
    @Input() navBarTopHeight: number;
    @Output() sectionChange = new EventEmitter<string>();
    @Output() scrollStop = new EventEmitter<void>();

    private currentSection: string;
    private timeoutId: NodeJS.Timeout;
    readonly #window = inject(WINDOW);

    constructor(
        private elementRef: ElementRef,
        private timerService: TimerService,
    ) {}

    ngOnInit() {
        this.#window.document.addEventListener(WindowEvent.Scroll, this.scrollEventHandler, false);
    }

    ngOnDestroy() {
        this.#window.document.removeEventListener(WindowEvent.Scroll, this.scrollEventHandler, false);
        this.timerService.clearTimeout(this.timeoutId);
    }

    onScroll() {
        let currentSection: string = '';
        const children = this.elementRef.nativeElement.getElementsByClassName('menu-element');

        for (let i = 0; i < children.length; i++) {
            const element = children[i] as HTMLElement;

            // Default as 114px as it's the value used in css for property --navbar-top-height. If configured on sitecore it must match the value of the css property.
            if (element.getBoundingClientRect().top <= (this.navBarTopHeight || 114)) {
                currentSection = element.id;
            }
        }
        if (currentSection !== this.currentSection) {
            this.currentSection = currentSection;
            this.sectionChange.next(this.currentSection);
        }
    }

    private scrollEventHandler = () => {
        this.onScroll();
        this.timerService.clearTimeout(this.timeoutId);

        this.timeoutId = this.timerService.setTimeout(() => {
            this.currentSection = '';
            this.scrollStop.next();
        }, this.menuTimeOut);
    };
}
