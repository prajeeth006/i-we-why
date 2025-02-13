import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { LoginService2Mock } from '../../../core/test/login/login-service.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { PendingPostLoginWorkflowComponent } from '../src/pending-post-login-workflow.component';

describe('PendingPostLoginWorkflowComponent', () => {
    let fixture: ComponentFixture<PendingPostLoginWorkflowComponent>;
    let component: PendingPostLoginWorkflowComponent;
    let apiServiceMock: SharedFeaturesApiServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let loginService2Mock: LoginService2Mock;

    beforeEach(() => {
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        loginService2Mock = MockContext.useMock(LoginService2Mock);

        TestBed.overrideComponent(PendingPostLoginWorkflowComponent, {
            set: {
                providers: [MockContext.providers],
            },
        });
        fixture = TestBed.createComponent(PendingPostLoginWorkflowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should not be undefined', () => {
        expect(component).toBeDefined();
    });
    it('ngOnInit() should GET "pendingworkflow/postloginredirecturl"', () => {
        fixture.detectChanges();
        expect(apiServiceMock.get).toHaveBeenCalledWith('pendingworkflow/postloginredirecturl', {}, { showSpinner: false });
    });

    describe('GET "pendingworkflow/postloginredirecturl" subscription', () => {
        it('should navigate to redirect url onNext', () => {
            const redirectUrl = 'http://redirect.acme.com/path';
            apiServiceMock.get.next({ redirectUrl });
            expect(navigationServiceMock.goTo).toHaveBeenCalledWith(redirectUrl);
        });

        it('should navigate to login onError', () => {
            apiServiceMock.get.error();
            expect(loginService2Mock.goTo).toHaveBeenCalled();
        });
    });
});
