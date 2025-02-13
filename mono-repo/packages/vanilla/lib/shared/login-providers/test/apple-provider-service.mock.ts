import { LoginProvider, LoginProviderProfile } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';
import { Observable, of } from 'rxjs';

import { AppleProviderService } from '../src/apple-provider.service';

import SignInResponseI = AppleSignInAPI.SignInResponseI;

@Mock({ of: AppleProviderService })
export class AppleProviderServiceMock {
    loginResponse = of(<SignInResponseI>{
        authorization: { id_token: '123', code: LoginProvider.APPLE },
        user: { name: { firstName: 'Default', lastName: 'User' }, email: 'default@user.com' },
    });

    profile: Observable<LoginProviderProfile | null> = of({
        provider: LoginProvider.FACEBOOK,
        name: 'DefaultUser',
        picture: {
            data: { url: 'https://avatars.dicebear.com/api/avataaars/DefaultUser.svg' },
        },
    });

    @Stub() login: jasmine.Spy;
    @Stub() initProfile: jasmine.Spy;
}
