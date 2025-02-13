import { FocusMonitor } from '@angular/cdk/a11y';
import { NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    ElementRef,
    OnDestroy,
    TemplateRef,
    ViewEncapsulation,
    booleanAttribute,
    inject,
    input,
    signal,
} from '@angular/core';

import { DsTabContext } from './tabs-context';
import { DsTabContent, DsTabHeader } from './tabs.directives';

let _tabNameIndex = 0;
/** Generates a random name for a tab. */
function getRandomName() {
    ++_tabNameIndex; // increment the index for each tab name
    return `tab-${_tabNameIndex}`;
}

// eslint-disable-next-line @nx/workspace-component-tests-present, @nx/workspace-component-default-story
@Component({
    selector: 'ds-tab',
    template: `
        @if (selected() && lazyContent) {
            <ng-container *ngTemplateOutlet="lazyContent" />
        }

        <div [class.ds-tab-content-hidden]="!selected()">
            <ng-content />
        </div>
    `,
    imports: [NgTemplateOutlet],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsTab implements OnDestroy {
    /**
     * The name of the tab. Must be unique within the tab.
     * If not provided, a random name is generated.
     * It will be used as the id of the tab, and can be used to select the tab.
     *
     * NOTE: This is different from the `title` property, which is the text that is displayed in the tab header.
     */
    name = input(getRandomName());

    /**
     * The title of the tab.
     * The title is displayed in the tab header.
     */
    title = input<string>();

    /**
     * Whether the tab is disabled.
     * If the tab is disabled, it cannot be selected.
     */
    disabled = input(false, { transform: booleanAttribute });

    /**
     * `TemplateRef` for the tab header.
     *
     * @example
     * ```html
     * <ds-tab>
     *   <div *dsTabHeader>Tab header</div>
     * </ds-tab>
     * ```
     * or
     * ```html
     * <ds-tab>
     *   <ng-template dsTabHeader>
     * 	  <div>Tab header</div>
     *   </ng-template>
     * </ds-tab>
     * ```
     */
    @ContentChild(DsTabHeader, { read: TemplateRef })
    customHeader?: TemplateRef<DsTabContext> | null = null;

    /**
     * `TemplateRef` for the tab content.
     *
     * @example

     * ```html
     * <ds-tab>
     *   <div *dsTabContent>Tab content</div>
     * </ds-tab>
     * ```
     * or
     * ```html
     * <ds-tab>
     *   <ng-template dsTabContent>
     * 	   <div>Tab content</div>
     *   </ng-template>
     * </ds-tab>
     * ```
     */
    @ContentChild(DsTabContent, { read: TemplateRef }) lazyContent?: TemplateRef<any> | null = null;

    selected = signal(false);

    public focused = signal(false);

    private _focusMonitor = inject(FocusMonitor);
    private _elementRef = inject(ElementRef);

    setFocused(focused: boolean) {
        this.focused.set(focused);
    }

    ngOnDestroy() {
        this._focusMonitor.stopMonitoring(this._elementRef.nativeElement);
    }
}
