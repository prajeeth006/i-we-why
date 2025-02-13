import { ComponentFactoryResolver, Injector } from '@angular/core';

import { Mock, Stub } from 'moxxi';
import { Subject } from 'rxjs';

import { ProductNavigationService } from '../../src/products/product-navigation.service';
import { ProductService } from '../../src/products/product.service';

export interface ProductMetadataMock {
    name?: string;
    apiBaseUrl?: string;
    isEnabled?: boolean;
    isRegistered?: boolean;
    componentFactoryResolver?: ComponentFactoryResolver;
    injector?: Injector;
    isHost?: boolean;
}

@Mock({ of: ProductService })
export class ProductServiceMock {
    isSingleDomainApp: boolean;
    productChanged: Subject<ProductMetadataMock> = new Subject();
    current: ProductMetadataMock = {
        name: 'host',
        apiBaseUrl: '',
        isEnabled: true,
        isRegistered: false,
        isHost: true,
    };
    @Stub() setActive: jasmine.Spy;
    @Stub() getMetadata: jasmine.Spy;
    @Stub() register: jasmine.Spy;
}

@Mock({ of: ProductNavigationService })
export class ProductNavigationServiceMock {
    @Stub() goTo: jasmine.Spy;
}
