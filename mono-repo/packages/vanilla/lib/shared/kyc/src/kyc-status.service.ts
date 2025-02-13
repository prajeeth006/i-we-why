import { Injectable, signal } from '@angular/core';

import { SharedFeaturesApiService, UserService } from '@frontend/vanilla/core';
import { BehaviorSubject, Observable, Subject, groupBy, mergeMap, throttleTime } from 'rxjs';

/**
 * @stable
 */
export interface KycStatus extends Record<string, any> {
    accountStatus: string;
    accountVerificationIsRequired: boolean;
    additionalKycInfo: { Key: ''; Value: '' }[];
    additionalRibbonInfo: { Key: ''; Value: '' }[];
    addressVerificationStatus: string;
    ageVerificationGraceDays: number;
    ageVerificationGracePeriod: string;
    ageVerificationStatus: string;
    amlVerificationStatus: string;
    bankAccountIsRegistered: boolean;
    bankIdVerificationStatus: string;
    blackListVerificationStatus: string;
    createDate: string;
    custom3: string;
    custom4: string;
    depositGraceDays: number;
    depositSuppressed: boolean;
    docsPendingWith: string;
    documentUploadStatusIsPending: boolean;
    emailVerificationStatus: string;
    f2FVerificationRequired: boolean;
    graceDaysBeforeNextAction: number;
    graceDaysUnit: string;
    idVerificationGraceDays: number;
    idVerificationStatus: string;
    idVerificationGracePeriod: string;
    isBlackListAttempted: boolean;
    isCommVerified: boolean;
    isEmailVerified: boolean;
    isKycStarted: boolean;
    isMobileNumberVerified: boolean;
    isTransitionPlayer: boolean;
    kycAttempts: number;
    kycAuthenticationStatus: string;
    kycMaxAttempts: number;
    kycMaxAttemptsReached: boolean;
    kycVerified: boolean;
    partiallyVerified: boolean;
    personalIdVerificationStatus: string;
    ribbonStatusCode: string;
    ribbonStatusMessage: string;
    secretPinVerificationStatus: string;
    ssnVerificationAttempts: number;
    ssnVerificationMaxAttempts: number;
    ssnVerificationMaxAttemptsReached: boolean;
    ssnVerificationStatus: string;
    thirdPartyVerificationStatus: string;
    userHasBonuses: boolean;
    verificationDaysLeft: number;
    verificationStatus: string;
    verificationType: string;
}

/**
 * Options to be passed to {@link KycStatusService#refresh}
 *
 * @experimental
 */
export interface KycStatusOptions extends Record<string, string | boolean | undefined> {
    /**
     * If provided, it will be passed to the document upload API.
     */
    useCase?: string;
    /**
     * if true it will try to fetch values from cache.
     */
    cached?: boolean;
}

/**
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class KycStatusService {
    readonly status = signal<KycStatus | null>(null);
    public static UnauthKycStatus: KycStatus = {
        accountStatus: 'Unknown',
        accountVerificationIsRequired: false,
        additionalKycInfo: [],
        additionalRibbonInfo: [],
        addressVerificationStatus: 'Unknown',
        ageVerificationGraceDays: -1,
        ageVerificationGracePeriod: 'Unknown',
        ageVerificationStatus: 'Unknown',
        amlVerificationStatus: 'Unknown',
        bankAccountIsRegistered: false,
        bankIdVerificationStatus: 'Unknown',
        blackListVerificationStatus: 'Unknown',
        createDate: 'Unknown',
        custom3: 'Unknown',
        custom4: 'Unknown',
        depositGraceDays: -1,
        depositSuppressed: false,
        docsPendingWith: '',
        documentUploadStatusIsPending: false,
        emailVerificationStatus: 'Unknown',
        f2FVerificationRequired: false,
        graceDaysBeforeNextAction: -1,
        graceDaysUnit: 'Unknown',
        idVerificationGraceDays: -1,
        idVerificationStatus: 'Unknown',
        idVerificationGracePeriod: 'Unknown',
        isBlackListAttempted: false,
        isCommVerified: false,
        isEmailVerified: false,
        isKycStarted: false,
        isMobileNumberVerified: false,
        isTransitionPlayer: false,
        kycAttempts: -1,
        kycAuthenticationStatus: 'Unknown',
        kycMaxAttempts: -1,
        kycMaxAttemptsReached: false,
        kycVerified: false,
        partiallyVerified: false,
        personalIdVerificationStatus: 'Unknown',
        ribbonStatusCode: 'Unknown',
        ribbonStatusMessage: 'Unknown',
        secretPinVerificationStatus: 'Unknown',
        ssnVerificationAttempts: -1,
        ssnVerificationMaxAttempts: -1,
        ssnVerificationMaxAttemptsReached: false,
        ssnVerificationStatus: 'Unknown',
        thirdPartyVerificationStatus: 'Unknown',
        userHasBonuses: false,
        verificationDaysLeft: -1,
        verificationStatus: 'Unknown',
        verificationType: 'Unspecified',
    };

    private kycStatusEvents = new BehaviorSubject<KycStatus | null>(null);
    private refreshSubject = new Subject<KycStatusOptions | undefined>();

    get kycStatus(): Observable<KycStatus | null> {
        return this.kycStatusEvents;
    }

    constructor(
        private apiService: SharedFeaturesApiService,
        private user: UserService,
    ) {
        this.refreshSubject
            .pipe(
                groupBy((kycStatusOptions) => JSON.stringify(kycStatusOptions)), // Group by kycStatusOptions value
                mergeMap((group) =>
                    group.pipe(
                        throttleTime(1000), // Apply throttle to each group
                    ),
                ),
            )
            .subscribe((kycStatusOptions) => {
                this.load(kycStatusOptions);
            });
    }

    /**
     * @description Will not call the API if user is not authenticated.
     *
     * @param kycStatusOptions Kyc options to be passed to kyc status api.
     */
    refresh(kycStatusOptions?: KycStatusOptions) {
        if (!this.user.isAuthenticated) {
            return;
        }

        this.refreshSubject.next(kycStatusOptions);
    }

    private load(kycStatusOptions?: KycStatusOptions) {
        if (this.user.isAuthenticated) {
            this.apiService
                .get('kycstatus', { useCase: kycStatusOptions?.useCase, cached: !!kycStatusOptions?.cached })
                .subscribe((status: KycStatus) => {
                    this.kycStatusEvents.next(status);
                    this.status.set(status);
                });
        }
    }
}
