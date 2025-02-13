import { DecimalPipe } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { DynamicScriptsServiceMock } from '../../../shared/browser/test/dynamic-scripts-service.mock';
import { AppInfoConfigMock } from '../../src/client-config/test/app-info-config.mock';
import { LocaleBootstrapService } from '../../src/languages/locale-bootstrap.service';
import { DeviceServiceMock } from '../browser/device.mock';
import { PageMock } from '../browsercommon/page.mock';
import { LoggerMock } from './logger.mock';

describe('LocaleBootstrapService', () => {
    let service: LocaleBootstrapService;
    let loggerMock: LoggerMock;
    let page: PageMock;

    function init(locale?: string) {
        loggerMock = MockContext.useMock(LoggerMock);
        page = MockContext.useMock(PageMock);
        MockContext.useMock(DeviceServiceMock);
        MockContext.useMock(AppInfoConfigMock);

        MockContext.useMock(DynamicScriptsServiceMock);

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                LocaleBootstrapService,
                {
                    provide: LOCALE_ID,
                    useValue: locale,
                },
                DecimalPipe,
            ],
        });

        service = TestBed.inject(LocaleBootstrapService);
    }

    describe('onAppInit()', () => {
        it('should load locale', async () => {
            init('de');

            page.useBrowserLanguage = true;
            spyOn(service, 'localeFile').withArgs('de').and.returnValue(Promise.resolve());

            await service.onAppInit();
            const pipe: DecimalPipe = new DecimalPipe('de');
            expect(pipe.transform(100, '0.2-2')).toBe('100,00');
        });

        // TODO: Unstable, maybe fix in the future
        it('should fallback to english and log error in case of invalid culture', async () => {
            init('xx');
            page.useBrowserLanguage = true;
            spyOn(service, 'localeFile').withArgs('xx').and.returnValue(Promise.reject()).withArgs('en').and.returnValue(Promise.resolve());

            await service.onAppInit();
            const pipe: DecimalPipe = new DecimalPipe('en');

            expect(pipe.transform(100, '0.2-2')).toBe('100.00');

            expect(loggerMock.errorRemote).toHaveBeenCalled();
        });

        // TODO: Unstable, maybe fix in the future
        it('should fallback to english and log error in case of empty culture', async () => {
            init('');
            page.useBrowserLanguage = true;
            spyOn(service, 'localeFile').withArgs('').and.returnValue(Promise.reject()).withArgs('en').and.returnValue(Promise.resolve());

            await service.onAppInit();
            const pipe: DecimalPipe = new DecimalPipe('en');
            expect(pipe.transform(100, '0.2-2')).toBe('100.00');

            expect(loggerMock.errorRemote).toHaveBeenCalled();
        });
    });
});
