import { CommonModule, DOCUMENT } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation,
    inject,
} from '@angular/core';
import { AbstractControl, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import {
    CommonMessages,
    ConnectCardLoginEvent,
    ContentItem,
    CookieName,
    CookieService,
    DateTimeService,
    DeviceFingerPrint,
    DeviceFingerprintService,
    DeviceService,
    DslService,
    FastLoginValue,
    Logger,
    LoginFailedReason,
    LoginGoToOptions,
    LoginNavigationService,
    LoginProvider,
    LoginResponseHandlerService,
    LoginService2,
    LoginStoreService,
    LoginType,
    MenuContentItem,
    Message,
    MessageLifetime,
    MessageQueueService,
    MessageScope,
    MessageType,
    NativeAppService,
    NativeEvent,
    NativeEventType,
    NavigationService,
    RememberMeConfig,
    TimerService,
    TrackingDirective,
    UserLoggingInEvent,
    UserService,
    WebWorkerService,
    WindowEvent,
    WorkerType,
    trackByItem,
} from '@frontend/vanilla/core';
import { ContentMessagesComponent } from '@frontend/vanilla/features/content-messages';
import { LhHeaderBarComponent } from '@frontend/vanilla/features/header-bar';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { MenuItemComponent } from '@frontend/vanilla/features/menus';
import { MessagePanelComponent } from '@frontend/vanilla/features/message-panel';
import { ReCaptchaComponent, ReCaptchaValueAccessorDirective } from '@frontend/vanilla/features/recaptcha';
import { DslPipe, FormatPipe, TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { CopyrightComponent } from '@frontend/vanilla/shared/copy-right';
import {
    DateComponent,
    FormFieldComponent,
    UsernameMobileNumberComponent,
    ValidationHelperService,
    ValidationHintComponent,
    Validators,
} from '@frontend/vanilla/shared/forms';
import { LoginConfig } from '@frontend/vanilla/shared/login';
import { LoginProvidersService, ProviderLoginOptions } from '@frontend/vanilla/shared/login-providers';
import { WrapperSettingsService } from '@frontend/vanilla/shared/native-app';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FastLoginComponent } from './fast-login.component';
import { HeaderSectionComponent } from './header/header-section/header-section.component';
import { LoginContent } from './login-content.client-config';
import { LoginContentService } from './login-content.service';
import { LoginLinksComponent } from './login-links.component';
import { LoginMessagesService } from './login-messages.service';
import { ConnectCardLoginOptionComponent } from './login-options/connect-card-login-option.component';
import { DanskeSpilLoginOptionComponent } from './login-options/danske-spil-login-option.component';
import { LoginOptionTabsComponent } from './login-options/login-option-tabs.component';
import { LoginProviderButtonComponent } from './login-provider-button.component';
import { LoginResourceService } from './login-resource.service';
import { LoginSpinnerService } from './login-spinner/login-spinner.service';
import { LoginTrackingService, TabbedLoginAction } from './login-tracking.service';
import { LoginService } from './login.service';
import { PrefillUsernameToggleComponent } from './prefill-username-toggle.component';
import { RememberMeComponent } from './remember-me.component';

/**
 * @stable
 */
@Component({
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        LoginOptionTabsComponent,
        ContentMessagesComponent,
        MessagePanelComponent,
        LoginLinksComponent,
        LoginProviderButtonComponent,
        ReCaptchaComponent,
        FastLoginComponent,
        PrefillUsernameToggleComponent,
        RememberMeComponent,
        DanskeSpilLoginOptionComponent,
        ConnectCardLoginOptionComponent,
        HeaderSectionComponent,
        LhHeaderBarComponent,
        ReCaptchaValueAccessorDirective,
        FormatPipe,
        ValidationHintComponent,
        UsernameMobileNumberComponent,
        TrustAsHtmlPipe,
        FormFieldComponent,
        TrackingDirective,
        DslPipe,
        DateComponent,
        IconCustomComponent,
        MenuItemComponent,
        CopyrightComponent,
    ],
    selector: 'lh-login',
    templateUrl: 'login.component.html',
    styles: [
        `
            input:-webkit-autofill {
                transition: 0.01s;
            }
        `,
    ],
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/login/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() loginMessageKey: string;
    @Input() responseGotoOptions: LoginGoToOptions;
    @Output() onBackClick = new EventEmitter<void>();
    @Output() onRegisterClick = new EventEmitter<void>();
    @ViewChild(ReCaptchaComponent) reCaptcha: ReCaptchaComponent;
    @ViewChild('registerLink') registerLink: ElementRef;

    formGroup: UntypedFormGroup;
    showPassword = false;
    showFastLoginToggles = false;
    showValidationHint = false;
    showLessProviders = false;
    highlightHints = false;
    loginOptions: string[];
    selectedLoginOption: string;
    hasEntryMessage = false;
    isMobileNumber: boolean = false;
    usernameLabel: string | undefined;
    usernameValidations: { [key: string]: string } | undefined;
    isMobileLoginEnabled: boolean = false;
    headerCssClass: string;
    closeButtonText: string | undefined;
    providers: string[] = [];
    isIphone: boolean;
    registerLinkItem: ContentItem;
    bottomLinks: MenuContentItem;
    readonly trackByItem = trackByItem;
    readonly LoginProvider = LoginProvider;

    private isLoginRetries = 0;
    private requiredComponents: AbstractControl[];
    private deviceFingerPrint: DeviceFingerPrint;
    private destroySubject = new Subject<any>();

    private readonly _doc = inject(DOCUMENT);

    constructor(
        public loginContent: LoginContent,
        public loginConfig: LoginConfig,
        public loginContentService: LoginContentService,
        public rememberMeConfig: RememberMeConfig,
        public commonMessages: CommonMessages,
        private user: UserService,
        private navigation: NavigationService,
        private loginNavigationService: LoginNavigationService,
        private loginProvidersService: LoginProvidersService,
        private changeDetectorRef: ChangeDetectorRef,
        private loginResource: LoginResourceService,
        private loginStore: LoginStoreService,
        private formBuilder: UntypedFormBuilder,
        private nativeApplication: NativeAppService,
        private loginService: LoginService,
        private trackingService: LoginTrackingService,
        private loginResponseHandlerService: LoginResponseHandlerService,
        private validationHelper: ValidationHelperService,
        private wrapperSettingsService: WrapperSettingsService,
        private cookieService: CookieService,
        private loginMessagesService: LoginMessagesService,
        private deviceService: DeviceService,
        private deviceFingerprintService: DeviceFingerprintService,
        private messageQueue: MessageQueueService,
        private dslService: DslService,
        private loginService2: LoginService2,
        private timerService: TimerService,
        private webWorkerService: WebWorkerService,
        private logger: Logger,
        private dateTimeService: DateTimeService,
        private loginSpinnerService: LoginSpinnerService,
    ) {}

    get v2(): boolean {
        return this.loginConfig.v2;
    }

    get v3(): boolean {
        return this.loginConfig.version === 3;
    }

    get reCaptchaControl(): UntypedFormControl | null {
        return this.formGroup ? (this.formGroup.get('captcharesponse') as UntypedFormControl) : null;
    }

    get showRegisterButton(): boolean {
        return this.loginConfig.showRegisterButton;
    }

    get showConnectCardButton(): boolean {
        return this.v2 && this.loginConfig.loginOptions.some((x) => x == 'connectcardoption') && !this.isConnectCardPage;
    }

    get isConnectCardInLoginOptions(): boolean {
        return this.loginConfig.loginOptions.some((x) => x == 'connectcardoption');
    }

    get isConnectCardPage(): boolean {
        return this.v2 && this.selectedLoginOption === 'connectcardoption';
    }

    get disabled(): boolean {
        if (this.passwordHintsEnabled) {
            // only enable login-btn if all required inputs are available;
            return this.formGroup.disabled || this.requiredComponents.some((c) => c.errors?.['required']);
        }
        // original handling: always enable login-btn if form is enabled to be able to immediately submit autofilled forms
        return this.formGroup.disabled;
    }

    get isFormInvalid(): boolean {
        return this.loginConfig.disableLoginOnFormInvalid && !this.formGroup.valid;
    }

    get passwordHintsEnabled(): boolean {
        return this.loginConfig.passwordHintsOnNthAttempt > 0 && this.isLoginRetries + 1 === this.loginConfig.passwordHintsOnNthAttempt;
    }

    get connectCardImage(): any {
        return (this.loginContentService.content.children['connectcardicon'] as any)?.image;
    }

    get headerContent(): string | undefined {
        if (this.v2) {
            if (this.selectedLoginOption === 'connectcardoption') {
                return this.loginConfig.connectCardVersion === 1
                    ? this.loginContentService.content.messages?.['ConnectCardLogin']
                    : this.loginContentService.content.messages?.['ConnectCardLoginTitle'];
            }
        }
        return this.loginContentService.content.title;
    }

    get showHeaderBackButton(): boolean {
        return this.v2 && this.selectedLoginOption === 'connectcardoption';
    }

    get visibleProviders(): string[] {
        const visibleCount = Number(this.getToggleProvidersButtonValue('visibleCount'));

        return this.showLessProviders || this.providers.length <= visibleCount ? this.providers : this.providers.slice(0, visibleCount);
    }

    get loginButtonCSS(): string | undefined {
        let cssClass = this.loginContentService.content.form.loginbutton?.htmlAttributes?.cssClass;
        if (this.v3) {
            return `${cssClass} login-v3__login-btn`;
        }
        return cssClass || undefined;
    }

    private get shouldPrefillUsername(): boolean {
        if (!this.loginConfig.prefillUsernameToggleEnabled) {
            return true;
        }

        return this.cookieService.get(CookieName.PfU) === 'true';
    }

    private set shouldPrefillUsername(value: boolean) {
        this.loginService2.shouldPrefillUsername(value);
    }

    ngOnInit() {
        this.loginOptions = this.loginConfig.loginOptions || [];
        this.isMobileLoginEnabled = this.loginConfig.isLoginWithMobileEnabled;
        this.closeButtonText = this.loginConfig.showCloseButtonAsText ? this.loginContentService.content.messages?.HeaderCloseButtonText : undefined;
        this.providers = Object.keys(this.loginConfig.providers);

        this.setUsernameLabelAndValidationMessages();

        if (this.loginConfig.selectedTabEnabled && this.loginStore.SelectedTab) {
            this.selectLoginOption(this.loginStore.SelectedTab, false);
        }

        const rememberMeEnabledInPast = !!this.cookieService.get(CookieName.RmH);

        this.formGroup = this.formBuilder.group({
            username: this.formBuilder.control(
                this.shouldPrefillUsername ? this.loginStore.LastVisitor || '' : '',
                this.validationHelper.createValidators('usernameLogin'),
            ),
            password: this.formBuilder.control('', [Validators.required]),
            captcharesponse: this.formBuilder.control(''),
            rememberme: this.formBuilder.control(rememberMeEnabledInPast),
            prefillusername: this.formBuilder.control(this.shouldPrefillUsername),
        });

        if (this.loginConfig.isDateOfBirthEnabled) {
            this.formGroup.addControl('dateOfBirth', this.formBuilder.control('', [Validators.required]));
        }

        if (this.loginConfig.prefillUsernameToggleEnabled) {
            this.formGroup
                .get('prefillusername')!
                .valueChanges.pipe(takeUntil(this.destroySubject))
                .subscribe((value) => (this.shouldPrefillUsername = value));
        }

        if (this.loginConfig.passwordHintsOnNthAttempt > 0) {
            // override fallback for "GeneralValidationError" message to be null
            // to avoid fallback to common strings
            this.loginContentService.content.form['password']!.validation![CommonMessages.GeneralValidationErrorKey] = <any>null;
            this.formGroup.get('password')!.clearValidators();
            this.formGroup
                .get('password')!
                .setValidators([...this.validationHelper.createValidators('password'), ...this.validationHelper.createPasswordValidators()]);
        }

        const requiredComponents = ['username', 'password'];

        if (this.loginConfig.isDateOfBirthEnabled) {
            requiredComponents.push('dateOfBirth');
        }

        this.registerRequiredComponents(...requiredComponents);

        this.showFastLoginToggles =
            this.loginConfig.fastLoginOptionsEnabled &&
            (this.loginService.touchIdToggleVisible || this.loginService.faceIdToggleVisible || this.loginService.keepMeSignedInToggleVisible);

        if (this.showFastLoginToggles) {
            this.formGroup.addControl('fastloginenabled', this.formBuilder.control(this.fastLoginInitValue()));
        }

        this.deviceFingerPrint = this.deviceFingerprintService.get();
        this.nativeApplication.sendToNative({ eventName: NativeEventType.LOGINSCREENACTIVE });

        this.nativeApplication.eventsFromNative.subscribe((e: NativeEvent) => {
            if (e.eventName === NativeEventType.DEVICEDETAILS) {
                this.deviceFingerPrint.deviceDetails = Object.assign({}, this.deviceFingerPrint.deviceDetails, e.parameters);
            } else if (e.eventName === NativeEventType.LOGINPREFILL) {
                const parameters = e.parameters || {};
                this.formGroup.get('username')?.setValue(parameters['username']);
                this.formGroup.get('password')?.setValue(parameters['password']);
                this.formGroup.get('rememberme')?.setValue(true);
                this.changeDetectorRef.detectChanges();
            }
        });
        this.isIphone = navigator.userAgent.toLowerCase().indexOf('iphone') != -1;

        this.setLoginEntryMessages();
        this.trackingService.trackLoginLoadClosedEvent('load', this.loginService.dialogOpened);
        this.setCSSHeaderClass();

        if (this.v3) {
            this.dslService
                .evaluateContent(this.loginContent.loginPageBottomLinks)
                .pipe(takeUntil(this.destroySubject))
                .subscribe((items: MenuContentItem) => {
                    this.bottomLinks = items;
                });
        }
    }

    ngAfterViewInit() {
        if (this.v2 || this.v3) {
            this.dslService
                .evaluateContent(this.loginContent.registerPageLinks)
                .pipe(takeUntil(this.destroySubject))
                .subscribe((items: ContentItem[]) => {
                    this.registerLinkItem = items && items[0]!;
                    this.changeDetectorRef.detectChanges();

                    this.registerLink?.nativeElement
                        ?.querySelector('a')
                        ?.addEventListener(WindowEvent.Click, () => this.register(this.registerLinkItem?.titleLink?.url));
                });
        }

        this.timerService.setTimeout(() => {
            const usernameValue = this.formGroup.controls['username']?.value;

            if (this.loginConfig.autoFocusUsername && !usernameValue) {
                this._doc.getElementsByName('username')[0]?.focus();
            } else if (usernameValue) {
                this.formGroup.controls['username']?.markAsTouched();
                this._doc.getElementsByName('password')[0]?.focus();
            }
        });
    }

    ngOnDestroy() {
        this.loginSpinnerService.hide();
        this.destroySubject.next(null);
        this.destroySubject.complete();
    }

    close() {
        this.messageQueue.clear({ clearPersistent: true });
        this.trackingService.trackClosedAction();
        this.trackingService.trackLoginLoadClosedEvent('close', this.loginService.dialogOpened);

        if (this.isConnectCardInLoginOptions) {
            this.trackingService.trackTabbedLoginAction({
                actionEvent: 'close',
                locationEvent: 'connect card login screen',
                eventDetails: 'connect card login screen',
            });
        }

        this.onBackClick.emit();
    }

    back() {
        this.selectLoginOption('userpwdoption');
        this.setCSSHeaderClass();

        if (this.isConnectCardInLoginOptions) {
            this.trackingService.trackTabbedLoginAction({
                actionEvent: 'back',
                locationEvent: 'connect card login screen',
                eventDetails: 'connect card login screen',
            });
        }
    }

    setCSSHeaderClass() {
        this.headerCssClass = this.loginConfig.titleCssClass;
    }

    usernameBlur() {
        const username = this.formGroup.value.username;
        if (username && username !== this.loginStore.LastVisitor) {
            this.loginStore.LastAttemptedVisitor = username;
        }
        if (!username) {
            this.formGroup.get('username')?.markAsUntouched();
        }
        if (this.isIphone) {
            const usernameElement = this._doc.getElementById('userId') as HTMLInputElement;
            const passwordElement = this._doc.getElementsByName('password')[0] as HTMLInputElement;

            if (usernameElement && passwordElement) {
                this.createInputCheckInterval(usernameElement, passwordElement);
            }
        }
    }

    passwordfocus() {
        if (this.passwordHintsEnabled) {
            this.showValidationHint = true;
        }
    }

    passwordBlur() {
        if (!this.formGroup.value.password) {
            this.formGroup.get('password')?.markAsUntouched();
        }
    }

    isMobileChangedEvent(isMobile: boolean) {
        this.timerService.setTimeout(() => {
            this.isMobileNumber = isMobile;

            this.trackingService.trackMobileNumberChanged(isMobile, this.loginOptions.length > 1);
        });
    }

    usernameChanged(event: Event) {
        this.forceSetControlValue(event);
    }

    passwordChanged(event: Event) {
        this.forceSetControlValue(event);
    }

    registerRequiredComponents(...components: string[]): any {
        this.requiredComponents = components.map((name) => this.formGroup.get(name)!);
    }

    loginWithConnectCard() {
        this.selectLoginOption('connectcardoption');
        this.trackingService.trackConnectCardClicked();
    }

    async login() {
        this.loginSpinnerService.show();
        this.formGroup.disable();
        this.trackingService.trackLoginBtnClicked(this.selectedLoginOption);

        if (!this.formGroup.get('username')?.value || !this.formGroup.get('password')?.value) {
            this.formGroup.markAllAsTouched();
            this.formGroup.enable();

            if (this.loginContentService.content.messages?.Required) {
                this.messageQueue.clear();
                this.messageQueue.add({
                    scope: MessageScope.Login,
                    html: this.loginContentService.content.messages?.Required || '',
                    type: MessageType.Error,
                    lifetime: MessageLifetime.Single,
                });
            }

            return;
        }

        if (this.loginConfig.recaptchaEnterpriseEnabled) {
            await this.reCaptcha.execute();
        }

        if (this.passwordHintsEnabled) {
            if (!this.formGroup.get('password')?.valid) {
                this.trackFailedPasswordValidations();
                this.showValidationHint = true;
                this.highlightHints = true;
                this.formGroup.enable();

                return;
            }
        }

        const model = this.formGroup.value;
        this.isLoginRetries += 1;

        this.loginInternal(model, async (rejected: LoginFailedReason) => {
            if (!model.password) {
                rejected.errorCode = '1910';
            }

            if (model.password && this.reCaptcha.isEnabled() && !model.captcharesponse) {
                rejected.errorCode = '1911';
            }

            if (rejected.errorCode == '1001') {
                this.isMobileLoginEnabled = false;
                this.setUsernameLabelAndValidationMessages();
                this.resetLoginFormFields();
            }

            if (rejected.errorCode == '1717') {
                this.formGroup.get('username')?.setValue('');
                this.formGroup.get('username')?.markAsTouched();
            }

            this.trackTabbedLoginFailed();
            this.formGroup.enable();

            if (this.loginConfig.resetLoginFormErrorCodes.indexOf(rejected.errorCode) > -1) {
                this.resetLoginFormFields();
            } else {
                this.formGroup.get('password')?.setValue('');
                this.formGroup.get('password')?.markAsTouched();
            }

            this.reCaptcha.reload();

            if (this.reCaptcha.isEnabled()) {
                this.trackingService.trackRecaptchaShown();
            }

            this.logger.infoRemote(
                `LOGIN_INFO Login type ${LoginType.Manual} failed for ${this.formGroup.get('username')?.value}. ErrorCode: ${rejected.errorCode}, PosApiError: ${rejected.posApiErrorMessage}`,
            );
            await this.loginService.loginFailed({ reason: rejected, type: LoginType.Manual });
            this.trackingService.trackLoginFailed();
        });
    }

    onConnectCardSubmitted(data: ConnectCardLoginEvent) {
        data.loginType = LoginType.ConnectCard;
        this.trackingService.trackLoginBtnClicked(this.selectedLoginOption);
        this.logger.infoRemote(`LOGIN_INFO Login of type ${LoginType.ConnectCard} was successfull`);
        this.loginInternal(data, async (rejected: any) => {
            await this.loginService.loginFailed({ reason: rejected, type: LoginType.ConnectCard });
            this.trackingService.trackLoginFailed();
        });
    }

    register(registerLink?: string) {
        this.trackingService.trackRegisterBtnClicked();
        if (this.isConnectCardInLoginOptions) {
            this.trackingService.trackTabbedLoginAction({
                actionEvent: 'click',
                locationEvent: 'connect card login screen',
                eventDetails: 'create an account link',
            });
        }

        if (this.onRegisterClick.observers.length > 0) {
            this.onRegisterClick.emit();
            return;
        }

        if (this.loginConfig.useOpenRegistrationEvent) {
            this.nativeApplication.sendToNative({ eventName: NativeEventType.OPENREGISTRATIONSCREEN });
        } else {
            this.loginNavigationService.goToRegistration({ appendReferrer: true }, registerLink);
        }
    }

    invokeLoginWith(provider: LoginProvider, isConnected: boolean) {
        let trackingOptions: TabbedLoginAction = {
            actionEvent: 'click',
            eventDetails: `continue with ${provider}`,
        };

        if (isConnected) {
            trackingOptions = {
                ...trackingOptions,
                positionEvent: 'existing account flow',
                locationEvent: `${provider} login confirmation screen`,
                eventDetails: 'continue',
            };
        }

        this.trackingService.trackLoginWithProvider(provider, trackingOptions);

        const queryParams = this.loginContentService.content.form[`${provider}button`]?.values?.reduce((r: Record<string, string>, e) => {
            r[e.value] = e.text;
            return r;
        }, {});
        const providerConfig = this.loginConfig.providers[provider];

        const options: ProviderLoginOptions = {
            provider,
        };

        if (queryParams) {
            options.queryParams = queryParams;
        }

        if (providerConfig?.redirectQueryParams) {
            options.redirectQueryParams = providerConfig.redirectQueryParams;
        }

        if (providerConfig?.sdkLogin) {
            this.loginProvidersService.sdkAuth(options);
        } else {
            this.loginProvidersService.urlAuth(options);
        }

        this.clearLoginInputValidators();
    }

    selectLoginOption(optionName: string, clearLoginMessageQueue: boolean = true) {
        this.selectedLoginOption = optionName;

        if (this.v2 && optionName) {
            if (clearLoginMessageQueue) {
                this.messageQueue.clear({ clearPersistent: true, scope: MessageScope.Login });
            }
            this.messageQueue.clear({ clearPersistent: true, scope: MessageScope.LoginMessages });
            this.loginStore.SelectedTab = this.selectedLoginOption;
        }
    }

    togglePassword() {
        this.showPassword = !this.showPassword;
    }

    getToggleProvidersButtonValue(key: string): string {
        return this.loginContentService.content.form['toggleprovidersbutton']?.values?.find((v) => v.value === key)?.text || '';
    }

    getProviderIconStyle(provider: string) {
        const content: any = this.loginContentService.content.children[`${provider}image`];
        const src: string = content?.image?.src;

        return src ? { 'background-image': `url(${src})` } : null;
    }

    onDayChanged() {
        this.trackingService.trackDateChanged('Day');
    }

    onMonthChanged() {
        this.trackingService.trackDateChanged('Month');
    }

    onYearChanged() {
        this.trackingService.trackDateChanged('Year');
    }

    onLoginMessagesLoaded(data?: Message[]) {
        this.hasEntryMessage = !!(data && data.length > 0);
    }

    onShowMoreProvidersClick() {
        this.showLessProviders = !this.showLessProviders;
        this.trackingService.trackShowMoreProviders();
    }

    getProvider(provider: string): LoginProvider {
        return <LoginProvider>provider;
    }

    private resetLoginFormFields() {
        this.formGroup.get('password')?.setValue('');
        this.formGroup.get('username')?.setValue('');
        this.formGroup.get('username')?.markAsUntouched();
        this.formGroup.get('password')?.markAsUntouched();
    }

    private setUsernameLabelAndValidationMessages() {
        this.usernameLabel = this.isMobileLoginEnabled
            ? this.loginContentService.content.form['usernamemobilenumber']?.label
            : this.loginContentService.content.form['username']?.label;
        this.usernameValidations = this.isMobileLoginEnabled
            ? this.loginContentService.content.form['usernamemobilenumber']?.validation
            : this.loginContentService.content.form['username']?.validation;
    }

    private loginInternal(model: any, loginFailed: (data: any) => void) {
        this.user.triggerEvent(new UserLoggingInEvent());

        model.fingerprint = this.deviceFingerPrint;
        model.brandId = this.navigation.location.search.get('brandId');

        this.loginResource.login(model, { showSpinner: false, messageQueueScope: MessageScope.Login }).subscribe({
            next: async (data) => {
                this.loginStore.LastVisitor = model.username;
                if (data.isCompleted) {
                    this.trackingService.trackLoginSuccess({ hasEntryMessage: this.hasEntryMessage });
                }
                this.nativeApplication.sendToNative({
                    eventName: NativeEventType.PRELOGIN,
                    parameters: {
                        userName: model.username || model.connectCardNumber,
                        password: model.password || model.pin,
                        prefillUserName: this.shouldPrefillUsername,
                        rememberMe: !!this.loginConfig.rememberMeEnabled && model.rememberme,
                    },
                });
                if (model.fastloginenabled) {
                    this.wrapperSettingsService.update({
                        keepMeSignedInEnabled: model.fastloginenabled === FastLoginValue.KeepMeSignedInEnabled,
                        isTouchIDLoginEnabled: model.fastloginenabled === FastLoginValue.IsTouchIDEnabled,
                        isFaceIDLoginEnabled: model.fastloginenabled === FastLoginValue.IsFaceIDEnabled,
                    });
                    this.trackingService.trackFastLoginSetting(model.fastloginenabled);
                }
                await this.loginResponseHandlerService.handleResponse(data, this.responseGotoOptions);
                this.loginSpinnerService.hide();
            },
            error: (rejected) => {
                this.loginSpinnerService.hide();
                loginFailed(rejected);
            },
        });
    }

    private trackFailedPasswordValidations() {
        const passwordInputErrors = this.formGroup.get('password')?.errors;

        if (passwordInputErrors) {
            if (passwordInputErrors['digit']) {
                this.trackingService.trackPasswordError('Number');
            }

            if (passwordInputErrors['letter']) {
                this.trackingService.trackPasswordError('Letter');
            }

            if (passwordInputErrors['minlength'] || passwordInputErrors['maxlength']) {
                this.trackingService.trackPasswordError('MinMax');
            }
        }
    }

    private fastLoginInitValue(): FastLoginValue {
        if (this.wrapperSettingsService.current.keepMeSignedInEnabled) {
            return FastLoginValue.KeepMeSignedInEnabled;
        } else if (this.wrapperSettingsService.current.deviceTouchSupported && this.wrapperSettingsService.current.isTouchIDLoginEnabled) {
            if (
                this.deviceService.isiOS &&
                this.wrapperSettingsService.current.deviceFaceSupported &&
                this.wrapperSettingsService.current.isFaceIDLoginEnabled
            ) {
                return FastLoginValue.IsFaceIDEnabled;
            }
            return FastLoginValue.IsTouchIDEnabled;
        } else if (this.wrapperSettingsService.current.deviceFaceSupported && this.wrapperSettingsService.current.isFaceIDLoginEnabled) {
            return FastLoginValue.IsFaceIDEnabled;
        }

        return FastLoginValue.FastLoginDisabled;
    }

    //Browser autofill on some browsers does not trigger change on angular forms, so we set it manually in that case.
    private forceSetControlValue(event: Event) {
        const element = event.target as HTMLInputElement;
        const controlValue = this.formGroup.controls[element.name]?.value;

        if (element.value && !controlValue) {
            this.formGroup.controls[element.name]!.setValue(element.value);
        }
    }

    private createInputCheckInterval(usernameInput: HTMLInputElement, passwordInput: HTMLInputElement) {
        const usernameControlValue = this.formGroup.controls[usernameInput.name]?.value;
        const passwordControlValue = this.formGroup.controls[passwordInput.name]?.value;

        if (!usernameControlValue && !this.webWorkerService.getWorker(WorkerType.LoginUsernameInterval)) {
            this.webWorkerService.createWorker(WorkerType.LoginUsernameInterval, { interval: 500 }, () =>
                this.triggerInputValueChange(usernameInput, WorkerType.LoginUsernameInterval),
            );
        }

        if (!passwordControlValue && !this.webWorkerService.getWorker(WorkerType.LoginPasswordInterval)) {
            this.webWorkerService.createWorker(WorkerType.LoginPasswordInterval, { interval: 500 }, () =>
                this.triggerInputValueChange(passwordInput, WorkerType.LoginPasswordInterval),
            );
        }
    }

    private triggerInputValueChange(htmlElement: HTMLInputElement, workerType: WorkerType) {
        const value = htmlElement.value;

        if (value?.length > 0) {
            const event = this._doc.createEvent('TextEvent');
            event.initEvent('textInput', true, true);
            htmlElement.dispatchEvent(event);

            this.formGroup.controls[htmlElement.name]?.setValue(value);
            this.webWorkerService.removeWorker(workerType);
        }
    }

    private setLoginEntryMessages(): any {
        this.loginMessagesService.messagesLoaded
            .pipe(takeUntil(this.destroySubject))
            .subscribe((messages: Message[]) => this.onLoginMessagesLoaded(messages));

        if (this.loginMessageKey) {
            this.loginMessagesService.setLoginMessage(this.loginMessageKey);
        } else {
            this.loginMessagesService.evaluateUrlAndAddMessage();
        }
    }

    private trackTabbedLoginFailed() {
        const trackFormFields = [
            { formField: this.formGroup.get('username'), trackFieldName: 'Username' },
            { formField: this.formGroup.get('password'), trackFieldName: 'Password' },
        ];
        this.trackingService.trackTabbedLoginFailed(trackFormFields, this.selectedLoginOption);
    }

    private clearLoginInputValidators() {
        this.formGroup.get('username')?.clearValidators();
        this.formGroup.get('username')?.updateValueAndValidity();
        this.formGroup.get('password')?.clearValidators();
        this.formGroup.get('password')?.updateValueAndValidity();
    }

    getCopyrightText(itemText: string) {
        return itemText?.replace('{year}', this.dateTimeService.now().getFullYear().toString());
    }
}
