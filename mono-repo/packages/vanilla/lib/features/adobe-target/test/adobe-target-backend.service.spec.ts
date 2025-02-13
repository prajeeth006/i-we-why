import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { AdobeTargetBackendService } from '../src/adobe-target-backend.service';
import { AdobeTargetBaseOptions } from '../src/adobe-target.models';
import { AdobeTargetConfigMock } from './adobe-target.mock';

describe('AdobeTargetBackendService', () => {
    let service: AdobeTargetBackendService;
    let adobeTargetConfig: AdobeTargetConfigMock;
    let windowMock: WindowMock;
    let navigationServiceMock: NavigationServiceMock;
    let currentWindow: any;
    let spy: jasmine.Spy;
    let errorSpy: jasmine.Spy;

    beforeEach(() => {
        adobeTargetConfig = MockContext.useMock(AdobeTargetConfigMock);
        windowMock = new WindowMock();
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                AdobeTargetBackendService,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });
    });

    beforeEach(() => {
        navigationServiceMock.location.hostname = 'www.bwin.com';
        adobeTargetConfig.token = 'token';
        currentWindow = <any>windowMock;
        const adobeTarget = {
            adobe: {
                target: {
                    getOffer: (opts: AdobeTargetBaseOptions) => {
                        if (opts.mbox === 'success') {
                            opts.success(['offer1']);
                        } else if (opts.mbox === 'empty') {
                            opts.success([]);
                        } else {
                            opts.error({}, 'Target Error');
                        }
                    },
                },
            },
        };
        Object.assign(currentWindow, adobeTarget);
        service = TestBed.inject(AdobeTargetBackendService);
        adobeTargetConfig.whenReady.next();
        spy = jasmine.createSpy();
        errorSpy = jasmine.createSpy();
    });

    it('should init window', () => {
        expect(service.getOffer).toBeDefined();
        expect(currentWindow.targetGlobalSettings).toEqual({ cookieDomain: 'www.bwin.com' });
        expect(currentWindow.targetPageParams()).toEqual({ at_property: 'token' });
    });

    describe('getOffer()', () => {
        describe('initScript fails', () => {
            beforeEach(() => {
                spyOn(service, 'initScript').and.returnValue(Promise.reject('WAIT'));
            });

            it('should propagate same error', fakeAsync(() => {
                service.getOffer({}).subscribe({ next: spy, error: errorSpy });
                tick();
                expect(spy).not.toHaveBeenCalled();
                expect(errorSpy).toHaveBeenCalledWith('WAIT');
            }));
        });

        describe('initScript success', () => {
            beforeEach(() => {
                spyOn(service, 'initScript').and.returnValue(Promise.resolve({}));
            });

            it('should return offer', fakeAsync(() => {
                service.getOffer({ mbox: 'success' }).subscribe({ next: spy, error: errorSpy });
                tick();
                expect(errorSpy).not.toHaveBeenCalled();
                expect(spy).toHaveBeenCalledWith({ offer: ['offer1'] });
            }));

            const errorScenarios: Record<string, {}> = {
                'Empty offer.': { mbox: 'empty' },
                'Mbox parameter not specified.': {},
                'Target Error': { mbox: 'whatever' },
            };
            Object.keys(errorScenarios).forEach((key: string) => {
                it(
                    key,
                    fakeAsync(() => {
                        service.getOffer(errorScenarios[key] || {}).subscribe({ next: spy, error: errorSpy });
                        tick();
                        expect(spy).not.toHaveBeenCalled();
                        expect(errorSpy).toHaveBeenCalledWith(key);
                    }),
                );
            });
        });
    });
});
