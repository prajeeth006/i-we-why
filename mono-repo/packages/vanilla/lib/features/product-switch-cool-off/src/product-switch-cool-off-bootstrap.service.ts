import { Injectable, inject } from '@angular/core';

import { OnFeatureInit, UserEvent, UserLoginEvent, UserService } from '@frontend/vanilla/core';
import { filter } from 'rxjs/operators';

import { ProductSwitchCoolOffOverlayService } from './product-switch-cool-off-overlay.service';
import { ProductSwitchCoolOffConfig } from './product-switch-cool-off.client-config';
import { ProductSwitchCoolOffService } from './product-switch-cool-off.service';

@Injectable()
export class ProductSwitchCoolOffBootstrapService implements OnFeatureInit {
    private productSwitchCoolOffConfig = inject(ProductSwitchCoolOffConfig);
    private userService = inject(UserService);
    private productSwitchCoolOffService = inject(ProductSwitchCoolOffService);
    private productSwitchCoolOffOverlayService = inject(ProductSwitchCoolOffOverlayService);

    onFeatureInit() {
        this.productSwitchCoolOffConfig.whenReady.subscribe(() => {
            if (this.productSwitchCoolOffService.shouldWriteLastCoolOffProductOnBootstrap()) {
                this.productSwitchCoolOffService.setLastCoolOffProduct();
            }

            if (this.userService.isAuthenticated) {
                this.init();
            } else {
                /* if user logout, change a product and then login again, save a lastCoolOffProduct cookie */
                this.userService.events
                    .pipe(filter((e: UserEvent) => e instanceof UserLoginEvent))
                    .subscribe(() => this.productSwitchCoolOffService.setLastCoolOffProduct());
            }
        });
    }

    private init() {
        if (this.productSwitchCoolOffService.shouldShow()) {
            this.productSwitchCoolOffOverlayService.show();
        }
    }
}
