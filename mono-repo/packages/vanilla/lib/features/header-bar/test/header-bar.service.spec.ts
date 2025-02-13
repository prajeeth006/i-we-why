import { TestBed } from '@angular/core/testing';

import { UrlService, WINDOW } from '@frontend/vanilla/core';
import { HeaderBarService } from '@frontend/vanilla/features/header-bar';
import { MockContext } from 'moxxi';
import { take } from 'rxjs/operators';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { AuthServiceMock } from '../../../core/test/auth/auth.mock';
import { PageMock } from '../../../core/test/browsercommon/page.mock';
import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { LoggerMock } from '../../../core/test/languages/logger.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { WorkflowServiceMock } from '../../../shared/login/test/workflow.mocks';
import { AccountMenuDataServiceMock } from '../../account-menu/test/account-menu-data.mock';
import { HeaderBarConfigMock } from './header-bar.mocks';

describe('HeaderBarService', () => {
    let service: HeaderBarService;

    let userServiceMock: UserServiceMock;
    let headerBarConfigMock: HeaderBarConfigMock;
    let accountMenuServiceMock: AccountMenuDataServiceMock;
    let loggerMock: LoggerMock;
    let pageMock: PageMock;
    let navigationMock: NavigationServiceMock;
    let authServiceMock: AuthServiceMock;
    let windowMock: WindowMock;
    let dslServiceMock: DslServiceMock;

    let urlService: UrlService;

    beforeEach(() => {
        userServiceMock = MockContext.useMock(UserServiceMock);
        headerBarConfigMock = MockContext.useMock(HeaderBarConfigMock);
        accountMenuServiceMock = MockContext.useMock(AccountMenuDataServiceMock);
        pageMock = MockContext.useMock(PageMock);
        navigationMock = MockContext.useMock(NavigationServiceMock);
        authServiceMock = MockContext.useMock(AuthServiceMock);
        loggerMock = MockContext.useMock(LoggerMock);
        MockContext.useMock(WorkflowServiceMock);
        windowMock = new WindowMock();
        dslServiceMock = MockContext.useMock(DslServiceMock);

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                HeaderBarService,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        urlService = TestBed.inject(UrlService);
        service = TestBed.inject(HeaderBarService);
        windowMock.location.href = 'http://m.bwin.com';
        headerBarConfigMock.workflowCloseAction = {};
    });

    describe('config', () => {
        it('should be disabled by default', () => {
            let enabled = false;
            service.enabled$.subscribe((e) => (enabled = e));
            expect(enabled).toBeFalse();
        });

        it('should be enabled when config is enabled', () => {
            headerBarConfigMock.isEnabledCondition = 'TRUE';
            let enabled = false;
            service.enabled$.pipe(take(1)).subscribe((e) => (enabled = e));
            headerBarConfigMock.whenReady.next();
            dslServiceMock.evaluateExpression.next(true);
            expect(enabled).toBeTrue();
        });
    });

    describe('close', () => {
        it('should call goToLastKnownProduct when in negative workflow', () => {
            userServiceMock.workflowType = -1;
            headerBarConfigMock.workflowCloseAction = { 0: { action: 'goToLastKnownProduct' } };

            service.close();

            expect(navigationMock.goToLastKnownProduct).toHaveBeenCalled();
        });

        it('should call goToLastKnownProduct when workflow is 0 and routerModeReturnUrl is not set', () => {
            userServiceMock.workflowType = 0;
            headerBarConfigMock.workflowCloseAction = { 0: { action: 'goToLastKnownProduct' } };

            service.registerActions();
            service.close();

            expect(navigationMock.goToLastKnownProduct).toHaveBeenCalled();
        });

        it('should call logout if user is in workflow', () => {
            userServiceMock.workflowType = 1;
            headerBarConfigMock.workflowCloseAction = { 1: { action: 'logout' } };

            service.registerActions();
            service.close();

            expect(authServiceMock.logout).toHaveBeenCalled();
        });

        it('should log error and call logout if workflow is not configured', () => {
            userServiceMock.workflowType = 1999;
            headerBarConfigMock.workflowCloseAction = { 1: { action: 'logout' } };

            service.close();

            expect(loggerMock.error).toHaveBeenCalled();
            expect(authServiceMock.logout).toHaveBeenCalled();
        });

        it('should navigate to return url when set and remove cookie on close', () => {
            userServiceMock.workflowType = 0;
            headerBarConfigMock.workflowCloseAction = { 0: { action: 'goToLastKnownProduct' } };
            const parsedUrl = urlService.parse('http://bwin.com/en');
            accountMenuServiceMock.routerModeReturnUrl = 'http://bwin.com/en';

            service.close();

            expect(navigationMock.goTo).toHaveBeenCalledWith(parsedUrl);
            expect(accountMenuServiceMock.removeReturnUrlCookie).toHaveBeenCalled();
        });

        it('should navigate to return url when set with changed language and remove cookie on close', () => {
            pageMock.lang = 'de';
            const parsedUrl = urlService.parse('http://bwin.com/de');
            accountMenuServiceMock.routerModeReturnUrl = 'http://bwin.com/en';

            service.close();

            expect(navigationMock.goTo).toHaveBeenCalledWith(parsedUrl);
            expect(accountMenuServiceMock.removeReturnUrlCookie).toHaveBeenCalled();
        });
    });

    describe('back', () => {
        it('should call history back there is routerModeReturnUrl', () => {
            accountMenuServiceMock.routerModeReturnUrl = 'http://bwin.com/en';
            service.back();

            expect(windowMock.history.back).toHaveBeenCalled();
        });

        it('should call history back there is page referrer', () => {
            windowMock.document.referrer = 'http://bwin.com/en';
            service.back();

            expect(windowMock.history.back).toHaveBeenCalled();
        });

        it('should go to last know product', () => {
            service.back();

            expect(navigationMock.goToLastKnownProduct).toHaveBeenCalled();
        });
    });
});
