import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { CookieName, GeolocationPosition, QuerySearchParams, ToastrSchedule, VanillaEventNames } from '@frontend/vanilla/core';
import { LabelSwitcherItem, LabelSwitcherService } from '@frontend/vanilla/features/label-switcher';
import { MockContext } from 'moxxi';
import { of } from 'rxjs';

import { EventsServiceMock } from '../../../core/src/utils/test/utils.mock';
import { AuthServiceMock } from '../../../core/test/auth/auth.mock';
import { CookieServiceMock } from '../../../core/test/browser/cookie.mock';
import { DateTimeServiceMock } from '../../../core/test/browser/datetime.service.mock';
import { PageMock } from '../../../core/test/browsercommon/page.mock';
import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { LoggerMock } from '../../../core/test/languages/logger.mock';
import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { NavigationServiceMock, ParsedUrlMock } from '../../../core/test/navigation/navigation.mock';
import { UrlServiceMock } from '../../../core/test/navigation/url.mock';
import { ToastrQueueServiceMock } from '../../../core/test/toastr/toastr-queue.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { PublicGeolocationServiceMock } from '../../geolocation/test/mocks';
import { LabelSwitcherConfigMock, LabelSwitcherTrackingServiceMock } from './label-switcher.mock';

describe('LabelSwitcherService', () => {
    let service: LabelSwitcherService;
    let labelSwitcherConfigMock: LabelSwitcherConfigMock;
    let pageMock: PageMock;
    let toastrQueueServiceMock: ToastrQueueServiceMock;
    let cookieServiceMock: CookieServiceMock;
    let loggerMock: LoggerMock;
    let geoLocationServiceMock: PublicGeolocationServiceMock;
    let dslServiceMock: DslServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let userServiceMock: UserServiceMock;
    let authServiceMock: AuthServiceMock;
    let urlServiceMock: UrlServiceMock;
    let nativeAppServiceMock: NativeAppServiceMock;
    let labelSwitcherTrackingServiceMock: LabelSwitcherTrackingServiceMock;
    let eventsServiceMock: EventsServiceMock;
    let dateTimeServiceMock: DateTimeServiceMock;

    beforeEach(() => {
        labelSwitcherConfigMock = MockContext.useMock(LabelSwitcherConfigMock);
        pageMock = MockContext.useMock(PageMock);
        toastrQueueServiceMock = MockContext.useMock(ToastrQueueServiceMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        loggerMock = MockContext.useMock(LoggerMock);
        geoLocationServiceMock = MockContext.useMock(PublicGeolocationServiceMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        authServiceMock = MockContext.useMock(AuthServiceMock);
        urlServiceMock = MockContext.useMock(UrlServiceMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        labelSwitcherTrackingServiceMock = MockContext.useMock(LabelSwitcherTrackingServiceMock);
        eventsServiceMock = MockContext.useMock(EventsServiceMock);
        dateTimeServiceMock = MockContext.useMock(DateTimeServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, LabelSwitcherService],
        });

        pageMock.domain = '.bwin.com';
        labelSwitcherConfigMock.resources = {
            messages: {
                Overlay_Ok_Epcot: 'ok',
            },
        };
        dateTimeServiceMock.now.and.callFake(() => new Date(2019, 2, 3, 4, 5, 6, 7));
    });

    function initService() {
        service = TestBed.inject(LabelSwitcherService);
        service.init();
    }

    describe('init()', () => {
        it('should checkForContentErrors and not show toasters', () => {
            labelSwitcherConfigMock.main = <any>{
                children: [],
            };
            initService();

            expect(loggerMock.error).toHaveBeenCalledWith('Current label is not present in label-switcher items!');
            expect(toastrQueueServiceMock.add).toHaveBeenCalledTimes(0);
        });

        it('should showToasters', fakeAsync(() => {
            labelSwitcherConfigMock.showChangeLabelToaster = 'ChangeLabel';
            labelSwitcherConfigMock.isRestrictedAccessCondition = 'RestrictedAccess';
            cookieServiceMock.get.withArgs('vn_ls_Herzegowina').and.returnValue(undefined);
            dslServiceMock.evaluateExpression.withArgs('ChangeLabel').and.returnValue(of(true));
            cookieServiceMock.get.withArgs('showChangeLabelSuccess').and.returnValue('true');
            labelSwitcherConfigMock.main = <any>{
                children: [
                    {
                        name: 'bwin.com',
                        text: 'bwincom',
                        url: 'https://www/bwin.com',
                        parameters: { region: 'Herzegowina' },
                    },
                    {
                        name: 'bwin.be',
                        text: 'bwinbe',
                        url: 'https://www/bwin.be',
                        parameters: { region: 'Belgium' },
                    },
                ],
            };
            initService();

            geoLocationServiceMock.whenReady.next();
            geoLocationServiceMock.positionChanges.next(<GeolocationPosition>{
                mappedLocation: {
                    stateClient: 'Herzegowina',
                },
            });
            tick();

            expect(toastrQueueServiceMock.add).toHaveBeenCalledWith('changelabel', {
                schedule: ToastrSchedule.Immediate,
                placeholders: { state: 'bwincom', originstate: 'bwincom' },
            });
        }));

        it('should showToasters only once when dsl triggers multiple times.', fakeAsync(() => {
            labelSwitcherConfigMock.showChangeLabelToaster = 'ChangeLabel';
            labelSwitcherConfigMock.isRestrictedAccessCondition = 'RestrictedAccess';
            cookieServiceMock.get.withArgs('vn_ls_Herzegowina').and.returnValue(undefined);
            cookieServiceMock.get.withArgs('showChangeLabelSuccess').and.returnValue('true');
            labelSwitcherConfigMock.main = <any>{
                children: [
                    {
                        name: 'bwin.com',
                        text: 'bwincom',
                        url: 'https://www/bwin.com',
                        parameters: { region: 'Herzegowina' },
                    },
                    {
                        name: 'bwin.be',
                        text: 'bwinbe',
                        url: 'https://www/bwin.be',
                        parameters: { region: 'Belgium' },
                    },
                ],
            };
            initService();

            geoLocationServiceMock.whenReady.next();
            geoLocationServiceMock.positionChanges.next(<GeolocationPosition>{
                mappedLocation: {
                    stateClient: 'Herzegowina',
                },
            });
            dslServiceMock.evaluateExpression.next(true);
            tick();

            dslServiceMock.evaluateExpression.next(true);
            tick();

            expect(toastrQueueServiceMock.add).toHaveBeenCalledTimes(1);
        }));

        it('should showToasters only once when dsl evaluated to false before it is evaluated to true', fakeAsync(() => {
            labelSwitcherConfigMock.showChangeLabelToaster = 'ChangeLabel';
            labelSwitcherConfigMock.isRestrictedAccessCondition = 'RestrictedAccess';
            cookieServiceMock.get.withArgs('vn_ls_Herzegowina').and.returnValue(undefined);
            cookieServiceMock.get.withArgs('showChangeLabelSuccess').and.returnValue(false);
            labelSwitcherConfigMock.main = <any>{
                children: [
                    {
                        name: 'bwin.com',
                        text: 'bwincom',
                        url: 'https://www/bwin.com',
                        parameters: { region: 'Herzegowina' },
                    },
                    {
                        name: 'bwin.be',
                        text: 'bwinbe',
                        url: 'https://www/bwin.be',
                        parameters: { region: 'Belgium' },
                    },
                ],
            };
            initService();

            geoLocationServiceMock.whenReady.next();
            geoLocationServiceMock.positionChanges.next(<GeolocationPosition>{
                mappedLocation: {
                    stateClient: 'Herzegowina',
                },
            });
            dslServiceMock.evaluateExpression.next(false);
            tick();

            dslServiceMock.evaluateExpression.next(true);
            tick();

            expect(toastrQueueServiceMock.add).toHaveBeenCalledTimes(1);
        }));

        it('should showToasters when different location', fakeAsync(() => {
            // This value will be false when the user has selected diffrent location.
            labelSwitcherConfigMock.showChangeLabelToaster = 'false';
            dslServiceMock.evaluateExpression.withArgs('false').and.returnValue(of(false));
            cookieServiceMock.get.withArgs('vn_ls_Herzegowina').and.returnValue(undefined);
            cookieServiceMock.get.withArgs('showChangeLabelSuccess').and.returnValue('true');
            labelSwitcherConfigMock.main = <any>{
                children: [
                    {
                        name: 'bwin.com',
                        text: 'bwincom',
                        url: 'https://www/bwin.com',
                        parameters: { region: 'Herzegowina' },
                    },
                    {
                        name: 'bwin.be',
                        text: 'bwinbe',
                        url: 'https://www/bwin.be',
                        parameters: { region: 'Belgium' },
                    },
                ],
            };
            initService();

            geoLocationServiceMock.whenReady.next();
            geoLocationServiceMock.positionChanges.next(<GeolocationPosition>{
                mappedLocation: {
                    stateClient: 'Herzegowina',
                },
            });
            tick();

            geoLocationServiceMock.positionChanges.next(<GeolocationPosition>{});
            tick();

            expect(toastrQueueServiceMock.add).toHaveBeenCalledWith('changelabelsuccess', {
                schedule: ToastrSchedule.Immediate,
                placeholders: { label: 'bwincom' },
            });
        }));

        it('should show toaster only once when positionChanged event sent multiple times with same state', fakeAsync(() => {
            labelSwitcherConfigMock.showChangeLabelToaster = 'ChangeLabel';
            labelSwitcherConfigMock.isRestrictedAccessCondition = 'RestrictedAccess';
            cookieServiceMock.get.withArgs('vn_ls_Herzegowina').and.returnValue(undefined);
            dslServiceMock.evaluateExpression.withArgs('ChangeLabel').and.returnValue(of(true));
            cookieServiceMock.get.withArgs('showChangeLabelSuccess').and.returnValue('true');
            labelSwitcherConfigMock.main = <any>{
                children: [
                    {
                        name: 'bwin.com',
                        text: 'bwincom',
                        url: 'https://www/bwin.com',
                        parameters: { region: 'Herzegowina' },
                    },
                    {
                        name: 'bwin.be',
                        text: 'bwinbe',
                        url: 'https://www/bwin.be',
                        parameters: { region: 'Belgium' },
                    },
                ],
            };
            initService();

            geoLocationServiceMock.whenReady.next();
            geoLocationServiceMock.positionChanges.next(<GeolocationPosition>{
                mappedLocation: {
                    stateClient: 'Herzegowina',
                },
            });
            tick();

            geoLocationServiceMock.positionChanges.next(<GeolocationPosition>{
                mappedLocation: {
                    stateClient: 'Herzegowina',
                },
            });
            tick();

            expect(toastrQueueServiceMock.add).toHaveBeenCalledTimes(1);
        }));

        it('should not show toasters', fakeAsync(() => {
            labelSwitcherConfigMock.showChangeLabelToaster = 'true';
            labelSwitcherConfigMock.main = <any>{
                children: [
                    {
                        name: 'bwin.com',
                        text: 'bwincom',
                        url: 'https://www/bwin.com',
                        parameters: { region: 'Herzegowina' },
                    },
                    {
                        name: 'bwin.be',
                        text: 'bwinbe',
                        url: 'https://www/bwin.be',
                        parameters: { region: 'Belgium' },
                    },
                ],
            };
            initService();

            geoLocationServiceMock.whenReady.next();
            geoLocationServiceMock.positionChanges.next(<GeolocationPosition>{});

            tick();

            expect(toastrQueueServiceMock.add).not.toHaveBeenCalled();
        }));

        it('should save cookie when toastr is closed', fakeAsync(() => {
            labelSwitcherConfigMock.persistStayInState = true;
            labelSwitcherConfigMock.main = <any>{
                children: [],
            };
            initService();

            geoLocationServiceMock.whenReady.next();
            geoLocationServiceMock.positionChanges.next(<GeolocationPosition>{ mappedLocation: { stateClient: 'Bosnia' } });
            eventsServiceMock.newEvents.next({ eventName: VanillaEventNames.ToastrClosed, data: { toastrContent: { name: 'ChangeLabel' } } });

            tick();

            expect(cookieServiceMock.put).toHaveBeenCalledWith('vn_ls_Bosnia', 'Bosnia', { expires: new Date(2019, 2, 3, 23, 59, 59, 999) });
        }));
    });

    describe('switchLabel', () => {
        let parsedUrlMock: ParsedUrlMock;
        const item = {
            name: 'bwin.com',
            text: 'bwincom',
            url: 'https://www/bwin.com',
            country: 'US',
            regionCode: 'NJ',
            region: 'new',
        } as LabelSwitcherItem;

        beforeEach(() => {
            parsedUrlMock = new ParsedUrlMock();
            parsedUrlMock.search = new QuerySearchParams('');
            parsedUrlMock.hostname = 'https://host.com';
            urlServiceMock.parse.withArgs('https://www/bwin.com').and.callFake(() => parsedUrlMock);
            nativeAppServiceMock.isNative = false;
            labelSwitcherConfigMock.main = <any>{
                children: [
                    {
                        name: 'bwin.com',
                        text: 'bwincom',
                        url: 'https://www/bwin.com',
                        parameters: { region: 'Herzegowina' },
                    },
                    {
                        name: 'bwin.be',
                        text: 'bwinbe',
                        url: 'https://www/bwin.be',
                        parameters: { region: 'Belgium' },
                    },
                ],
            };
        });

        it('should redirect when user is not authenticated', fakeAsync(() => {
            userServiceMock.isAuthenticated = false;
            initService();

            service.switchLabel(item);

            tick();

            expect(nativeAppServiceMock.sendToNative).not.toHaveBeenCalled();
            expect(labelSwitcherTrackingServiceMock.trackConfirmationOverlay).toHaveBeenCalledWith('click', 'bwincom, bwincom', 'ok');
        }));

        it('should logout and redirect when user is authenticated', fakeAsync(() => {
            initService();
            service.switchLabel(item);

            expect(authServiceMock.logout).toHaveBeenCalledWith({ redirectAfterLogout: false });

            authServiceMock.logout.resolve();
            tick();

            expect(nativeAppServiceMock.sendToNative).not.toHaveBeenCalled();
            verifyGoToCall(parsedUrlMock);
        }));

        it('should send native event when isNative', fakeAsync(() => {
            nativeAppServiceMock.isNative = true;
            initService();
            service.switchLabel(item);

            expect(authServiceMock.logout).toHaveBeenCalledWith({ redirectAfterLogout: false });

            authServiceMock.logout.resolve();
            tick();

            verifyNativeEvent();
            expect(navigationServiceMock.goTo).not.toHaveBeenCalled();
        }));
    });

    function verifyNativeEvent() {
        expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledWith({
            eventName: 'Location',
            parameters: {
                label: 'bwin.com',
                countryCode: 'US',
                stateCode: 'NJ',
                state: 'new',
                url: 'https://www/bwin.com',
            },
        });
    }

    function verifyGoToCall(parsedUrlMock: ParsedUrlMock) {
        expect(cookieServiceMock.put).toHaveBeenCalledWith(CookieName.StateChanged, '1');
        expect(navigationServiceMock.goTo).toHaveBeenCalledWith(parsedUrlMock);
        expect(parsedUrlMock.search.get('_showChangeLabelSuccess')).toBe('true');
    }
});
