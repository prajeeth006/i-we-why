import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ToastrQueueCurrentToastContext, WorkerType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';
import { Observable } from 'rxjs';

import { AuthServiceMock } from '../../../core/test/auth/auth.mock';
import { LoginService2Mock } from '../../../core/test/login/login-service.mock';
import { ToastrQueueServiceMock } from '../../../core/test/toastr/toastr-queue.mock';
import { ActiveToastMock } from '../../../core/test/toastr/toastr.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { WebWorkerServiceMock } from '../../../core/test/web-worker/web-worker.service.mock';
import { IdleServiceMock } from '../../../shared/idle/test/idle.mock';
import { InactiveService } from '../src/inactive.service';
import { InactiveConfigMock } from './inactive.mock';

describe('InactiveService', () => {
    let service: InactiveService;
    let inactiveConfigMock: InactiveConfigMock;
    let webWorkerServiceMock: WebWorkerServiceMock;
    let toastrQueueServiceMock: ToastrQueueServiceMock;
    let authServiceMock: AuthServiceMock;
    let loginService2Mock: LoginService2Mock;
    let userServiceMock: UserServiceMock;
    let idleServiceMock: IdleServiceMock;

    beforeEach(() => {
        inactiveConfigMock = MockContext.useMock(InactiveConfigMock);
        toastrQueueServiceMock = MockContext.useMock(ToastrQueueServiceMock);
        webWorkerServiceMock = MockContext.useMock(WebWorkerServiceMock);
        authServiceMock = MockContext.useMock(AuthServiceMock);
        loginService2Mock = MockContext.useMock(LoginService2Mock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        idleServiceMock = MockContext.useMock(IdleServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, InactiveService],
        });

        service = TestBed.inject(InactiveService);

        inactiveConfigMock.toastTimeout = 120000;
        inactiveConfigMock.logoutTimeout = 10000;
    });

    describe('init', () => {
        it('should set listeners to events and set up interval that will check if user is active', fakeAsync(() => {
            service.init();

            expect(idleServiceMock.whenIdle).toHaveBeenCalledWith(120000, {
                additionalActivityEvent: jasmine.any(Observable),
            });
        }));
    });

    describe('show toast', () => {
        it('should not show a toast when user is not authenticated', () => {
            userServiceMock.isAuthenticated = false;
            service.init();
            idleServiceMock.whenIdle.next();

            expect(toastrQueueServiceMock.add).not.toHaveBeenCalledWith('logoutwarning');
        });

        it('should not show a toast when it is already shown', () => {
            // Setup
            const toastContent = {
                templateName: 'logoutwarning',
                name: 'mockNameToPassConditionInShowTost',
                parameters: { b: '2' },
            };
            toastrQueueServiceMock.currentToast = new ToastrQueueCurrentToastContext(toastContent, {});
            const toast: any = new ActiveToastMock();
            toastrQueueServiceMock.currentToast.setToast(toast);
            toastrQueueServiceMock.currentToast.content.name = 'logoutwarning';

            // Act
            service.init();
            idleServiceMock.whenIdle.next();

            expect(toastrQueueServiceMock.add).not.toHaveBeenCalledWith('logoutwarning');
        });

        it('should logout the user if he does not close the toast', fakeAsync(() => {
            webWorkerServiceMock.createWorker.and.callFake((type, _, callback) => callback(type));

            service.init();
            idleServiceMock.whenIdle.next();

            expect(toastrQueueServiceMock.add).toHaveBeenCalledWith('logoutwarning');
            expect(authServiceMock.logout).toHaveBeenCalledWith({ redirectAfterLogout: false, isAutoLogout: true });

            authServiceMock.logout.resolve();
            tick();

            expect(loginService2Mock.goTo).toHaveBeenCalledWith({ forceReload: true });
        }));

        it('should not logout user if he close the toast', fakeAsync(() => {
            // Setup
            const toastContent = {
                templateName: 'x',
                name: 'mockNameToPassConditionInShowTost',
                parameters: { b: '2' },
            };
            toastrQueueServiceMock.currentToast = new ToastrQueueCurrentToastContext(toastContent, {});
            const toast: any = new ActiveToastMock();
            toastrQueueServiceMock.currentToast.setToast(toast);

            // Act
            service.init();
            idleServiceMock.whenIdle.next();
            toastrQueueServiceMock.currentToast.content.name = 'logoutwarning';

            // Assert
            expect(toastrQueueServiceMock.add).toHaveBeenCalledWith('logoutwarning');
            expect(authServiceMock.logout).not.toHaveBeenCalled();
            expect(loginService2Mock.goTo).not.toHaveBeenCalled();
            toast.onHidden.next();
            tick();

            expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledOnceWith(WorkerType.InactiveLogoutTimeout);
            expect(authServiceMock.ping).toHaveBeenCalled();
        }));
    });
});
