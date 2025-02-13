import { Mock, Stub } from 'moxxi';
import { Subject } from 'rxjs';

import { BarcodeScannerErrorOverlayService } from '../src/barcode-scanner-error-overlay.service';
import { BarcodeScannerConfig } from '../src/barcode-scanner.client-config';

@Mock({ of: BarcodeScannerConfig })
export class BarcodeScannerConfigMock extends BarcodeScannerConfig {
    override whenReady = new Subject<void>();
}

@Mock({ of: BarcodeScannerErrorOverlayService })
export class BarcodeScannerErrorOverlayServiceMock {
    @Stub() showError: jasmine.Spy;
}
