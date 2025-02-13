import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageScope } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { LoginService2Mock } from '../../../core/test/login/login-service.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { PendingWorkflowComponent } from '../src/pending-workflow.component';
import { LoginResponseHandlerServiceMock } from './login.mocks';

describe('PendingWorkflowComponent', () => {
    let fixture: ComponentFixture<PendingWorkflowComponent>;
    let component: PendingWorkflowComponent;
    let apiServiceMock: SharedFeaturesApiServiceMock;
    let loginResponseHandler: LoginResponseHandlerServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let loginService2Mock: LoginService2Mock;

    beforeEach(() => {
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);
        loginResponseHandler = MockContext.useMock(LoginResponseHandlerServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        loginService2Mock = MockContext.useMock(LoginService2Mock);

        TestBed.overrideComponent(PendingWorkflowComponent, {
            set: {
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(PendingWorkflowComponent);
        component = fixture.componentInstance;
    });

    it('should not be undefined', () => {
        expect(component).toBeDefined();
    });

    describe('ngOnInit()', () => {
        it('should POST to "pendingworkflow"', () => {
            const tokens = {
                nativeClientSessionKey: 'session',
                nativeClientUsertoken: 'user',
            };
            navigationServiceMock.location.search.set('nativeClientSessionKey', tokens.nativeClientSessionKey);
            navigationServiceMock.location.search.set('nativeClientUsertoken', tokens.nativeClientUsertoken);
            fixture.detectChanges();
            expect(apiServiceMock.post).toHaveBeenCalledWith('pendingworkflow', tokens, {
                showSpinner: false,
                messageQueueScope: MessageScope.Login,
            });
        });
    });

    describe('POST to "pendingWorkflow" subscription', () => {
        beforeEach(() => {
            fixture.detectChanges();
        });
        it('should call handler.handleResponse', () => {
            apiServiceMock.post.completeWith({ isCompleted: false });
            expect(loginResponseHandler.handleResponse).toHaveBeenCalledWith({ isCompleted: false });
        });

        it('should navigate to login onError', () => {
            apiServiceMock.post.error();
            expect(loginService2Mock.goTo).toHaveBeenCalledWith({ forceReload: true, storeMessageQueue: true });
        });
    });
});
