import { LoginProvider, LoginProviderProfile } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';
import { Observable, of } from 'rxjs';

import { FacebookProviderService } from '../src/facebook-provider.service';

@Mock({ of: FacebookProviderService })
export class FacebookProviderServiceMock {
    profile: Observable<LoginProviderProfile | null> = of({
        provider: LoginProvider.FACEBOOK,
        name: 'DefaultUser',
        picture: {
            data: { url: 'https://avatars.dicebear.com/api/avataaars/DefaultUser.svg' },
        },
    });
    loginResponse = of({
        authResponse: {
            accessToken: 'abc',
            userID: '123123',
            expiresIn: 5183999,
            signedRequest: '321123',
            graphDomain: LoginProvider.FACEBOOK,
            data_access_expiration_time: 1642511818,
        },
        status: 'connected',
    });
    connectionStatus = of('unknown');

    @Stub() login: jasmine.Spy;
    @Stub() initProfile: jasmine.Spy;
}
