import { Provider } from '@angular/core';

import { runOnAppInit } from '../bootstrap/bootstrapper.service';
import { DslBootstrapService } from './dsl-bootstrap.service';
import { registerDslOnModuleInit } from './dsl-values-provider';
import { AppDslValuesProvider } from './value-providers/app-dsl-values-provider';
import { AuthenticationDslValuesProvider } from './value-providers/authentication-dsl-values-provider';
import { BrowserDslValuesProvider } from './value-providers/browser-dsl-values-provider';
import { ClaimDslValuesProvider } from './value-providers/claim-dsl-values-provider';
import { CookieDslValuesProvider } from './value-providers/cookie-dsl-values-provider';
import { CounterDslValuesProvider } from './value-providers/counter-dsl-values-provider';
import { CultureDslValuesProvider } from './value-providers/culture-dsl-values-provider';
import { CurrencyDslValuesProvider } from './value-providers/currency-dsl-values-provider';
import { DeviceDslValuesProvider } from './value-providers/device-dsl-values-provider';
import { EpcotDslValuesProvider } from './value-providers/epcot-dsl-values-provider';
import { GeoIpDslValuesProvider } from './value-providers/geo-ip-dsl-values-provider';
import { ListDslValuesProvider } from './value-providers/list-dsl-values-provider';
import { LocationDslValuesProvider } from './value-providers/location-dsl-values-provider';
import { MediaDslValuesProvider } from './value-providers/media-dsl-values-provider';
import { NativeApplicationDslValuesProvider } from './value-providers/native-app-dsl-values-provider';
import { RequestHeadersDslValuesProvider } from './value-providers/request-headers-dsl-values-provider';
import { ShopDslValuesProvider } from './value-providers/shop-dsl-values-provider';
import { TerminalDslValuesProvider } from './value-providers/terminal-dsl-values-provider';
import { DateTimeDslValuesProvider } from './value-providers/time/datetime-dsl-values-provider';
import { TimeDslValuesProvider } from './value-providers/time/time-dsl-values-provider';
import { UserDslValuesProvider } from './value-providers/user-dsl-values-provider';

export function provideDsl(): Provider[] {
    return [
        registerDslOnModuleInit(AppDslValuesProvider),
        registerDslOnModuleInit(AuthenticationDslValuesProvider),
        registerDslOnModuleInit(UserDslValuesProvider),
        registerDslOnModuleInit(ClaimDslValuesProvider),
        registerDslOnModuleInit(LocationDslValuesProvider),
        registerDslOnModuleInit(CookieDslValuesProvider),
        registerDslOnModuleInit(CultureDslValuesProvider),
        registerDslOnModuleInit(ListDslValuesProvider),
        registerDslOnModuleInit(MediaDslValuesProvider),
        registerDslOnModuleInit(DateTimeDslValuesProvider),
        registerDslOnModuleInit(BrowserDslValuesProvider),
        registerDslOnModuleInit(TimeDslValuesProvider),
        registerDslOnModuleInit(CounterDslValuesProvider),
        registerDslOnModuleInit(CurrencyDslValuesProvider),
        registerDslOnModuleInit(NativeApplicationDslValuesProvider),
        registerDslOnModuleInit(DeviceDslValuesProvider),
        registerDslOnModuleInit(GeoIpDslValuesProvider),
        registerDslOnModuleInit(ShopDslValuesProvider),
        registerDslOnModuleInit(TerminalDslValuesProvider),
        registerDslOnModuleInit(EpcotDslValuesProvider),
        registerDslOnModuleInit(RequestHeadersDslValuesProvider),
        runOnAppInit(DslBootstrapService),
    ];
}
