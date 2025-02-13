import { FocusMonitor } from '@angular/cdk/a11y';
import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    ElementRef,
    HostListener,
    Input,
    OnDestroy,
    QueryList,
    ViewEncapsulation,
} from '@angular/core';

@Component({
    selector: 'ds-bottom-nav-tab',
    template: `<ng-content />`,
    standalone: true,
    host: {
        '[class.ds-bottom-nav-item]': 'true',
        '[class.ds-bottom-nav-selected]': 'active',
        '[class.ds-bottom-nav-disabled]': 'disabled',
        '[class.ds-bottom-nav-focused]': 'focused',
        '[attr.role]': '"tab"',
        '[attr.aria-selected]': 'active',
        '[attr.aria-disabled]': 'disabled',
        '[attr.tabindex]': '!disabled ? 0 : -1',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsBottomNavTab {
    @Input() disabled = false;
    @Input() active = false;
    focused = false;

    constructor(
        public elementRef: ElementRef<HTMLElement>,
        private cdr: ChangeDetectorRef,
    ) {}

    focus() {
        this.elementRef.nativeElement.focus();
        this.focused = true;
        this.cdr.markForCheck();
    }

    blur() {
        this.focused = false;
        this.cdr.markForCheck();
    }
}

@Component({
    selector: 'ds-bottom-nav',
    standalone: true,
    host: {
        class: 'ds-bottom-nav',
    },
    template: `
        <div class="ds-bottom-nav-container" role="navigation" aria-label="Bottom navigation">
            <div role="tablist" class="ds-bottom-nav-items">
                <ng-content />
            </div>
        </div>
    `,
    imports: [DsBottomNavTab],
    styleUrls: ['./bottom-nav.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsBottomNav implements AfterContentInit, OnDestroy {
    @ContentChildren(DsBottomNavTab) tabs!: QueryList<DsBottomNavTab>;

    constructor(private _focusMonitor: FocusMonitor) {}

    ngAfterContentInit() {
        this.tabs.forEach((tab) => {
            this._focusMonitor.monitor(tab.elementRef);
        });
    }

    @HostListener('keydown', ['$event'])
    onKeydown(event: KeyboardEvent): void {
        const { key } = event;

        if (key === 'Enter' || key === ' ') {
            let tabsList = this.tabs?.toArray() || [];
            let focusedIndex = tabsList.findIndex((tab) => {
                return tab.elementRef.nativeElement.classList.contains('cdk-focused');
            });

            const focusedTab = tabsList[focusedIndex];
            if (focusedTab && !focusedTab.disabled) {
                tabsList[focusedIndex].elementRef.nativeElement.click();
                event.preventDefault();
            }
        }
    }
    ngOnDestroy() {
        if (this.tabs) {
            this.tabs.forEach((tab) => {
                this._focusMonitor.stopMonitoring(tab.elementRef);
            });
        }
    }
}
