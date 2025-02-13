import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { ContentItem } from '@frontend/vanilla/core';
import { HtmlAttrsDirective } from '@frontend/vanilla/shared/browser';

/**
 * @whatItDoes Renders generic header for a PC Component.
 *
 * @stable
 */
@Component({
    standalone: true,
    imports: [CommonModule, HtmlAttrsDirective],
    selector: 'vn-pc-component-header-v2',
    templateUrl: 'pc-component-header.html',
    host: {
        '[class.pc-header]': 'true',
    },
})
export class PCComponentHeaderV2Component implements OnInit {
    @Input() item: ContentItem;

    title: string | undefined;
    titleClass: string | undefined;
    tag: string;

    ngOnInit() {
        this.title = this.item.title;

        if (!this.title && this.item.titleLink) {
            this.title = this.item.titleLink.text;
        }

        this.tag = 'h3';

        if (this.item.parameters) {
            const tag = this.item.parameters['title-tag'];
            if (tag && /^h[1-6]$/.test(tag)) {
                this.tag = tag;
            }

            this.titleClass = this.item.parameters['title-class'];
        }
    }
}
