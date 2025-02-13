import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { CookieServiceMock } from '../../../core/test/browser/cookie.mock';
import { ClientConfigServiceMock } from '../../../core/test/client-config/client-config.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { LaunchDarklyService } from '../src/launch-darkly.service';

describe('LaunchDarklyService', () => {
    let service: LaunchDarklyService;

    beforeEach(() => {
        MockContext.useMock(UserServiceMock);
        MockContext.useMock(ClientConfigServiceMock);
        MockContext.useMock(CookieServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
        });

        service = TestBed.inject(LaunchDarklyService);
    });

    describe('getFeatureFlagValue()', () => {
        it('should return feature flag value', fakeAsync(() => {
            let result = false;
            service.getFeatureFlagValue('HeaderEnabled').subscribe((value) => {
                result = value;
            });
            service['_clientInitialized'].next();
            service['_featureFlags'].next({ HeaderEnabled: true });
            tick();
            expect(result).toBeTrue();
        }));
    });
});
