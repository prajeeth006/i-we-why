import { signal } from '@angular/core';

import { Mock, Stub, StubObservable, StubPromise } from 'moxxi';
import { Subject } from 'rxjs';

import { ProductSwitchCoolOffOverlayService } from '../src/product-switch-cool-off-overlay.service';
import { ProductSwitchCoolOffResourceService } from '../src/product-switch-cool-off-resource.service';
import { ProductSwitchCoolOffTrackingService } from '../src/product-switch-cool-off-tracking.service';
import { ProductSwitchCoolOffConfig } from '../src/product-switch-cool-off.client-config';
import { ProductSwitchCoolOffService } from '../src/product-switch-cool-off.service';

@Mock({ of: ProductSwitchCoolOffConfig })
export class ProductSwitchCoolOffConfigMock extends ProductSwitchCoolOffConfig {
    override whenReady = new Subject<void>();
}

@Mock({ of: ProductSwitchCoolOffService })
export class ProductSwitchCoolOffServiceMock {
    shouldShow = signal<boolean>(true);
    shouldWriteLastCoolOffProductOnBootstrap = signal<boolean>(true);
    @Stub() setLastCoolOffProduct: jasmine.Spy;
    @StubPromise() setPlayerArea: jasmine.PromiseSpy;
}

@Mock({ of: ProductSwitchCoolOffOverlayService })
export class ProductSwitchCoolOffOverlayServiceMock {
    @Stub() show: jasmine.Spy;
}

@Mock({ of: ProductSwitchCoolOffTrackingService })
export class ProductSwitchCoolOffTrackingServiceMock {
    @Stub() trackLoad: jasmine.Spy;
    @Stub() trackConfirm: jasmine.Spy;
}

@Mock({ of: ProductSwitchCoolOffResourceService })
export class ProductSwitchCoolOffResourceServiceMock {
    @StubObservable() setPlayerArea: jasmine.ObservableSpy;
}
