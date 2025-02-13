import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { PageMatrixDirective } from '@frontend/vanilla/features/content';

import { DropDownHeaderContent } from '../dropdown-header.client-config';
import { DropDownHeaderService } from '../dropdown-header.service';

/**
 * @stable
 */
@Component({
    standalone: true,
    imports: [CommonModule, PageMatrixDirective],
    selector: 'vn-dropdown-header-products',
    templateUrl: 'dropdown-header-products.html',
    animations: [
        trigger('toggleAnimation', [
            state('0', style({ height: '0px' })),
            transition('1 => 0', animate('.2s ease', style({ height: '0px' }))),
            transition('0 => 1', animate('.2s ease', style({ height: '*' }))),
        ]),
    ],
})
export class DropDownHeaderProductsComponent implements OnInit {
    expanded: boolean = false;

    constructor(
        public content: DropDownHeaderContent,
        private dropDownHeaderService: DropDownHeaderService,
    ) {}

    ngOnInit() {
        this.dropDownHeaderService.dropDownMenuToggle.subscribe((v) => (this.expanded = v));
    }
}
