import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { CommonMessages } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { NgxFloatUiContentComponent, NgxFloatUiModule } from 'ngx-float-ui';

/**
 * @whatItDoes Provides wrapper around `ngx-float-ui` component and adds a close link.
 *
 * @howToUse
 *
 * ```
 * <vn-icon name="theme-info-i" [floatUi]="popper.content" />
 * <vn-popper-content #popper>
 *     <p>text</p>
 * </vn-popper-content>
 * ```
 *
 * @description
 *
 * This component is meant to be used in conjunction with [ngx-float-ui](https://github.com/tonysamperi/ngx-float-ui) library.
 * It adds a close link to the bottom of the popout.
 *
 * @stable
 */
@Component({
    standalone: true,
    imports: [CommonModule, NgxFloatUiModule, IconCustomComponent],
    selector: 'vn-popper-content',
    templateUrl: 'popper-content.html',
})
export class PopperContentComponent {
    /**
     * Type of close for the popout (default: `link`). `Button` as `X` on right upper corner, `link` as clicable text below the content and `none` not to have close.
     */
    @Input() closeType: 'button' | 'link' | 'none' = 'link';
    /**
     * Text of the close link (default: `CommonMessages['GotIt']`).
     */
    @Input() closeLinkText: string;
    /**
     * A css class to apply to `float-ui-content` element to control the color scheme.
     *
     * Options: `tooltip-primary` | `tooltip-secondary` | `tooltip-success` | `tooltip-warning` | `tooltip-danger` | `tooltip-info` | `tooltip-light`
     */
    @Input() cssClass: string;
    /**
     * A css class name to apply for text content from TooltipTextCss resource key
     *
     *
     */
    @Input() cssTextClass: string;

    /**
     * An event that is fired when the close link is clicked.
     */
    @Output() onCloseLinkClick = new EventEmitter<boolean | undefined>();

    /**
     * Reference to the `float-ui-content` directive.
     */
    @ViewChild(NgxFloatUiContentComponent, { static: true }) content: NgxFloatUiContentComponent;

    constructor(public commonMessages: CommonMessages) {}

    close(autoClose: boolean = false) {
        this.content.hide();
        this.onCloseLinkClick.next(autoClose);
    }
}
