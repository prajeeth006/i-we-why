import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { EventsServiceMock } from '../../../core/src/utils/test/utils.mock';
import { LoggerMock } from '../../../core/test/languages/logger.mock';
import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { BarcodeScannerBootstrapService } from '../src/barcode-scanner-bootstrap.service';
import { BarcodeScannerConfigMock, BarcodeScannerErrorOverlayServiceMock } from './barcode-scanner.mock';

describe('BarcodeScannerBootstrapService', () => {
    let service: BarcodeScannerBootstrapService;
    let barcodeScannerConfigMock: BarcodeScannerConfigMock;
    let barcodeScannerErrorOverlayServiceMock: BarcodeScannerErrorOverlayServiceMock;
    let nativeAppServiceMock: NativeAppServiceMock;
    let eventsServiceMock: EventsServiceMock;
    let loggerMock: LoggerMock;

    beforeEach(() => {
        barcodeScannerConfigMock = MockContext.useMock(BarcodeScannerConfigMock);
        barcodeScannerErrorOverlayServiceMock = MockContext.useMock(BarcodeScannerErrorOverlayServiceMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        eventsServiceMock = MockContext.useMock(EventsServiceMock);
        loggerMock = MockContext.useMock(LoggerMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, BarcodeScannerBootstrapService],
        });
        barcodeScannerConfigMock.conditionalEvents = [
            { key: 'ValueTicket', value: '^V-' },
            { key: 'BetReceipt', value: '^[012]\\w{9}$' },
            { key: 'Card', value: '\\d' },
        ];

        service = TestBed.inject(BarcodeScannerBootstrapService);
    });

    describe('on eventsFromNative', () => {
        describe('not raise event', () => {
            it('when config is empty', () => {
                barcodeScannerConfigMock.conditionalEvents = [];
                service.onFeatureInit();
                barcodeScannerConfigMock.whenReady.next();

                nativeAppServiceMock.eventsFromNative.next({ eventName: 'Scanned', parameters: { barcode: 'acdaaaa', show: true } });

                expect(eventsServiceMock.raise).not.toHaveBeenCalled();
            });

            it('when eventName is not BarcodeScanned or NFCCardScanned', () => {
                service.onFeatureInit();
                barcodeScannerConfigMock.whenReady.next();

                nativeAppServiceMock.eventsFromNative.next({ eventName: 'Scanned', parameters: { barcode: 'acdaaaa', show: true } });

                expect(eventsServiceMock.raise).not.toHaveBeenCalled();
            });

            it('when barcode or nfcString property is missing', () => {
                service.onFeatureInit();
                barcodeScannerConfigMock.whenReady.next();

                nativeAppServiceMock.eventsFromNative.next({ eventName: 'BarcodeScanned' });
                nativeAppServiceMock.eventsFromNative.next({ eventName: 'NFCCardScanned' });

                expect(eventsServiceMock.raise).not.toHaveBeenCalled();
            });

            it('when regex is invalid', () => {
                barcodeScannerConfigMock.conditionalEvents.push({ key: 'IlegalRegex', value: '*+' });
                service.onFeatureInit();
                barcodeScannerConfigMock.whenReady.next();

                nativeAppServiceMock.eventsFromNative.next({ eventName: 'BarcodeScanned', parameters: { barcode: 'ddddd', show: true } });

                expect(eventsServiceMock.raise).not.toHaveBeenCalled();
                expect(loggerMock.errorRemote).toHaveBeenCalled();
                const msg = loggerMock.errorRemote.calls.argsFor(0)[0];
                expect(msg).toContain('*+');
                expect(msg).toContain('"IlegalRegex"');
            });

            it('when there is no match on conditional events', () => {
                service.onFeatureInit();
                barcodeScannerConfigMock.whenReady.next();

                nativeAppServiceMock.eventsFromNative.next({ eventName: 'BarcodeScanned', parameters: { barcode: 'ddddd', show: true } });

                expect(eventsServiceMock.raise).not.toHaveBeenCalled();
                expect(barcodeScannerErrorOverlayServiceMock.showError).toHaveBeenCalled();
            });
        });

        describe('raise event', () => {
            it('when there is match on BarcodeScanned', () => {
                service.onFeatureInit();
                barcodeScannerConfigMock.whenReady.next();

                nativeAppServiceMock.eventsFromNative.next({ eventName: 'BarcodeScanned', parameters: { barcode: 'V-123123', show: true } });

                expect(eventsServiceMock.raise).toHaveBeenCalledWith({ eventName: 'ValueTicket', data: { barcode: 'V-123123', show: true } });
            });

            it('when there is match on NfcCardScanned', () => {
                service.onFeatureInit();
                barcodeScannerConfigMock.whenReady.next();

                nativeAppServiceMock.eventsFromNative.next({ eventName: 'NFCCardScanned', parameters: { nfcString: '123123123123', show: true } });

                expect(eventsServiceMock.raise).toHaveBeenCalledWith({ eventName: 'Card', data: { nfcString: '123123123123', show: true } });
            });
        });
    });
});
