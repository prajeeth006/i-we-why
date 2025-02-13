import {
    ContentItem,
    LoginDialogService as CoreLoginDialogService,
    LOGIN_RESPONSE_HANDLER_HOOK,
    LoginFailedOptions,
    LoginNavigationProvidersService,
    LoginProviderProfile,
    LoginResponseHandlerService,
    Message,
    ON_LOGIN_NAVIGATION_PROVIDER,
    ViewTemplateForClient,
} from '@frontend/vanilla/core';
import { LoginConfig } from '@frontend/vanilla/shared/login';
import { LoginProvidersService } from '@frontend/vanilla/shared/login-providers';
import { Mock, Stub, StubObservable, StubPromise } from 'moxxi';
import { BehaviorSubject, Subject } from 'rxjs';

import { PostLoginActionsService } from '../../../core/src/login/post-login-actions.service';
import { BetstationLoginErrorOverlayService } from '../src/betstation/betstation-login-error-overlay.service';
import { BetstationLoginOverlayService } from '../src/betstation/betstation-login-overlay.service';
import { BetstationLoginTrackingService } from '../src/betstation/betstation-login-tracking.service';
import { BetstationLoginService } from '../src/betstation/betstation-login.service';
import { DanskeSpilLoginService } from '../src/integration/danske-spil-login.service';
import { LoginIntegrationConfig } from '../src/integration/login-integration.client-config';
import { LoginIntegrationService } from '../src/integration/login-integration.service';
import { LoginContent } from '../src/login-content.client-config';
import { LoginContentService } from '../src/login-content.service';
import { LoginDialogService } from '../src/login-dialog.service';
import { LoginMessagesService } from '../src/login-messages.service';
import { LoginResourceService } from '../src/login-resource.service';
import { LoginSpinnerService } from '../src/login-spinner/login-spinner.service';
import { LoginTrackingService } from '../src/login-tracking.service';
import { LoginService } from '../src/login.service';

@Mock({ of: LoginIntegrationService })
export class LoginIntegrationServiceMock {
    redirectEnabled: boolean;
    @StubPromise() init: jasmine.PromiseSpy;
    @Stub() redirectToLogin: jasmine.Spy;
}

@Mock({ of: LoginResourceService })
export class LoginResourceServiceMock {
    @StubObservable() login: jasmine.ObservableSpy;
}

@Mock({ of: LoginResponseHandlerService })
export class LoginResponseHandlerServiceMock {
    @StubPromise() handle: jasmine.PromiseSpy;
    @StubPromise() handleResponse: jasmine.PromiseSpy;
    @Stub() handleNewClientConfig: jasmine.Spy;
    @Stub() registerConfigToReloadOnLogin: jasmine.Spy;
    @Stub() registerHooks: jasmine.Spy;
}

@Mock({ of: LoginProvidersService })
export class LoginProvidersServiceMock {
    @Stub() initProvidersProfile: jasmine.Spy;
    @Stub() urlAuth: jasmine.Spy;
    @Stub() sdkAuth: jasmine.Spy;
    readonly providersProfile = new BehaviorSubject<LoginProviderProfile[]>([]);
}

@Mock({ of: CoreLoginDialogService })
export class CoreLoginDialogServiceMock {
    @Stub() open: jasmine.Spy;
    @Stub() openOAuthDialog: jasmine.Spy;
    @Stub() openWelcomeDialog: jasmine.Spy;
    @Stub() close: jasmine.Spy;
    opened: boolean;
}

@Mock({ of: LoginDialogService })
export class LoginDialogServiceMock {
    @Stub() open: jasmine.Spy;
    @Stub() openOAuthDialog: jasmine.Spy;
    @Stub() openWelcomeDialog: jasmine.Spy;
    @Stub() close: jasmine.Spy;
    opened: boolean;
}

@Mock({ of: LoginService })
export class LoginServiceMock {
    @Stub() loginFailed: jasmine.Spy;
    @Stub() goToLogin: jasmine.Spy;
    @Stub() autoLogin: jasmine.Spy;
    @Stub() setNewVisitorComponent: jasmine.Spy;
    @Stub() getNewVisitorComponent: jasmine.Spy;
    @Stub() setLoginComponent: jasmine.Spy;
    @Stub() getLoginComponent: jasmine.Spy;
    @Stub() logSuperCookie: jasmine.Spy;

    onLoginFailed = new Subject<LoginFailedOptions>();
    dialogOpened: boolean;
    touchIdToggleVisible: boolean;
    keepMeSignedInToggleVisible: boolean;
    faceIdToggleVisible: boolean;
    touchIdOrFaceIdEnabled: boolean;
    fastLoginEnabled: boolean;
}

@Mock({ of: LoginTrackingService })
export class LoginTrackingServiceMock {
    @Stub() trackLoaded: jasmine.Spy;
    @Stub() trackClosedAction: jasmine.Spy;
    @Stub() trackUsernameFocused: jasmine.Spy;
    @Stub() trackPasswordFocused: jasmine.Spy;
    @Stub() trackPasswordKeyPressed: jasmine.Spy;
    @Stub() trackLoginBtnClicked: jasmine.Spy;
    @Stub() trackRegisterBtnClicked: jasmine.Spy;
    @Stub() trackFastLoginSetting: jasmine.Spy;
    @Stub() trackLoginSuccess: jasmine.Spy;
    @Stub() trackLoginFailed: jasmine.Spy;
    @Stub() trackLoginWithProvider: jasmine.Spy;
    @Stub() trackContinueWithProvider: jasmine.Spy;
    @Stub() trackProviderWelcomeScreen: jasmine.Spy;
    @Stub() trackLoginWithDifferentProvider: jasmine.Spy;
    @Stub() trackCloseProviderWelcomeScreen: jasmine.Spy;
    @Stub() trackShowMoreProviders: jasmine.Spy;
    @Stub() trackRecaptchaShown: jasmine.Spy;
    @Stub() trackTogglePassword: jasmine.Spy;
    @Stub() trackDateChanged: jasmine.Spy;
    @Stub() trackPasswordError: jasmine.Spy;
    @Stub() trackLoginFailedRedirects: jasmine.Spy;
    @Stub() trackTabbedLoginAction: jasmine.Spy;
    @Stub() trackTabbedLoginFailed: jasmine.Spy;
    @Stub() trackYahooLogin: jasmine.Spy;
    @Stub() trackFastLoginToggle: jasmine.Spy;
    @Stub() trackConnectCardClicked: jasmine.Spy;
    @Stub() trackLoginLoadClosedEvent: jasmine.Spy;
    @Stub() trackMobileNumberChanged: jasmine.Spy;
    @Stub() trackErrorCode: jasmine.Spy;
    @Stub() reportLoginError: jasmine.Spy;
    @Stub() trackPrefillUsernameLoaded: jasmine.Spy;
    @Stub() trackPrefillUsernameClicked: jasmine.Spy;
}

@Mock({ of: LoginMessagesService })
export class LoginMessagesServiceMock {
    @Stub() evaluateUrlAndAddMessage: jasmine.Spy;
    @Stub() setLoginMessage: jasmine.Spy;
    messagesLoaded: Subject<Message[]> = new Subject<Message[]>();
}

@Mock({ of: ON_LOGIN_NAVIGATION_PROVIDER })
export class LoginNavigationProviderMock {
    @Stub() onLoginNavigation: jasmine.Spy;
}

@Mock({ of: PostLoginActionsService })
export class PostLoginActionsServiceMock {
    @Stub() invoke: jasmine.Spy;
    @Stub() register: jasmine.Spy;
}

@Mock({ of: DanskeSpilLoginService })
export class DanskeSpilLoginServiceMock {
    @StubPromise() logout: jasmine.PromiseSpy;
    @StubObservable() isSessionActive: jasmine.ObservableSpy;
    @StubObservable() getLoginParameters: jasmine.ObservableSpy;
}

@Mock({ of: BetstationLoginOverlayService })
export class BetstationLoginOverlayServiceMock {
    @Stub() show: jasmine.Spy;
}

@Mock({ of: BetstationLoginService })
export class BetstationLoginServiceMock {
    onIncorrectPin = new Subject<string>();
    @Stub() gridConnectLogin: jasmine.Spy;
}

@Mock({ of: BetstationLoginErrorOverlayService })
export class BetstationLoginErrorOverlayServiceMock {
    @Stub() showError: jasmine.Spy;
    @Stub() showLogoutInfoMessage: jasmine.Spy;
}

@Mock({ of: BetstationLoginTrackingService })
export class BetstationLoginTrackingServiceMock {
    @Stub() trackLoginPinShown: jasmine.Spy;
    @Stub() trackErrorMessageShown: jasmine.Spy;
    @Stub() trackErrorMessageOk: jasmine.Spy;
}

@Mock({ of: LoginNavigationProvidersService })
export class LoginNavigationProvidersServiceMock {
    @Stub() registerProviders: jasmine.Spy;
}

@Mock({ of: LOGIN_RESPONSE_HANDLER_HOOK })
export class LoginResponseHandlerHookMock {
    @Stub() onPostLogin: jasmine.Spy;
}

@Mock({ of: LoginContentService })
export class LoginContentServiceMock {
    initialized = new Subject<void>();
    content: ViewTemplateForClient = {} as ViewTemplateForClient;
}

@Mock({ of: LoginIntegrationConfig })
export class LoginIntegrationConfigMock extends LoginIntegrationConfig {
    override whenReady = new Subject<void>();
}

@Mock({ of: LoginContent })
export class LoginContentMock {
    whenReady = new Subject<void>();
    loginPage: ViewTemplateForClient = <any>{};
    logoutPage: ViewTemplateForClient = <any>{};
    loginMessages: ContentItem[] = [];
    loginPageMessages: ContentItem[] = [];
    loginPageMessagesBottom: ContentItem[] = [];
    loginPageLinks: ContentItem[] = [];
    loginPageMenuItems: any[];
    loginUrl: string;
    elements = {
        leftItems: [],
    };
}

@Mock({ of: LoginConfig })
export class LoginConfigMock extends LoginConfig {
    override whenReady = new Subject<void>();
}

@Mock({ of: LoginSpinnerService })
export class LoginSpinnerServiceMock {
    @Stub() show: jasmine.Spy;
    @Stub() hide: jasmine.Spy;
}
