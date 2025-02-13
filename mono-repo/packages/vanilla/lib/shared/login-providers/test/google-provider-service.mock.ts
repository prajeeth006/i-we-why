import { LoginProvider, LoginProviderProfile } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';
import { Observable, of } from 'rxjs';

import { GoogleProviderService } from '../src/google-provider.service';

@Mock({ of: GoogleProviderService })
export class GoogleProviderServiceMock {
    profile: Observable<LoginProviderProfile | null> = of({
        provider: LoginProvider.FACEBOOK,
        name: 'DefaultUser',
        picture: {
            data: { url: 'https://avatars.dicebear.com/api/avataaars/DefaultUser.svg' },
        },
    });
    loginResponse = of({
        access_token: '123',
        id_token: LoginProvider.GOOGLE,
        expires_in: 123,
        expires_at: 321,
    });

    @Stub() login: jasmine.Spy;
    @Stub() initProfile: jasmine.Spy;
}
