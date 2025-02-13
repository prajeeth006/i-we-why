import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { NotificationMessage, NotificationMessageContent } from '@frontend/vanilla/shared/rtms';
import { MockContext } from 'moxxi';

import { PageMock } from '../../../../core/test/browsercommon/page.mock';
import { NativeAppServiceMock } from '../../../../core/test/native-app/native-app.mock';
import { NavigationServiceMock } from '../../../../core/test/navigation/navigation.mock';
import { PublicCashierServiceMock } from '../../../../features/cashier/test/cashier.mock';
import { RtmsLayerBonusTeaserComponent } from '../../../../features/rtms-layer/src/components/rtms-layer-bonus-teaser.component';
import { RtmsClientConfigMock } from '../../../../shared/rtms/test/stubs/rtms-mocks';
import { BonusResourceServiceMock } from './bonus-resources.mock';

describe('RtmsLayerBonusTeaserComponent', () => {
    let fixtureComponent: ComponentFixture<RtmsLayerBonusTeaserComponent>;
    let component: RtmsLayerBonusTeaserComponent;
    let bonusResourceServiceMock: BonusResourceServiceMock;
    let navigationService: NavigationServiceMock;
    let cashierServiceMock: PublicCashierServiceMock;
    let spyOnClose: jasmine.Spy;

    beforeEach(() => {
        navigationService = MockContext.useMock(NavigationServiceMock);
        bonusResourceServiceMock = MockContext.useMock(BonusResourceServiceMock);
        cashierServiceMock = MockContext.useMock(PublicCashierServiceMock);
        MockContext.useMock(NativeAppServiceMock);
        MockContext.useMock(RtmsClientConfigMock);
        MockContext.useMock(PageMock);

        TestBed.overrideComponent(RtmsLayerBonusTeaserComponent, {
            set: {
                imports: [TrustAsHtmlPipe],
                schemas: [NO_ERRORS_SCHEMA],
                providers: [MockContext.providers],
            },
        });
    });

    function initComponent() {
        fixtureComponent = TestBed.createComponent(RtmsLayerBonusTeaserComponent);
        component = fixtureComponent.componentInstance;

        const notMessage: NotificationMessage = new NotificationMessage();
        notMessage.content = new NotificationMessageContent();
        notMessage.content.bonusHeader = 'Header message';
        notMessage.content.bonusImage = {
            src: 'image',
        };
        notMessage.bonusId = '5';
        notMessage.isBonusTncAccepted = true;
        notMessage.isNoDepositBonus = true;
        notMessage.bonusCode = 'ddaad';
        notMessage.offerId = '25';
        notMessage.isCampaignBonus = true;
        component.message = notMessage;
        spyOnClose = spyOn(component, 'close');

        component.ngOnInit();
    }

    it('decline', () => {
        initComponent();

        component.decline();

        expect(bonusResourceServiceMock.dropBonusOffer).toHaveBeenCalledWith({ bonusId: '5', agentName: 'System', reason: 'PLP' });

        bonusResourceServiceMock.dropBonusOffer.completeWith(true);

        expect(spyOnClose).toHaveBeenCalled();
    });

    describe('accept', () => {
        describe('bonus tnc is accepted', () => {
            it('should redirect to bonus page for no deposit bonus', () => {
                initComponent();

                component.accept();

                expect(navigationService.goTo).toHaveBeenCalledWith('en/test');
                expect(spyOnClose).toHaveBeenCalled();
            });

            it('should redirect to cashier for deposit bonus', () => {
                initComponent();
                component.message.isNoDepositBonus = false;

                component.accept();

                expect(cashierServiceMock.goToCashierDeposit).toHaveBeenCalledWith({
                    returnUrl: 'en/test',
                    skipQuickDeposit: true,
                    queryParameters: { bonusCodeForPrefill: 'ddaad' },
                });
                expect(spyOnClose).toHaveBeenCalled();
            });
        });

        describe('bonus tnc is not accepted', () => {
            it('should accept tnc bonus and redirect to bonus page for no deposit bonus', () => {
                initComponent();
                component.message.isBonusTncAccepted = false;

                component.accept();

                bonusResourceServiceMock.updateBonusTncAcceptance.completeWith(true);

                expect(bonusResourceServiceMock.updateBonusTncAcceptance).toHaveBeenCalledWith({
                    offerId: 25,
                    offerArc: 1,
                    isCampaignBonus: true,
                    tncAcceptanceFlag: true,
                });
                expect(navigationService.goTo).toHaveBeenCalledWith('en/test');
                expect(spyOnClose).toHaveBeenCalled();
            });

            it('should close overlay when tnc acceptance faild', () => {
                initComponent();
                component.message.isBonusTncAccepted = false;

                component.accept();

                bonusResourceServiceMock.updateBonusTncAcceptance.completeWith(false);

                expect(bonusResourceServiceMock.updateBonusTncAcceptance).toHaveBeenCalledWith({
                    offerId: 25,
                    offerArc: 1,
                    isCampaignBonus: true,
                    tncAcceptanceFlag: true,
                });
                expect(spyOnClose).toHaveBeenCalled();
            });

            it('should accept tnc bonus and redirect to cashier for deposit bonus', () => {
                initComponent();
                component.message.isBonusTncAccepted = false;
                component.message.isNoDepositBonus = false;

                component.accept();

                bonusResourceServiceMock.updateBonusTncAcceptance.completeWith(true);

                expect(bonusResourceServiceMock.updateBonusTncAcceptance).toHaveBeenCalledWith({
                    offerId: 25,
                    offerArc: 1,
                    isCampaignBonus: true,
                    tncAcceptanceFlag: true,
                });
                expect(cashierServiceMock.goToCashierDeposit).toHaveBeenCalledWith({
                    returnUrl: 'en/test',
                    skipQuickDeposit: true,
                    queryParameters: { bonusCodeForPrefill: 'ddaad' },
                });
                expect(spyOnClose).toHaveBeenCalled();
            });
        });
    });
});
