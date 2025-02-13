import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { KycStatus } from '@frontend/vanilla/shared/kyc';
import { MockContext } from 'moxxi';

import { TooltipsConfigMock } from '../../../../shared/tooltips/test/tooltips-content.mock';
import { TooltipsServiceMock } from '../../../../shared/tooltips/test/tooltips-service.mock';
import { BalanceBreakdownComponent } from '../../../balance-breakdown/src/balance-breakdown.component';
import { BalanceBreakdownServiceMock } from '../../../balance-breakdown/test/balance-breakdown.service.mock';
import { BonusBalanceServiceMock } from '../../../bonus-balance/test/bonus-balance.mock';
import { KycStatusServiceMock } from '../../../kyc/test/kyc.mocks';
import { BalanceBreakdownContentMock } from './balance-breakdown-content.mock';

describe('BalanceBreakdownComponent', () => {
    let fixture: ComponentFixture<BalanceBreakdownComponent>;
    let component: BalanceBreakdownComponent;
    let balanceBreakdownContent: BalanceBreakdownContentMock;
    let balanceBreakdownServiceMock: BalanceBreakdownServiceMock;
    let bonusBalanceServiceMock: BonusBalanceServiceMock;
    let kycStatusServiceMock: KycStatusServiceMock;

    const KycStatusObj: KycStatus = {
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
    beforeEach(() => {
        balanceBreakdownServiceMock = MockContext.useMock(BalanceBreakdownServiceMock);
        bonusBalanceServiceMock = MockContext.useMock(BonusBalanceServiceMock);
        balanceBreakdownContent = MockContext.useMock(BalanceBreakdownContentMock);
        MockContext.useMock(TooltipsServiceMock);
        MockContext.useMock(TooltipsConfigMock);
        kycStatusServiceMock = MockContext.useMock(KycStatusServiceMock);
        TestBed.configureTestingModule({
            providers: [MockContext.providers],
            schemas: [NO_ERRORS_SCHEMA],
        });

        fixture = TestBed.createComponent(BalanceBreakdownComponent);
        component = fixture.componentInstance;
    });

    describe('init', () => {
        it('should refresh bonus balance', fakeAsync(() => {
            fixture.detectChanges();
            balanceBreakdownContent.whenReady.next();
            kycStatusServiceMock.kycStatus.next(KycStatusObj);
            tick();
            expect(bonusBalanceServiceMock.refresh).toHaveBeenCalled();
        }));
    });

    describe('getItemComponent()', () => {
        it('should get component templates', () => {
            fixture.detectChanges();

            component.getItemComponent('componentType');

            expect(balanceBreakdownServiceMock.getBalanceBreakdownComponent).toHaveBeenCalledWith('componentType');
        });
    });
});
