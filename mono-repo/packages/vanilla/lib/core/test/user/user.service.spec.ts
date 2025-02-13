import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { UserConfig, UserLoginEvent, UserLogoutEvent, UserService, UserServiceCore, UserUpdateEvent } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { ClaimTypeFullName } from '../../src/user/claims.models';
import { LocalStoreServiceMock } from '../browser/local-store.mock';
import { PageMock } from '../browsercommon/page.mock';
import { ClientConfigServiceMock } from '../client-config/client-config.mock';
import { ClaimsServiceMock } from './claims.mock';

describe('UserService', () => {
    let service: UserService;
    let claimsMock: ClaimsServiceMock;
    let pageMock: PageMock;
    let userConfig: UserConfig;
    let clientConfigServiceMock: ClientConfigServiceMock;
    let localStoreServiceMock: LocalStoreServiceMock;
    let observableSpy: jasmine.Spy;

    beforeEach(() => {
        claimsMock = MockContext.useMock(ClaimsServiceMock);
        pageMock = MockContext.useMock(PageMock);
        clientConfigServiceMock = MockContext.useMock(ClientConfigServiceMock);
        localStoreServiceMock = MockContext.useMock(LocalStoreServiceMock);

        userConfig = {
            lang: 'de',
            returning: true,
            loyalty: 'L',
            customerId: 987,
            segmentId: 10,
            lifeCycleStage: 'user-lifeCycleStage',
            eWarningVip: 'no',
            microSegmentId: 912,
            churnRate: 0.156985,
            futureValue: 65.32653,
            potentialVip: 0.46985,
            isAuthenticated: true,
            workflowType: 10,
            loginDuration: 6000,
            playerPriority: '1',
            tierCode: 2,
            isFirstLogin: true,
            lastLoginTimeFormatted: 'llt',
            userTimezoneUtcOffset: 120,
            xsrfToken: 'abc',
            registrationDate: new Date('1984-10-11 13:50:48'),
            daysRegistered: 17,
            visitCount: 3,
            visitAfterDays: 66,
        };

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                { provide: UserConfig, useValue: userConfig },
                UserServiceCore,
                { provide: UserService, useExisting: UserServiceCore },
            ],
        });

        service = TestBed.inject(UserService);
        userConfig = TestBed.inject(UserConfig);

        observableSpy = jasmine.createSpy('observableSpy');
        service.events.subscribe(observableSpy);
    });

    it('should expose some claims as properties', () => {
        claimsMock.get.withArgs(ClaimTypeFullName.BackendUserId).and.returnValue('id_test');
        claimsMock.get.withArgs(ClaimTypeFullName.AccountId).and.returnValue('666666');
        claimsMock.get.withArgs(ClaimTypeFullName.Username).and.returnValue('test');
        claimsMock.get.withArgs(ClaimTypeFullName.Country).and.returnValue('AT');
        claimsMock.get.withArgs(ClaimTypeFullName.GeoCountry).and.returnValue('GB');
        claimsMock.get.withArgs(ClaimTypeFullName.UtcOffset).and.returnValue('-240');
        claimsMock.get.withArgs(ClaimTypeFullName.Currency).and.returnValue('EUR');
        claimsMock.get.withArgs(ClaimTypeFullName.RealPlayer).and.returnValue('True');
        claimsMock.get.withArgs(ClaimTypeFullName.SsoToken).and.returnValue('sso');
        claimsMock.get.withArgs(ClaimTypeFullName.Screenname).and.returnValue('testscreen');
        claimsMock.get.withArgs(ClaimTypeFullName.Title).and.returnValue('title');
        claimsMock.get.withArgs(ClaimTypeFullName.FirstName).and.returnValue('fn');
        claimsMock.get.withArgs(ClaimTypeFullName.LastName).and.returnValue('ln');
        claimsMock.get.withArgs(ClaimTypeFullName.Email).and.returnValue('email@email.com');
        claimsMock.get.withArgs(ClaimTypeFullName.DateOfBirth).and.returnValue('1988-05-01');

        expect(service.id).toBe('id_test');
        expect(service.accountId).toBe('666666');
        expect(service.username).toBe('test');
        expect(service.country).toBe('AT');
        expect(service.geoCountry).toBe('GB');
        expect(service.utcOffset).toBe(-240);
        expect(service.currency).toBe('EUR');
        expect(service.realPlayer).toBeTrue();
        expect(service.ssoToken).toBe('sso');
        expect(service.workflowType).toBe(10);
        expect(service.screenname).toBe('testscreen');
        expect(service.title).toBe('title');
        expect(service.firstName).toBe('fn');
        expect(service.lastName).toBe('ln');
        expect(service.email).toBe('email@email.com');
        expect(service.dateOfBirth).toEqual(new Date('1988-05-01'));
        expect(service.dateOfBirth instanceof Date);
    });

    it('should expose user config properties', () => {
        expect(service.lang).toBe('de');
        expect(service.returning).toBeTrue();
        expect(service.loyalty).toBe('L');
        expect(service.customerId).toBe(987);
        expect(service.segmentId).toBe(10);
        expect(service.lifeCycleStage).toBe('user-lifeCycleStage');
        expect(service.eWarningVip).toBe('no');
        expect(service.microSegmentId).toBe(912);
        expect(service.churnRate).toBe(0.156985);
        expect(service.futureValue).toBe(65.32653);
        expect(service.potentialVip).toBe(0.46985);
        expect(service.playerPriority).toBe('1');
        expect(service.tierCode).toBe(2);
        expect(service.isFirstLogin).toBeTrue();
        expect(service.isAuthenticated).toBeTrue();
        expect(service.loginDuration).toBe(6000);
        expect(service.lastLoginTimeFormatted).toBe('llt');
        expect(service.userTimezoneUtcOffset).toBe(120);
        expect(service.registrationDate).toEqual(new Date('1984-10-11 13:50:48'));
        expect(service.daysRegistered).toBe(17);
    });

    it('should expose claims', () => {
        expect(service.claims).toBe(<any>claimsMock);
    });

    it('should return null if claim is not defined', () => {
        expect(service.username).toBeNull();
    });

    it('should set user properties to underlying config, and emit an event', fakeAsync(() => {
        service.lang = 'en';
        expectPropertyUpdateEvent('lang', 'en');
        service.returning = false;
        expectPropertyUpdateEvent('returning', false);
        service.loyalty = null;
        expectPropertyUpdateEvent('loyalty', null);
        service.isAuthenticated = false;
        expectPropertyUpdateEvent('isAuthenticated', false);
        service.customerId = 345;
        expectPropertyUpdateEvent('customerId', 345);
        service.segmentId = 22;
        expectPropertyUpdateEvent('segmentId', 22);
        service.lifeCycleStage = 'user2-lifeCycleStage';
        expectPropertyUpdateEvent('lifeCycleStage', 'user2-lifeCycleStage');
        service.eWarningVip = 'yes';
        expectPropertyUpdateEvent('eWarningVip', 'yes');
        service.microSegmentId = 512;
        expectPropertyUpdateEvent('microSegmentId', 512);
        service.churnRate = 0.144985;
        expectPropertyUpdateEvent('churnRate', 0.144985);
        service.futureValue = 77.32653;
        expectPropertyUpdateEvent('futureValue', 77.32653);
        service.potentialVip = 0.98785;
        expectPropertyUpdateEvent('potentialVip', 0.98785);
        service.userTimezoneUtcOffset = 240;
        expectPropertyUpdateEvent('userTimezoneUtcOffset', 240);
        service.daysRegistered = 31;
        expectPropertyUpdateEvent('daysRegistered', 31);

        expect(userConfig.lang).toBe('en');
        expect(userConfig.returning).toBeFalse();
        expect(userConfig.loyalty).toBeNull();
        expect(userConfig.customerId).toBe(345);
        expect(userConfig.segmentId).toBe(22);
        expect(userConfig.lifeCycleStage).toBe('user2-lifeCycleStage');
        expect(userConfig.eWarningVip).toBe('yes');
        expect(userConfig.microSegmentId).toBe(512);
        expect(userConfig.churnRate).toBe(0.144985);
        expect(userConfig.futureValue).toBe(77.32653);
        expect(userConfig.potentialVip).toBe(0.98785);
        expect(userConfig.isAuthenticated).toBeFalse();
        expect(userConfig.userTimezoneUtcOffset).toBe(240);
        expect(userConfig.daysRegistered).toBe(31);

        expect(service.lang).toBe('en');
        expect(service.returning).toBeFalse();
        expect(service.loyalty).toBeNull();
        expect(service.customerId).toBe(345);
        expect(service.segmentId).toBe(22);
        expect(service.lifeCycleStage).toBe('user2-lifeCycleStage');
        expect(service.eWarningVip).toBe('yes');
        expect(service.microSegmentId).toBe(512);
        expect(service.churnRate).toBe(0.144985);
        expect(service.futureValue).toBe(77.32653);
        expect(service.potentialVip).toBe(0.98785);
        expect(service.isAuthenticated).toBeFalse();
        expect(service.userTimezoneUtcOffset).toBe(240);
        expect(service.daysRegistered).toBe(31);
    }));

    it('should not allow to set claim properties', () => {
        expect(() => {
            service.username = 'lol';
        }).toThrowError();
    });

    function expectPropertyUpdateEvent(prop: string, value: any) {
        const diff = new Map([[prop, value]]);

        expectUpdateEvent(diff);
    }

    function expectUpdateEvent(diff: Map<string, any>) {
        tick();

        expect(observableSpy).toHaveBeenCalled();
        const event = observableSpy.calls.mostRecent().args[0];

        expect(event instanceof UserUpdateEvent);
        expect((<UserUpdateEvent>event).diff).toEqual(diff);

        observableSpy.calls.reset();
    }

    describe('notify', () => {
        it('should merge diff from claims and user and publish update event', fakeAsync(() => {
            claimsMock.get.withArgs('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name').and.returnValue('name');

            clientConfigServiceMock.updates.next(
                new Map<string, any>([
                    ['vnUser', new Map([['isAuthenticated', false]])],
                    ['vnClaims', new Map([['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name', 'name']])],
                ]),
            );

            expectUpdateEvent(
                new Map<string, any>([
                    ['isAuthenticated', false],
                    ['username', 'name'],
                ]),
            );
        }));
    });

    describe('userEvents', () => {
        it('should set authKey on localStorage to 1 on login event.', () => {
            service.isAuthenticated = false;

            service.triggerEvent(new UserLoginEvent());

            expect(localStoreServiceMock.set).toHaveBeenCalledWith('vn-authState', 1);
        });

        it('should set authKey on localStorage to 0 on logout event', () => {
            service.isAuthenticated = true;

            service.triggerEvent(new UserLogoutEvent());

            expect(localStoreServiceMock.set).toHaveBeenCalledWith('vn-authState', 0);
        });
    });

    describe('triggerEvent', () => {
        it('should emit an event', () => {
            const event = new UserLoginEvent();
            service.triggerEvent(event);

            expect(observableSpy).toHaveBeenCalledWith(event);
        });
    });

    describe('displayName', () => {
        beforeEach(() => {
            pageMock.userDisplayNameProperties = ['screenname', 'firstName'];
        });

        it('should return first user property', () => {
            claimsMock.get.withArgs('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname').and.returnValue('fn');
            claimsMock.get.withArgs('http://api.bwin.com/v3/user/screenname').and.returnValue('testscreen');

            expect(service.displayName).toBe('testscreen');
        });

        it('should return fallback to next property if the first one is not specified', () => {
            claimsMock.get.withArgs('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname').and.returnValue('fn');
            claimsMock.get.withArgs('http://api.bwin.com/v3/user/screenname').and.returnValue('');

            expect(service.displayName).toBe('fn');
        });

        it('should return empty string if no property is specified', () => {
            pageMock.userDisplayNameProperties = [];

            expect(service.displayName).toBe('');
        });
    });
});
