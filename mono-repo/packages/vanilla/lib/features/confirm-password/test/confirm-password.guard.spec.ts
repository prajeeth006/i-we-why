import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { ToastrSchedule } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';
import { of } from 'rxjs';

import { RememberMeServiceMock } from '../../../core/test/login/remember-me/remember-me.service.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { ToastrQueueServiceMock } from '../../../core/test/toastr/toastr-queue.mock';
import { confirmPasswordGuard } from '../src/confirm-password.guard';
import { ConfirmPasswordConfigMock } from './confirm-password-config.mock';
import { ConfirmPasswordResourceServiceMock } from './confirm-password.mock';

describe('ConfirmPasswordGuard', () => {
    let confirmPasswordConfigMock: ConfirmPasswordConfigMock;
    let navigationServiceMock: NavigationServiceMock;
    let rememberMeServiceMock: RememberMeServiceMock;
    let toastrQueueServiceMock: ToastrQueueServiceMock;
    let confirmPasswordResourceConfigMock: ConfirmPasswordResourceServiceMock;
    let spy: jasmine.Spy;

    beforeEach(() => {
        confirmPasswordConfigMock = MockContext.useMock(ConfirmPasswordConfigMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        rememberMeServiceMock = MockContext.useMock(RememberMeServiceMock);
        toastrQueueServiceMock = MockContext.useMock(ToastrQueueServiceMock);
        confirmPasswordResourceConfigMock = MockContext.useMock(ConfirmPasswordResourceServiceMock);
        spy = jasmine.createSpy();

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
        });

        confirmPasswordConfigMock.isEnabled = true;
        confirmPasswordConfigMock.redirectUrl = 'http://mobile.com';
        rememberMeServiceMock.tokenExists.and.returnValue(true);
    });

    function runGuard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return TestBed.runInInjectionContext(() => {
            return confirmPasswordGuard(route, state);
        });
    }

    describe('canActivate', () => {
        it('should return true if config is disabled', fakeAsync(() => {
            confirmPasswordConfigMock.isEnabled = false;
            runGuard(<any>null, <any>null).then(spy);
            confirmPasswordConfigMock.whenReady.next();
            tick();

            expect(spy).toHaveBeenCalledWith(true);
        }));

        it('should return true if remember me token do not exist', fakeAsync(() => {
            rememberMeServiceMock.tokenExists.and.returnValue(false);
            runGuard(<any>null, <any>null).then(spy);
            confirmPasswordConfigMock.whenReady.next();
            tick();

            expect(spy).toHaveBeenCalledWith(true);
        }));

        it('should return false if password validation is required', fakeAsync(() => {
            confirmPasswordResourceConfigMock.isPasswordValidationRequired.and.returnValue(of(true));
            runGuard(<any>null, <any>{ url: 'portal/test', root: null }).then(spy);
            confirmPasswordConfigMock.whenReady.next();
            tick();

            expect(spy).toHaveBeenCalledWith(false);
            expect(navigationServiceMock.goTo).toHaveBeenCalledWith('http://mobile.com', { appendReferrer: 'portal/test' });
        }));

        it('should return true if password validation is not required', fakeAsync(() => {
            runGuard(<any>null, <any>{ url: 'portal/test', root: null }).then(spy);
            confirmPasswordConfigMock.whenReady.next();
            tick();
            confirmPasswordResourceConfigMock.isPasswordValidationRequired.resolve(false);
            tick();

            expect(spy).toHaveBeenCalledWith(true);
        }));

        it('should return false if pos api call failed with errorCode', fakeAsync(() => {
            runGuard(<any>null, <any>{ url: 'portal/test', root: null }).then(spy);
            confirmPasswordConfigMock.whenReady.next();
            tick();
            confirmPasswordResourceConfigMock.isPasswordValidationRequired.reject({ errorCode: 100 });
            tick();

            expect(spy).toHaveBeenCalledWith(false);
            expect(navigationServiceMock.goToLastKnownProduct).toHaveBeenCalled();
            expect(toastrQueueServiceMock.add).toHaveBeenCalledWith('confirmpassworderror100', { schedule: ToastrSchedule.AfterNextNavigation });
        }));

        it('should return false if pos api call failed without errorCode', fakeAsync(() => {
            runGuard(<any>null, <any>{ url: 'portal/test', root: null }).then(spy);
            confirmPasswordConfigMock.whenReady.next();
            tick();
            confirmPasswordResourceConfigMock.isPasswordValidationRequired.reject('');
            tick();

            expect(spy).toHaveBeenCalledWith(false);
            expect(navigationServiceMock.goToLastKnownProduct).toHaveBeenCalled();
            expect(toastrQueueServiceMock.add).toHaveBeenCalledWith('confirmpassworderror', { schedule: ToastrSchedule.AfterNextNavigation });
        }));
    });
});
