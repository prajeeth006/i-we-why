import { Provider } from '@angular/core';

import { runOnAppInit } from '../bootstrap/bootstrapper.service';
import { registerDslOnModuleInit } from '../dsl/dsl-values-provider';
import { LastKnownProductBootstrapService } from './last-known-product-bootstrap.service';
import { LastKnownProductDslValuesProvider } from './last-known-product-dsl-values-provider';

export function provideLastKnownProduct(): Provider[] {
    return [registerDslOnModuleInit(LastKnownProductDslValuesProvider), runOnAppInit(LastKnownProductBootstrapService)];
}
