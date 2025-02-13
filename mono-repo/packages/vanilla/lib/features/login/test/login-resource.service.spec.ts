import { TestBed } from '@angular/core/testing';

import { ApiOptions } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { LoginResourceService } from '../src/login-resource.service';

describe('LoginResourceService', () => {
    let target: LoginResourceService;
    let apiServiceMock: SharedFeaturesApiServiceMock;

    beforeEach(() => {
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);

        TestBed.configureTestingModule({
            providers: [LoginResourceService, MockContext.providers],
        });

        target = TestBed.inject(LoginResourceService);
    });

    it('should make request', () => {
        const data = { username: 'Chuck Norris' };
        const options: ApiOptions = { messageQueueScope: 'whatever' };

        target.login(data, options).subscribe(); // act

        expect(apiServiceMock.post).toHaveBeenCalledWith('login', data, options);
    });
});
