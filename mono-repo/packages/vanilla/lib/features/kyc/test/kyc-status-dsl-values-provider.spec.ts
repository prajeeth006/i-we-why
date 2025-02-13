import { TestBed } from '@angular/core/testing';

import { DSL_NOT_READY, DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { KycStatus } from '@frontend/vanilla/shared/kyc';
import { MockContext } from 'moxxi';

import { DslCacheServiceMock } from '../../../core/test/dsl/dsl-cache.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { KycStatusDslValuesProvider } from '../../../features/kyc/src/kyc-status-dsl-values-provider';
import { KycStatusServiceMock } from './kyc.mocks';

describe('KycStatusDslValuesProvider', () => {
    let target: DslRecordable;
    let kycStatusServiceMock: KycStatusServiceMock;
    let dslCacheServiceMock: DslCacheServiceMock;
    let userServiceMock: UserServiceMock;

    beforeEach(() => {
        kycStatusServiceMock = MockContext.useMock(KycStatusServiceMock);
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, KycStatusDslValuesProvider],
        });

        const provider = TestBed.inject(KycStatusDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();
        target = provider.getProviders().KycStatus!;
    });

    describe('KycStatus', () => {
        it('should return default values is the user is not authenticated', () => {
            userServiceMock.isAuthenticated = false;

            expect(target['AccountStatus']).toBe('Unknown');
            expect(target['AccountVerificationIsRequired']).toBeFalse();
            expect(target['AddressVerificationStatus']).toBe('Unknown');
            expect(target['AgeVerificationGraceDays']).toBe(-1);
            expect(target['AgeVerificationGracePeriod']).toBe('Unknown');
            expect(target['AgeVerificationStatus']).toBe('Unknown');
            expect(target['AmlVerificationStatus']).toBe('Unknown');
            expect(target['BankAccountIsRegistered']).toBeFalse();
            expect(target['BankIdVerificationStatus']).toBe('Unknown');
            expect(target['BlackListVerificationStatus']).toBe('Unknown');
            expect(target['Custom3']).toBe('Unknown');
            expect(target['Custom4']).toBe('Unknown');
            expect(target['DepositGraceDays']).toBe(-1);
            expect(target['DepositSuppressed']).toBeFalse();
            expect(target['DocsPendingWith']).toBe('');
            expect(target['DocumentUploadStatusIsPending']).toBeFalse();
            expect(target['EmailVerificationStatus']).toBe('Unknown');
            expect(target['GetAdditionalKycInfo']).toEqual(jasmine.any(Function));
            expect(target['GetAdditionalRibbonInfo']).toEqual(jasmine.any(Function));
            expect(target['GraceDaysBeforeNextAction']).toBe(-1);
            expect(target['GraceDaysUnit']).toBe('Unknown');
            expect(target['IdVerificationGraceDays']).toBe(-1);
            expect(target['IdVerificationStatus']).toBe('Unknown');
            expect(target['IsBlackListAttempted']).toBeFalse();
            expect(target['IsCommVerified']).toBeFalse();
            expect(target['IsEmailVerified']).toBeFalse();
            expect(target['IsF2FVerificationRequired']).toBeFalse();
            expect(target['IsKycStarted']).toBeFalse();
            expect(target['IsMobileNumberVerified']).toBeFalse();
            expect(target['IsPartiallyVerified']).toBeFalse();
            expect(target['IsTransitionPlayer']).toBeFalse();
            expect(target['KycAttempts']).toBe(-1);
            expect(target['KycMaxAttempts']).toBe(-1);
            expect(target['IsKycMaxAttemptsReached']).toBeFalse();
            expect(target['KycVerified']).toBeFalse();
            expect(target['PersonalIdVerificationStatus']).toBe('Unknown');
            expect(target['RibbonStatusCode']).toBe('Unknown');
            expect(target['RibbonStatusMessage']).toBe('Unknown');
            expect(target['SecretPinVerificationStatus']).toBe('Unknown');
            expect(target['SsnVerificationAttempts']).toBe(-1);
            expect(target['SsnVerificationMaxAttempts']).toBe(-1);
            expect(target['IsSsnVerificationMaxAttemptsReached']).toBeFalse();
            expect(target['SsnVerificationStatus']).toBe('Unknown');
            expect(target['ThirdPartyVerificationStatus']).toBe('Unknown');
            expect(target['UserHasBonuses']).toBeFalse();
            expect(target['VerificationDaysLeft']).toBe(-1);
            expect(target['VerificationStatus']).toBe('Unknown');
            expect(target['VerificationType']).toBe('Unspecified');
        });

        it('should return not ready initially', () => {
            userServiceMock.isAuthenticated = true;

            expect(() => target['AccountStatus']).toThrowError(DSL_NOT_READY);
            expect(() => target['AccountVerificationIsRequired']).toThrowError(DSL_NOT_READY);
            expect(() => target['AddressVerificationStatus']).toThrowError(DSL_NOT_READY);
            expect(() => target['AgeVerificationGraceDays']).toThrowError(DSL_NOT_READY);
            expect(() => target['AgeVerificationGracePeriod']).toThrowError(DSL_NOT_READY);
            expect(() => target['AgeVerificationStatus']).toThrowError(DSL_NOT_READY);
            expect(() => target['AmlVerificationStatus']).toThrowError(DSL_NOT_READY);
            expect(() => target['BankAccountIsRegistered']).toThrowError(DSL_NOT_READY);
            expect(() => target['BankIdVerificationStatus']).toThrowError(DSL_NOT_READY);
            expect(() => target['BlackListVerificationStatus']).toThrowError(DSL_NOT_READY);
            expect(() => target['Custom3']).toThrowError(DSL_NOT_READY);
            expect(() => target['Custom4']).toThrowError(DSL_NOT_READY);
            expect(() => target['DepositGraceDays']).toThrowError(DSL_NOT_READY);
            expect(() => target['DepositSuppressed']).toThrowError(DSL_NOT_READY);
            expect(() => target['DocsPendingWith']).toThrowError(DSL_NOT_READY);
            expect(() => target['DocumentUploadStatusIsPending']).toThrowError(DSL_NOT_READY);
            expect(() => target['EmailVerificationStatus']).toThrowError(DSL_NOT_READY);
            expect(() => target['GraceDaysBeforeNextAction']).toThrowError(DSL_NOT_READY);
            expect(() => target['GraceDaysUnit']).toThrowError(DSL_NOT_READY);
            expect(() => target['IdVerificationGraceDays']).toThrowError(DSL_NOT_READY);
            expect(() => target['IdVerificationStatus']).toThrowError(DSL_NOT_READY);
            expect(() => target['IsBlackListAttempted']).toThrowError(DSL_NOT_READY);
            expect(() => target['IsCommVerified']).toThrowError(DSL_NOT_READY);
            expect(() => target['IsEmailVerified']).toThrowError(DSL_NOT_READY);
            expect(() => target['IsF2FVerificationRequired']).toThrowError(DSL_NOT_READY);
            expect(() => target['IsKycStarted']).toThrowError(DSL_NOT_READY);
            expect(() => target['IsMobileNumberVerified']).toThrowError(DSL_NOT_READY);
            expect(() => target['IsPartiallyVerified']).toThrowError(DSL_NOT_READY);
            expect(() => target['IsTransitionPlayer']).toThrowError(DSL_NOT_READY);
            expect(() => target['KycAttempts']).toThrowError(DSL_NOT_READY);
            expect(() => target['KycMaxAttempts']).toThrowError(DSL_NOT_READY);
            expect(() => target['IsKycMaxAttemptsReached']).toThrowError(DSL_NOT_READY);
            expect(() => target['KycVerified']).toThrowError(DSL_NOT_READY);
            expect(() => target['PersonalIdVerificationStatus']).toThrowError(DSL_NOT_READY);
            expect(() => target['RibbonStatusCode']).toThrowError(DSL_NOT_READY);
            expect(() => target['RibbonStatusMessage']).toThrowError(DSL_NOT_READY);
            expect(() => target['SecretPinVerificationStatus']).toThrowError(DSL_NOT_READY);
            expect(() => target['SsnVerificationAttempts']).toThrowError(DSL_NOT_READY);
            expect(() => target['SsnVerificationMaxAttempts']).toThrowError(DSL_NOT_READY);
            expect(() => target['IsSsnVerificationMaxAttemptsReached']).toThrowError(DSL_NOT_READY);
            expect(() => target['SsnVerificationStatus']).toThrowError(DSL_NOT_READY);
            expect(() => target['ThirdPartyVerificationStatus']).toThrowError(DSL_NOT_READY);
            expect(() => target['UserHasBonuses']).toThrowError(DSL_NOT_READY);
            expect(() => target['VerificationDaysLeft']).toThrowError(DSL_NOT_READY);
            expect(() => target['VerificationStatus']).toThrowError(DSL_NOT_READY);
            expect(() => target['VerificationType']).toThrowError(DSL_NOT_READY);
        });

        it('should get value once loaded', () => {
            userServiceMock.isAuthenticated = true;
            kycStatusServiceMock.kycStatus.next(KycStatus);

            expect(target['AccountStatus']).toBe('Account status');
            expect(target['AccountVerificationIsRequired']).toBeTrue();
            expect(target['AddressVerificationStatus']).toBe('Address');
            expect(target['AgeVerificationGraceDays']).toBe(1);
            expect(target['AgeVerificationGracePeriod']).toBe('1623753211986');
            expect(target['AgeVerificationStatus']).toBe('Age');
            expect(target['AmlVerificationStatus']).toBe('Success');
            expect(target['BankAccountIsRegistered']).toBeTrue();
            expect(target['BankIdVerificationStatus']).toBe('Bank Id');
            expect(target['BlackListVerificationStatus']).toBe('Success');
            expect(target['Custom3']).toBe('Verified');
            expect(target['Custom4']).toBe('Valid');
            expect(target['DepositGraceDays']).toBe(3);
            expect(target['DepositSuppressed']).toBeTrue();
            expect(target['DocsPendingWith']).toBe('Docs pending');
            expect(target['DocumentUploadStatusIsPending']).toBeFalse();
            expect(target['EmailVerificationStatus']).toBe('Email');
            expect(target['GetAdditionalKycInfo']).toEqual(jasmine.any(Function));
            expect(target['GetAdditionalRibbonInfo']).toEqual(jasmine.any(Function));
            expect(target['GraceDaysBeforeNextAction']).toBe(11);
            expect(target['GraceDaysUnit']).toBe('Grace');
            expect(target['IdVerificationGraceDays']).toBe(1);
            expect(target['IdVerificationStatus']).toBe('ID verification status');
            expect(target['IsBlackListAttempted']).toBeFalse();
            expect(target['IsCommVerified']).toBeFalse();
            expect(target['IsEmailVerified']).toBeTrue();
            expect(target['IsKycStarted']).toBeTrue();
            expect(target['IsMobileNumberVerified']).toBeTrue();
            expect(target['IsTransitionPlayer']).toBeTrue();
            expect(target['KycAttempts']).toBe(1);
            expect(target['KycAuthenticationStatus']).toBe('Authentication status');
            expect(target['KycMaxAttempts']).toBe(3);
            expect(target['IsKycMaxAttemptsReached']).toBeTrue();
            expect(target['KycVerified']).toBeFalse();
            expect(target['PersonalIdVerificationStatus']).toBe('Personal Id');
            expect(target['RibbonStatusCode']).toBe('0');
            expect(target['RibbonStatusMessage']).toBe('Success');
            expect(target['SecretPinVerificationStatus']).toBe('Secret Pin');
            expect(target['SsnVerificationAttempts']).toBe(1);
            expect(target['SsnVerificationMaxAttempts']).toBe(3);
            expect(target['IsSsnVerificationMaxAttemptsReached']).toBeTrue();
            expect(target['SsnVerificationStatus']).toBe('Ssn');
            expect(target['ThirdPartyVerificationStatus']).toBe('Third-party Status');
            expect(target['UserHasBonuses']).toBeFalse();
            expect(target['VerificationDaysLeft']).toBe(7);
            expect(target['VerificationStatus']).toBe('Verification Status');
            expect(target['VerificationType']).toBe('Verification Type');
        });
    });

    describe('watcher', () => {
        it('should invalidate cache and update value if there is kyc status event', () => {
            kycStatusServiceMock.kycStatus.next(KycStatus);

            expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith(['kycStatus']);
        });
    });

    const KycStatus: KycStatus = {
        accountStatus: 'Account status',
        accountVerificationIsRequired: true,
        additionalKycInfo: [],
        additionalRibbonInfo: [],
        addressVerificationStatus: 'Address',
        ageVerificationGraceDays: 1,
        ageVerificationGracePeriod: '1623753211986',
        ageVerificationStatus: 'Age',
        amlVerificationStatus: 'Success',
        bankAccountIsRegistered: true,
        bankIdVerificationStatus: 'Bank Id',
        blackListVerificationStatus: 'Success',
        createDate: '1623753211986',
        custom3: 'Verified',
        custom4: 'Valid',
        depositGraceDays: 3,
        depositSuppressed: true,
        docsPendingWith: 'Docs pending',
        documentUploadStatusIsPending: false,
        emailVerificationStatus: 'Email',
        f2FVerificationRequired: false,
        graceDaysBeforeNextAction: 11,
        graceDaysUnit: 'Grace',
        idVerificationGraceDays: 1,
        idVerificationStatus: 'ID verification status',
        idVerificationGracePeriod: '1623753211986',
        isBlackListAttempted: false,
        isCommVerified: false,
        isEmailVerified: true,
        isKycStarted: true,
        isMobileNumberVerified: true,
        isTransitionPlayer: true,
        kycAttempts: 1,
        kycAuthenticationStatus: 'Authentication status',
        kycMaxAttempts: 3,
        kycMaxAttemptsReached: true,
        kycVerified: false,
        partiallyVerified: false,
        personalIdVerificationStatus: 'Personal Id',
        ribbonStatusCode: '0',
        ribbonStatusMessage: 'Success',
        secretPinVerificationStatus: 'Secret Pin',
        ssnVerificationAttempts: 1,
        ssnVerificationMaxAttempts: 3,
        ssnVerificationMaxAttemptsReached: true,
        ssnVerificationStatus: 'Ssn',
        thirdPartyVerificationStatus: 'Third-party Status',
        userHasBonuses: false,
        verificationDaysLeft: 7,
        verificationStatus: 'Verification Status',
        verificationType: 'Verification Type',
    };
});
