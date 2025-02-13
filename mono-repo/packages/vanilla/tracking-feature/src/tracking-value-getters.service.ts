import { Injectable, inject } from '@angular/core';

import {
    CookieName,
    CookieService,
    DeviceService,
    FrontendHelperService,
    NativeAppService,
    NavigationService,
    Page,
    ParsedUrl,
    UrlService,
    UserService,
    WINDOW,
} from '@frontend/vanilla/core';
import { BalancePropertiesConfig } from '@frontend/vanilla/features/balance-properties';
import { firstValueFrom } from 'rxjs';

import { TrackingConfig } from './tracking.client-config';

/**
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class TrackingValueGettersService {
    private referrer: string;
    private entryUrl: ParsedUrl;
    readonly #window = inject(WINDOW);

    constructor(
        private trackingConfig: TrackingConfig,
        private user: UserService,
        private navigationService: NavigationService,
        private urlService: UrlService,
        private page: Page,
        private cookieService: CookieService,
        private deviceService: DeviceService,
        private nativeAppService: NativeAppService,
        private frontendHelperService: FrontendHelperService,
        private balancePropertiesConfig: BalancePropertiesConfig,
    ) {}

    accountId() {
        return this.user.accountId;
    }

    async userBalance() {
        if (this.user.isAuthenticated) {
            await firstValueFrom(this.balancePropertiesConfig.whenReady);
            return this.balancePropertiesConfig.balanceProperties.accountBalance;
        }
        return 0;
    }

    userCurrency() {
        return this.user.currency;
    }

    userCountry() {
        return this.user.country;
    }

    userGeoCountry() {
        return this.user.geoCountry;
    }

    userLoyalty() {
        return this.user.loyalty || '';
    }

    userCustomerId() {
        return this.user.customerId;
    }

    userSegmentId() {
        return this.user.segmentId;
    }

    userStage() {
        return this.user.lifeCycleStage || '';
    }

    userPrestage() {
        return this.user.eWarningVip || '';
    }

    userMicroSegmentId() {
        return this.user.microSegmentId;
    }

    userChurnRate() {
        return this.user.churnRate;
    }

    userFutureValue() {
        return this.user.futureValue;
    }

    userPotentialVip() {
        return this.user.potentialVip;
    }

    userAgent() {
        return this.#window.navigator.userAgent;
    }

    isAuthenticated() {
        return !!this.user.username;
    }

    async hasPositiveBalance() {
        if (this.user.isAuthenticated) {
            await firstValueFrom(this.balancePropertiesConfig.whenReady);
            return this.balancePropertiesConfig.balanceProperties.accountBalance > 0;
        }
        return false;
    }

    locationAbsUrl() {
        return this.removeNotTrackedQueryStrings(this.navigationService.location.absUrl(), true);
    }

    locationHost() {
        return this.navigationService.location.host();
    }

    locationPathQueryAndFragment() {
        return TrackingValueGettersService.removeLeadingSlashes(this.removeNotTrackedQueryStrings(this.navigationService.location.url(), false));
    }

    browserScreenResolution() {
        if (this.#window) {
            const { width, height } = this.deviceService.windowRect();
            return `${width}x${height}`;
        } else {
            return `${this.deviceService.displayWidth}x${this.deviceService.displayHeight}`;
        }
    }

    redirectedFrom() {
        return this.cookieService.get(CookieName.RedirexOriginal);
    }

    trackerID() {
        return this.cookieService.get(CookieName.TrackerId);
    }

    trackingAffiliate() {
        return this.cookieService.get(CookieName.TrackingAffiliate);
    }

    abTestGroup() {
        return this.cookieService.get(CookieName.MmcoreBwinvar);
    }

    pageName() {
        return this.getPageName();
    }

    pageReferrer() {
        return this.removeNotTrackedQueryStrings(this.referrer, true);
    }

    browserOrientation() {
        return this.deviceService.currentOrientation;
    }

    nativeMode() {
        return this.nativeAppService.nativeMode;
    }

    isTouch() {
        return this.deviceService.isTouch;
    }

    cpuCores() {
        return this.deviceService.cpuCores;
    }

    cpuMaxFrequency() {
        return this.deviceService.cpuMaxFrequency;
    }

    totalRam() {
        return this.deviceService.totalRam;
    }

    model() {
        return this.deviceService.model;
    }

    nightMode() {
        return `Night Mode ${parseInt(this.cookieService.get(CookieName.DarkMode)) > 0 ? 'ON' : 'OFF'}`;
    }

    userKnown() {
        return !!this.cookieService.get(CookieName.LastVisitor);
    }

    internalCampaign() {
        return this.navigationService.location.search.get('trid');
    }

    deviceId() {
        return this.cookieService.get(CookieName.DeviceId);
    }

    lang() {
        return this.page.languageCode;
    }

    culture() {
        return this.page.lang;
    }

    frontend() {
        return this.frontendHelperService.getFrontendDescription();
    }

    medium() {
        return this.getMedium();
    }

    domain() {
        return this.page.domain;
    }

    fullEntryUrl() {
        return this.entryUrl;
    }

    entryUrlReferrer() {
        return this.cookieService.get(CookieName.EntryUrlReferrer);
    }

    packageVersion(packageName: string) {
        const nativeWindow = <any>this.#window;
        if (nativeWindow.VERSIONS) {
            return nativeWindow.VERSIONS[packageName];
        }
    }

    setReferrer(referrer: string) {
        this.referrer = referrer;
    }

    setEntryUrl(entryUrl: string) {
        this.entryUrl = this.urlService.parse(entryUrl);
    }

    terminalId() {
        return this.cookieService.get(CookieName.TerminalId);
    }

    shopId() {
        return this.cookieService.get(CookieName.ShopId) || '0';
    }

    terminalType() {
        return this.nativeAppService.applicationName;
    }

    isTerminal() {
        return this.nativeAppService.isTerminal;
    }

    private removeNotTrackedQueryStrings(url: string, absolute: boolean): string {
        if (!url) {
            return '';
        }

        const parsedUrl = this.urlService.parse(url);
        for (const notTrackedQueryString of this.trackingConfig.notTrackedQueryStrings || []) {
            parsedUrl.search.delete(notTrackedQueryString);
        }
        return decodeURIComponent(absolute ? parsedUrl.absUrl() : parsedUrl.url());
    }

    private getPageName() {
        const langPrefix = `/${this.page.lang}`;
        const path = this.navigationService.location.path();
        const lowerCasePath = path.toLowerCase();
        let pageName: string;
        if (lowerCasePath.indexOf(langPrefix) === 0) {
            const result = path.substring(langPrefix.length);
            if (result === '') {
                pageName = '/';
            } else {
                pageName = result;
            }
        } else {
            pageName = path;
        }

        pageName = TrackingValueGettersService.removeLeadingSlashes(pageName);
        return pageName;
    }

    private getMedium() {
        if (this.nativeAppService.nativeMode === 'Unknown') {
            if (this.deviceService.isTablet) return 'tablet web';
            else if (this.deviceService.isMobile) return 'mobile web';
            else return 'desktop web';
        }

        let os = '';
        if (this.nativeAppService.isNativeApp || this.nativeAppService.isNativeWrapper) {
            if (this.deviceService.isiOS) os = 'ios';
            if (this.deviceService.isChrome) os = 'android';
        }

        return `${this.nativeAppService.nativeMode} ${os}`;
    }

    private static removeLeadingSlashes(input: string) {
        return input.replace(/^\/*/, '');
    }
}
