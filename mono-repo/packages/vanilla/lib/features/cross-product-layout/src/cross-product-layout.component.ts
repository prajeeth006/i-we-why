import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { HtmlNode } from '@frontend/vanilla/core';

/**
 * @description Adds standalone css class to html node and displays content with dlg-responsive css class
 *
 * @stable
 */
@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'lh-cross-product-layout',
    templateUrl: 'cross-product-layout.component.html',
})
export class CrossProductLayoutComponent implements OnInit, OnDestroy {
    constructor(private htmlNode: HtmlNode) {}

    ngOnInit(): void {
        this.htmlNode.setCssClass('standalone', true);
    }

    ngOnDestroy(): void {
        this.htmlNode.setCssClass('standalone', false);
    }
}
