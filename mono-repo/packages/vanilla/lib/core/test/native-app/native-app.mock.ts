import { Mock, Stub } from 'moxxi';
import { Subject } from 'rxjs';

import { NativeAppConfig } from '../../src/native-app/native-app.client-config';
import { NativeAppService } from '../../src/native-app/native-app.service';

@Mock({ of: NativeAppService })
export class NativeAppServiceMock {
    isNative: boolean = false;
    isNativeApp: boolean = false;
    isNativeWrapper: boolean = false;
    isNativeWrapperODR: boolean = false;
    isDownloadClient: boolean = false;
    isDownloadClientApp: boolean = false;
    isDownloadClientWrapper: boolean = false;
    isTerminal: boolean = false;
    product: string = 'UNKNOWN';
    context: string = 'default';
    applicationName: string = 'unknown';
    nativeScheme: string = 'bwin://';
    playtechNativeScheme: string = 'htcmd:';
    nativeMode: string;
    htcmdSchemeEnabled: boolean = false;
    @Stub() onReceivedEventFromNative: jasmine.Spy;
    @Stub() sendToNative: jasmine.Spy;
    eventsFromNative = new Subject();
}

@Mock({ of: NativeAppConfig })
export class NativeAppConfigMock extends NativeAppConfig {}
