import { Injectable } from '@angular/core';

import { DSL_NOT_READY, DslCacheService, DslRecordable, DslRecorderService, DslValuesProvider, UserService } from '@frontend/vanilla/core';
import { KycStatus, KycStatusService } from '@frontend/vanilla/shared/kyc';

@Injectable()
export class KycStatusDslValuesProvider implements DslValuesProvider {
    private kycStatus: KycStatus | null = null;

    constructor(
        private dslRecorderService: DslRecorderService,
        private kycStatusService: KycStatusService,
        private user: UserService,
        dslCacheService: DslCacheService,
    ) {
        this.kycStatusService.kycStatus.subscribe((kycStatus: KycStatus | null) => {
            this.kycStatus = kycStatus;

            dslCacheService.invalidate(['kycStatus']);
        });
    }

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            KycStatus: this.dslRecorderService
                .createRecordable('kycStatus')
                .createFunction({
                    name: 'GetAdditionalKycInfo',
                    get: (key: string) =>
                        this.getCurrentValue('additionalKycInfo')?.find(
                            (info: { Key: string; Value: string }) => info.Key?.toLowerCase() === key.toLowerCase(),
                        )?.Value || '',
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createFunction({
                    name: 'GetAdditionalRibbonInfo',
                    get: (key: string) => {
                        const additionalRibbonInfo = this.getCurrentValue('additionalRibbonInfo');

                        if (Array.isArray(additionalRibbonInfo)) {
                            return (
                                additionalRibbonInfo.find((info: { Key: string; Value: string }) => info.Key?.toLowerCase() === key.toLowerCase())
                                    ?.Value || ''
                            );
                        }

                        return '';
                    },
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'AccountStatus',
                    get: () => this.getCurrentValue('accountStatus'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'AccountVerificationIsRequired',
                    get: () => this.getCurrentValue('accountVerificationIsRequired'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'AddressVerificationStatus',
                    get: () => this.getCurrentValue('addressVerificationStatus'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'AgeVerificationGraceDays',
                    get: () => this.getCurrentValue('ageVerificationGraceDays'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'AgeVerificationGracePeriod',
                    get: () => this.getCurrentValue('ageVerificationGracePeriod'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'AgeVerificationStatus',
                    get: () => this.getCurrentValue('ageVerificationStatus'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'AmlVerificationStatus',
                    get: () => this.getCurrentValue('amlVerificationStatus'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'BankAccountIsRegistered',
                    get: () => this.getCurrentValue('bankAccountIsRegistered'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'BankIdVerificationStatus',
                    get: () => this.getCurrentValue('bankIdVerificationStatus'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'BlackListVerificationStatus',
                    get: () => this.getCurrentValue('blackListVerificationStatus'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'Custom3',
                    get: () => this.getCurrentValue('custom3'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'Custom4',
                    get: () => this.getCurrentValue('custom4'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'DepositGraceDays',
                    get: () => this.getCurrentValue('depositGraceDays'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'DepositSuppressed',
                    get: () => this.getCurrentValue('depositSuppressed'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'DocsPendingWith',
                    get: () => this.getCurrentValue('docsPendingWith'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'DocumentUploadStatusIsPending',
                    get: () => this.getCurrentValue('documentUploadStatusIsPending'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'EmailVerificationStatus',
                    get: () => this.getCurrentValue('emailVerificationStatus'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'GraceDaysBeforeNextAction',
                    get: () => this.getCurrentValue('graceDaysBeforeNextAction'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'GraceDaysUnit',
                    get: () => this.getCurrentValue('graceDaysUnit'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'GraceDaysUnitDivisor',
                    get: () => {
                        const unit = this.getCurrentValue('graceDaysUnit') as string;
                        if (unit?.toLowerCase() == 'hours') {
                            return 24;
                        }
                        return 1;
                    },
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'IdVerificationGraceDays',
                    get: () => this.getCurrentValue('idVerificationGraceDays'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'IdVerificationStatus',
                    get: () => this.getCurrentValue('idVerificationStatus'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'IsBlackListAttempted',
                    get: () => this.getCurrentValue('isBlackListAttempted'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'IsCommVerified',
                    get: () => this.getCurrentValue('isCommVerified'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'IsEmailVerified',
                    get: () => this.getCurrentValue('isEmailVerified'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'IsF2FVerificationRequired',
                    get: () => this.getCurrentValue('f2FVerificationRequired'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'IsKycStarted',
                    get: () => this.getCurrentValue('isKycStarted'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'IsMobileNumberVerified',
                    get: () => this.getCurrentValue('isMobileNumberVerified'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'IsPartiallyVerified',
                    get: () => this.getCurrentValue('partiallyVerified'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'IsTransitionPlayer',
                    get: () => this.getCurrentValue('isTransitionPlayer'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'KycAttempts',
                    get: () => this.getCurrentValue('kycAttempts'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'KycAuthenticationStatus',
                    get: () => this.getCurrentValue('kycAuthenticationStatus'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'KycMaxAttempts',
                    get: () => this.getCurrentValue('kycMaxAttempts'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'IsKycMaxAttemptsReached',
                    get: () => this.getCurrentValue('kycMaxAttemptsReached'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'KycVerified',
                    get: () => this.getCurrentValue('kycVerified'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'PersonalIdVerificationStatus',
                    get: () => this.getCurrentValue('personalIdVerificationStatus'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'RibbonStatusCode',
                    get: () => this.getCurrentValue('ribbonStatusCode'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'RibbonStatusMessage',
                    get: () => this.getCurrentValue('ribbonStatusMessage'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'SecretPinVerificationStatus',
                    get: () => this.getCurrentValue('secretPinVerificationStatus'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'SsnVerificationAttempts',
                    get: () => this.getCurrentValue('ssnVerificationAttempts'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'SsnVerificationMaxAttempts',
                    get: () => this.getCurrentValue('ssnVerificationMaxAttempts'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'IsSsnVerificationMaxAttemptsReached',
                    get: () => this.getCurrentValue('ssnVerificationMaxAttemptsReached'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'SsnVerificationStatus',
                    get: () => this.getCurrentValue('ssnVerificationStatus'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'ThirdPartyVerificationStatus',
                    get: () => this.getCurrentValue('thirdPartyVerificationStatus'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'UserHasBonuses',
                    get: () => this.getCurrentValue('userHasBonuses'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'VerificationDaysLeft',
                    get: () => this.getCurrentValue('verificationDaysLeft'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'VerificationStatus',
                    get: () => this.getCurrentValue('verificationStatus'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'VerificationType',
                    get: () => this.getCurrentValue('verificationType'),
                    deps: ['kycStatus', 'user.isAuthenticated'],
                }),
        };
    }

    private getCurrentValue(property: string) {
        if (!this.user.isAuthenticated) {
            return KycStatusService.UnauthKycStatus[property];
        }

        return this.kycStatus ? this.kycStatus[property] : DSL_NOT_READY;
    }
}
