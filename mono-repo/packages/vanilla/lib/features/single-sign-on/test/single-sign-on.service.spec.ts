import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { PageMock } from '../../../core/test/browsercommon/page.mock';
import { LoggerMock } from '../../../core/test/languages/logger.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { SingleSignOnService } from '../src/single-sign-on.service';

describe('SingleSignOnService', () => {
    let service: SingleSignOnService;
    let apiServiceMock: SharedFeaturesApiServiceMock;
    let pageMock: PageMock;
    let userServiceMock: UserServiceMock;
    let logMock: LoggerMock;

    beforeEach(() => {
        pageMock = MockContext.useMock(PageMock);
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        logMock = MockContext.useMock(LoggerMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, SingleSignOnService],
        });

        service = TestBed.inject(SingleSignOnService);
        userServiceMock.isAuthenticated = true;
        userServiceMock.ssoToken = 'token';
        pageMock.singleSignOnLabels = ['https://www.partypoker.com', 'https://www.partycasino.com', 'https://www.partysports.com'];
        pageMock.domain = '.partypoker.com';
    });

    describe('setSsoToken', () => {
        it('call post for configured labels', () => {
            service.setSsoToken();

            expect(getCallArguments(apiServiceMock.post)).toEqual([
                [
                    'singlesignon/setssotoken',
                    { ssoToken: 'token' },
                    { prefix: '', baseUrl: 'https://www.partycasino.com', withCredentials: true, showSpinner: false },
                ],
                [
                    'singlesignon/setssotoken',
                    { ssoToken: 'token' },
                    { prefix: '', baseUrl: 'https://www.partysports.com', withCredentials: true, showSpinner: false },
                ],
            ]);

            apiServiceMock.post.next();
            apiServiceMock.post.next({}, 1);

            expect(getCallArguments(logMock.info)).toEqual([
                ['SingleSignOn: Successfully called https://www.partycasino.com/api/singlesignon/setssotoken'],
                ['SingleSignOn: Successfully called https://www.partysports.com/api/singlesignon/setssotoken'],
            ]);
        });

        it('should log error is call fails', () => {
            service.setSsoToken();

            apiServiceMock.post.error({});
            apiServiceMock.post.error({}, 1);
            expect(getCallArguments(logMock.info)).toEqual([
                ['SingleSignOn: Failed to call https://www.partycasino.com/api/singlesignon/setssotoken', {}],
                ['SingleSignOn: Failed to call https://www.partysports.com/api/singlesignon/setssotoken', {}],
            ]);
        });

        it('should not call api if config is empty', () => {
            pageMock.singleSignOnLabels = ['https://www.partypoker.com'];
            service.setSsoToken();

            expect(apiServiceMock.post).not.toHaveBeenCalled();
        });
    });

    function getCallArguments(serviceMock: jasmine.Spy) {
        return serviceMock.calls.all().map((call: any) => call.args);
    }
});
