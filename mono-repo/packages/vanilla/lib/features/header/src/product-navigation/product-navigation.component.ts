import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';

import { MenuContentItem, MenuDisplayMode } from '@frontend/vanilla/core';
import { MenuItemComponent } from '@frontend/vanilla/features/menus';
import { PopperContentComponent } from '@frontend/vanilla/features/popper';
import { DslPipe } from '@frontend/vanilla/shared/browser';
import { NgxFloatUiModule, NgxFloatUiPlacements, NgxFloatUiTriggers } from 'ngx-float-ui';

import { DropdownComponent } from '../dropdown/dropdown.component';
import { HeaderItemBase } from '../header-item-base';
import { HeaderConfig } from '../header.client-config';
import { HeaderService } from '../header.service';

@Component({
    standalone: true,
    imports: [DropdownComponent, CommonModule, DslPipe, MenuItemComponent, PopperContentComponent, NgxFloatUiModule],
    selector: 'vn-h-product-navigation',
    templateUrl: 'product-navigation.html',
})
export class ProductNavigationComponent extends HeaderItemBase implements OnInit {
    readonly FloatUiPlacements = NgxFloatUiPlacements;
    readonly FloatUiTriggers = NgxFloatUiTriggers;

    constructor(
        public config: HeaderConfig,
        public headerService: HeaderService,
        private elementRef: ElementRef,
    ) {
        super();
    }

    ngOnInit() {
        this.headerService.highlightedProduct.subscribe((item: MenuContentItem | null) => {
            if (item) {
                const activeElement = this.elementRef.nativeElement.querySelector('.active');

                activeElement?.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        });
    }

    getDisplayMode(displayMode?: string): MenuDisplayMode {
        return displayMode ? (displayMode as MenuDisplayMode) : MenuDisplayMode.Icon;
    }
}
