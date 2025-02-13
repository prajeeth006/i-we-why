import { OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';

import { DynamicHtmlDirective, LastKnownProductConfig, LastKnownProductService, ViewTemplate } from '@frontend/vanilla/core';

import { ProductSwitchCoolOffTrackingService } from './product-switch-cool-off-tracking.service';
import { ProductSwitchCoolOffConfig } from './product-switch-cool-off.client-config';
import { ProductSwitchCoolOffService } from './product-switch-cool-off.service';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, DynamicHtmlDirective, OverlayModule],
    selector: 'vn-product-switch-cool-off',
    templateUrl: 'product-switch-cool-off.html',
})
export class ProductSwitchCoolOffComponent implements OnInit {
    private overlayRef = inject(OverlayRef);
    private productSwitchCoolOffConfig = inject(ProductSwitchCoolOffConfig);
    private productSwitchCoolOffService = inject(ProductSwitchCoolOffService);
    private lastKnownProductConfig = inject(LastKnownProductConfig);
    private productSwitchCoolOffTrackingService = inject(ProductSwitchCoolOffTrackingService);
    private lastKnowProductService = inject(LastKnownProductService);

    content = signal<ViewTemplate>(this.productSwitchCoolOffConfig.content);
    title = computed(() => this.content().title?.replace(/{PRODUCT}/g, this.productName()));
    text = computed(() => this.content().text?.replace(/{PRODUCT}/g, this.productName()));

    private productName = computed(() => this.content().messages?.[this.lastKnownProductConfig.product] ?? '');

    ngOnInit(): void {
        this.productSwitchCoolOffTrackingService.trackLoad(this.lastKnownProductConfig.product, this.lastKnowProductService.get().previous);
    }

    confirm() {
        this.productSwitchCoolOffService.setPlayerArea().finally(() => {
            this.productSwitchCoolOffService.setLastCoolOffProduct();
            this.productSwitchCoolOffTrackingService.trackConfirm(this.lastKnownProductConfig.product, this.lastKnowProductService.get().previous);
            this.overlayRef.detach();
        });
    }
}
