import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { WorkflowService } from '@frontend/vanilla/shared/login';
import { MockContext } from 'moxxi';

import { LoginResponseHandlerServiceMock } from '../../../features/login/test/login.mocks';
import { SharedFeaturesApiServiceMock } from '../../src/http/test/shared-features-api.mock';
import { ProductNavigationServiceMock } from '../products/product.mock';
import { UserServiceMock } from '../user/user.mock';
import { LoginStoreServiceMock } from './login-store.mock';

describe('WorkflowService', () => {
    let service: WorkflowService;
    let loginApiMock: SharedFeaturesApiServiceMock;
    let loginResponseHandlerMock: LoginResponseHandlerServiceMock;
    let loginStoreServiceMock: LoginStoreServiceMock;
    let productNavigationServiceMock: ProductNavigationServiceMock;

    beforeEach(() => {
        loginApiMock = MockContext.useMock(SharedFeaturesApiServiceMock);
        loginResponseHandlerMock = MockContext.useMock(LoginResponseHandlerServiceMock);
        MockContext.useMock(UserServiceMock);
        loginStoreServiceMock = MockContext.useMock(LoginStoreServiceMock);
        productNavigationServiceMock = MockContext.useMock(ProductNavigationServiceMock);

        TestBed.configureTestingModule({
            providers: [WorkflowService, MockContext.providers],
        });
        loginStoreServiceMock.LoginType = 'oauth';
    });
    beforeEach(() => {
        service = TestBed.inject(WorkflowService);
    });

    const scenarios: Record<string, string> = {
        skip: 'skipworkflow',
        finalize: 'finalizeWorkflow',
    };

    Object.keys(scenarios).forEach((method) => {
        it(`Success-${method}`, fakeAsync(() => {
            const action = scenarios[method];
            const spy = jasmine.createSpy();
            const loginResponse = { isCompleted: true };
            const options = {};
            const expectedReturnValue = {};

            (service as any)[method](options).then(spy);

            expect(loginApiMock.post).toHaveBeenCalledWith(action, { loginType: 'oauth' });
            loginApiMock.post.completeWith(loginResponse);
            tick();
            expect(loginResponseHandlerMock.handleResponse).toHaveBeenCalledWith(loginResponse, options);
            loginResponseHandlerMock.handleResponse.resolve('sarma');
            tick();
            expect(spy).toHaveBeenCalledWith(expectedReturnValue);
        }));

        it(`Failure-${method}`, fakeAsync(() => {
            const action = scenarios[method];
            const spy = jasmine.createSpy();

            (service as any)[method]({}).then(spy);

            expect(loginApiMock.post).toHaveBeenCalledWith(action, { loginType: 'oauth' });
            loginApiMock.post.error({ redirectUrl: 'sarma' });
            tick();
            expect(loginResponseHandlerMock.handleResponse).not.toHaveBeenCalled();
            expect(productNavigationServiceMock.goTo).toHaveBeenCalledWith('sarma');
            expect(spy).toHaveBeenCalledWith({ loginError: { redirectUrl: 'sarma' } });
        }));
    });

    describe('finalizeWithData', () => {
        it('on success should return {}', fakeAsync(() => {
            const spy = jasmine.createSpy();
            const data = {};
            const options = {};

            service.finalizeWithData(data, options).then(spy);

            expect(loginApiMock.post).toHaveBeenCalledWith('workflowdata', data);
            tick();
            loginApiMock.post.completeWith({ test: 'first' });
            tick();
            loginApiMock.post.completeWith({ test: 'second' });
            tick();
            expect(loginResponseHandlerMock.handleResponse).toHaveBeenCalledWith({ test: 'second' }, {});
            loginResponseHandlerMock.handleResponse.resolve();
            tick();
            expect(spy).toHaveBeenCalledWith({});
        }));

        it('should return error', fakeAsync(() => {
            const spy = jasmine.createSpy();
            const data = {};
            const options = {};
            const errorResponse = { redirectUrl: 'https://www.me.me' };
            service.finalizeWithData(data, options).then(spy);
            tick();

            loginApiMock.post.completeWith({});
            tick();

            loginApiMock.post.error(errorResponse);
            tick();
            expect(productNavigationServiceMock.goTo).toHaveBeenCalledWith('https://www.me.me');
            expect(spy).toHaveBeenCalledWith({ loginError: errorResponse });
        }));
    });

    describe('finalizeHandle', () => {
        it('on success', fakeAsync(() => {
            const spy = jasmine.createSpy();
            const options = {};
            const loginResponse = { test: 'first' };
            const loginRedirectInfo = { login: 'info' };

            service.finalizeHandle(options).then(spy);

            expect(loginApiMock.post).toHaveBeenCalledWith('finalizeWorkflow', { loginType: 'oauth' });
            tick();
            loginApiMock.post.completeWith(loginResponse);
            tick();
            expect(loginResponseHandlerMock.handle).toHaveBeenCalledWith(loginResponse, options);
            loginResponseHandlerMock.handle.resolve(loginRedirectInfo);
            tick();
            expect(spy).toHaveBeenCalledWith({ loginResponse: loginResponse, loginRedirectInfo: loginRedirectInfo });
        }));

        it('on failure', fakeAsync(() => {
            const spy = jasmine.createSpy();
            const options = {};
            const loginError = { test: 'first' };

            service.finalizeHandle(options).then(spy);

            expect(loginApiMock.post).toHaveBeenCalledWith('finalizeWorkflow', { loginType: 'oauth' });
            tick();
            loginApiMock.post.error(loginError);
            tick();
            expect(loginResponseHandlerMock.handle).not.toHaveBeenCalled();
            tick();
            expect(spy).toHaveBeenCalledWith({ loginError: loginError });
        }));
    });
});
