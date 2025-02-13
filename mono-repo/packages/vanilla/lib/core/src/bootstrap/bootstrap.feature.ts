import { APP_INITIALIZER, Injector, Provider } from '@angular/core';

import { NativeEventType } from '../native-app/native-app.models';
import { NativeAppService } from '../native-app/native-app.service';
import { ProductService } from '../products/product.service';
import { BootstrapperService } from './bootstrapper.service';

export function appInitializerFactory(
    bootstrapperService: BootstrapperService,
    nativeAppService: NativeAppService,
    productService: ProductService,
    injector: Injector,
) {
    return async () => {
        productService.register('host', injector);

        await bootstrapperService.runAppInit();

        nativeAppService.sendToNative({ eventName: NativeEventType.APPINITIALIZED });
    };
}

export function provideBootstrap(): Provider[] {
    return [
        {
            provide: APP_INITIALIZER,
            multi: true,
            deps: [BootstrapperService, NativeAppService, ProductService, Injector],
            useFactory: appInitializerFactory,
        },
    ];
}
