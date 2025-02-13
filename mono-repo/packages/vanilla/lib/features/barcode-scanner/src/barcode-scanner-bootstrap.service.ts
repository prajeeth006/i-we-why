import { Injectable } from '@angular/core';

import { EventsService, Logger, NativeAppService, NativeEvent, NativeEventType, OnFeatureInit } from '@frontend/vanilla/core';
import { filter, map, mergeMap } from 'rxjs/operators';

import { BarcodeScannerErrorOverlayService } from './barcode-scanner-error-overlay.service';
import { BarcodeScannerConfig } from './barcode-scanner.client-config';

@Injectable()
export class BarcodeScannerBootstrapService implements OnFeatureInit {
    constructor(
        private barcodeScannerConfig: BarcodeScannerConfig,
        private barCodeErrorOverlayService: BarcodeScannerErrorOverlayService,
        private nativeAppService: NativeAppService,
        private eventsService: EventsService,
        private logger: Logger,
    ) {}

    private get conditions() {
        return this.barcodeScannerConfig.conditionalEvents?.map((event) => {
            let regex: RegExp;

            try {
                regex = new RegExp(event.value, 'i');
            } catch (e) {
                this.logger.errorRemote(
                    `Failed to compile regex /${event.value}/ because it's not supported on this browser. So it won't be executed for barcode event name "${event.key}".`,
                    e,
                );
                regex = new RegExp('.^');
            }

            return {
                key: event.key,
                regex,
            };
        });
    }

    onFeatureInit() {
        this.barcodeScannerConfig.whenReady
            .pipe(
                map(() => this.conditions),
                mergeMap((conditions) => this.getEvents(conditions)),
            )
            .subscribe((result) => {
                if (result.nativeEvent.eventName.toUpperCase() === NativeEventType.NFC_SCAN_FAILED || !result.conditionKey) {
                    this.barCodeErrorOverlayService.showError(result.nativeEvent.eventName);
                } else {
                    this.eventsService.raise({ eventName: result.conditionKey, data: result.nativeEvent.parameters });
                }
            });
    }

    private getEvents(conditionalEvents: { key: string; regex: RegExp }[]) {
        return this.nativeAppService.eventsFromNative.pipe(
            filter(
                (e: NativeEvent) =>
                    e.eventName?.toUpperCase() === NativeEventType.BARCODESCANNED ||
                    e.eventName?.toUpperCase() === NativeEventType.NFCCARDSCANNED ||
                    e.eventName?.toUpperCase() === NativeEventType.NFC_SCAN_FAILED,
            ),
            map((nativeEvent: NativeEvent) => {
                const parameters = nativeEvent.parameters;
                const code = parameters?.barcode ?? parameters?.nfcString ?? '';
                const event = conditionalEvents?.find((x) => x.regex.test(code));

                return {
                    nativeEvent,
                    conditionKey: event?.key,
                };
            }),
        );
    }
}
