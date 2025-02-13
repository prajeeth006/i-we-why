import { TestBed } from '@angular/core/testing';

import { LoginStoreService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { CookieServiceMock } from '../browser/cookie.mock';

describe('LoginStoreService', () => {
    let service: LoginStoreService;
    let cookieServiceMock: CookieServiceMock;

    beforeEach(() => {
        cookieServiceMock = MockContext.useMock(CookieServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, LoginStoreService],
        });

        service = TestBed.inject(LoginStoreService);
    });

    describe('LastVisitor', () => {
        it('get', () => {
            service.LastVisitor; // act

            expect(cookieServiceMock.get).toHaveBeenCalledWith(getKey('LastVisitor'));
        });

        it('set', () => {
            const oneYearInTheFuture = new Date().getFullYear() + 1;
            service.LastVisitor = 'lastUser'; // act

            expect(cookieServiceMock.put).toHaveBeenCalledWith(getKey('LastVisitor'), '"lastUser"', { expires: jasmine.any(Date) });

            const cookieOptions = cookieServiceMock.put.calls.mostRecent().args[2] as { expires: Date };
            expect(cookieOptions.expires.getFullYear()).toBe(oneYearInTheFuture);
        });
    });

    describe('LastAttemptedVisitor', () => {
        it('get', () => {
            service.LastAttemptedVisitor; // act

            expect(cookieServiceMock.get).toHaveBeenCalledWith(getKey('LastAttemptedVisitor'));
        });

        it('set', () => {
            service.LastAttemptedVisitor = 'lastAttemptedUser'; // act

            expect(cookieServiceMock.put).toHaveBeenCalledWith(getKey('LastAttemptedVisitor'), '"lastAttemptedUser"', undefined);
        });
    });

    describe('LoginType', () => {
        it('get', () => {
            service.LoginType; // act

            expect(cookieServiceMock.get).toHaveBeenCalledWith(getKey('LoginType'));
        });

        it('set', () => {
            service.LoginType = 'LoginType'; // act

            expect(cookieServiceMock.put).toHaveBeenCalledWith(getKey('LoginType'), '"LoginType"', undefined);
        });
    });

    describe('PostLoginValues', () => {
        it('get', () => {
            service.PostLoginValues; // act

            expect(cookieServiceMock.get).toHaveBeenCalledWith(getKey('PostLoginValues'));
        });

        it('set', () => {
            const postLoginValues = {
                workflow: 5,
            };
            service.PostLoginValues = postLoginValues; // act

            expect(cookieServiceMock.put).toHaveBeenCalledWith(getKey('PostLoginValues'), '{"workflow":5}', undefined);
        });
    });

    describe('ReturnUrlFromLogin', () => {
        it('get', () => {
            service.ReturnUrlFromLogin; // act

            expect(cookieServiceMock.get).toHaveBeenCalledWith(getKey('ReturnUrlFromLogin'));
        });

        it('set', () => {
            service.ReturnUrlFromLogin = 'http://testurl.com'; // act

            expect(cookieServiceMock.put).toHaveBeenCalledWith(getKey('ReturnUrlFromLogin'), '"http://testurl.com"', undefined);
        });
    });

    describe('SelectedTab', () => {
        it('get', () => {
            service.SelectedTab; // act

            expect(cookieServiceMock.get).toHaveBeenCalledWith(getKey('SelectedTab'));
        });

        it('set', () => {
            const tenYearsInTheFuture = new Date().getFullYear() + 10;
            service.SelectedTab = 'userTab'; // act

            expect(cookieServiceMock.put).toHaveBeenCalledWith(getKey('SelectedTab'), '"userTab"', { expires: jasmine.any(Date) });

            const cookieOptions = cookieServiceMock.put.calls.mostRecent().args[2] as { expires: Date };
            expect(cookieOptions.expires.getFullYear()).toBe(tenYearsInTheFuture);
        });
    });

    function getKey(name: string) {
        return `mobileLogin.${name}`;
    }
});
