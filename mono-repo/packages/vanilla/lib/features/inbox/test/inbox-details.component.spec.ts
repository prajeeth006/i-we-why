import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { OfferStatus } from '@frontend/vanilla/shared/offers';
import { MockContext } from 'moxxi';

import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { ProductHomepagesConfigMock } from '../../../core/test/products/product-homepages.client-config.mock';
import { KycStatusServiceMock } from '../../kyc/test/kyc.mocks';
import { InboxDetailsComponent } from '../src/components/inbox-details.component';
import { CtaAction, CtaActionType } from '../src/inbox.models';
import { InboxMessage, MessageContent } from '../src/services/inbox.models';
import { InboxConfigMock } from './inbox.client-config.mock';
import { InboxCoreServiceMock } from './inbox.mock';
import { CrappyInboxServiceMock, InboxTrackingServiceMock } from './inbox.mocks';

describe('InboxDetailsComponent', () => {
    let fixture: ComponentFixture<InboxDetailsComponent>;
    let component: InboxDetailsComponent;
    let navigationServiceMock: NavigationServiceMock;
    let inboxClientConfigMock: InboxConfigMock;
    let trackingServiceMock: InboxTrackingServiceMock;
    let kycStatusServiceMock: KycStatusServiceMock;
    let productHomepagesConfigMock: ProductHomepagesConfigMock;
    let inboxServiceMock: InboxCoreServiceMock;

    beforeEach(() => {
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        inboxClientConfigMock = MockContext.useMock(InboxConfigMock);
        trackingServiceMock = MockContext.useMock(InboxTrackingServiceMock);
        kycStatusServiceMock = MockContext.useMock(KycStatusServiceMock);
        productHomepagesConfigMock = MockContext.useMock(ProductHomepagesConfigMock);
        inboxServiceMock = MockContext.useMock(InboxCoreServiceMock);
        MockContext.useMock(CrappyInboxServiceMock);
        MockContext.useMock(NativeAppServiceMock);

        TestBed.overrideComponent(InboxDetailsComponent, {
            set: {
                schemas: [NO_ERRORS_SCHEMA],
                providers: [MockContext.providers],
            },
        });
    });

    function initComponent() {
        fixture = TestBed.createComponent(InboxDetailsComponent);
        component = fixture.componentInstance;
    }

    it('should create component successfully, properties and functions are defined', () => {
        initComponent();

        expect(component.ngOnChanges).toBeDefined();
        expect(component.inboxCtaActions).toBeDefined();
    });

    it('should action emit when hideInbox action passed on inboxCtaActions', () => {
        initComponent();
        spyOn(component.action, 'emit');
        const action: CtaAction = { type: CtaActionType.HideInbox };

        component.inboxCtaActions(action);

        expect(component.action.emit).toHaveBeenCalledWith(action);
    });

    it('should update message.sourceStatus when claimOfferSuccess action passed on inboxCtaActions', () => {
        initComponent();
        component.message = new InboxMessage();
        const message = new InboxMessage();
        message.sourceStatus = OfferStatus.OFFER_NEW;
        const action: CtaAction = { type: CtaActionType.ClaimOfferSuccess, value: { status: OfferStatus.OPTEDIN } };

        component.inboxCtaActions(action);

        expect(component.message.sourceStatus).toEqual(OfferStatus.OPTEDIN);
    });

    it('should update message.sourceStatus to OFFER_CLAIMED when claimOfferSuccess action passed on inboxCtaActions', () => {
        initComponent();
        component.message = new InboxMessage();
        const message = new InboxMessage();
        message.sourceStatus = OfferStatus.OFFER_NEW;
        const action: CtaAction = { type: CtaActionType.ClaimOfferSuccess, value: { status: OfferStatus.OFFER_CLAIMED } };

        component.inboxCtaActions(action);

        expect(component.message.sourceStatus).toEqual(OfferStatus.OFFER_CLAIMED);
    });

    it('should update message.desktopSectionGamesViewModel on ngOnChanges', () => {
        initComponent();
        const message = getMessageMock();
        const content = <any>{ formContent: {}, title: 'title', messages: {}, form: {} };
        component.message = message;
        component.content = content;

        triggerOnChanges();

        expect(component.message.desktopSectionGamesViewModel[0]?.title).toEqual(message.desktopSectionGamesPairs[0].key);
        expect(component.message.desktopSectionGamesViewModel[1]?.title).toEqual(message.desktopSectionGamesPairs[1].key);
        expect(component.message.desktopSectionGamesViewModel[0]?.value).toEqual('title1, title2');
        expect(component.message.desktopSectionGamesViewModel[1]?.value).toEqual('title3, title4');
    });

    it('should update message.mobileSectionGamesViewModel on ngOnChanges', () => {
        initComponent();
        const message = getMessageMock();
        const content = <any>{ formContent: {}, title: 'title', messages: {}, form: {} };
        component.message = message;
        component.content = content;

        triggerOnChanges();

        expect(component.message.mobileSectionGamesViewModel[0]?.title).toEqual(message.mobileSectionGamesPairs[0].key);
        expect(component.message.mobileSectionGamesViewModel[1]?.title).toEqual(message.mobileSectionGamesPairs[1].key);
        expect(component.message.mobileSectionGamesViewModel[0]?.value).toEqual('title5, title6');
        expect(component.message.mobileSectionGamesViewModel[1]?.value).withContext('title9, title10').toEqual('title7, title8');
    });

    it('should set mobileGameTitles if mobileGameList.length > 0 on ngOnChanges', () => {
        initComponent();
        const message = getMessageMock();
        const content = <any>{ formContent: {}, title: 'title', messages: {}, form: {} };
        component.message = message;
        component.content = content;

        triggerOnChanges();

        expect(component.message.mobileGameTitles).toEqual('_key3_, _key4_');
    });

    it('should set showJumioTriggerButton to false if config triggerJumioFromPlayerInbox == false', () => {
        inboxClientConfigMock.triggerJumioFromPlayerInbox = false;
        initComponent();
        const message = new InboxMessage();
        message.content = new MessageContent();
        message.messageSource = 'COMPLIANCE';
        component.message = message;
        component.content = <any>{ formContent: {}, title: 'title', messages: {}, form: {} };

        triggerOnChanges();

        expect(component.showJumioTriggerButton).toBeFalse();
    });

    it('should set showJumioTriggerButton to false if messageSource != COMPLIANCE', () => {
        inboxClientConfigMock.triggerJumioFromPlayerInbox = true;
        initComponent();
        const message = new InboxMessage();
        message.content = new MessageContent();
        message.messageSource = 'NOT COMPLIANCE';
        component.message = message;
        component.content = <any>{ formContent: {}, title: 'title', messages: {} };

        triggerOnChanges();

        expect(component.showJumioTriggerButton).toBeFalse();
    });

    it('should set showJumioTriggerButton to false if kycVerified == true', () => {
        inboxClientConfigMock.triggerJumioFromPlayerInbox = true;
        initComponent();
        const message = new InboxMessage();
        message.content = new MessageContent();
        message.messageSource = 'COMPLIANCE';
        component.message = message;
        component.content = <any>{ formContent: {}, title: 'title', messages: {} };

        triggerOnChanges();
        kycStatusServiceMock.kycStatus.next(<any>{ kycVerified: true });

        expect(component.showJumioTriggerButton).toBeFalse();
    });

    it('should set showJumioTriggerButton to true', () => {
        inboxClientConfigMock.triggerJumioFromPlayerInbox = true;
        initComponent();
        const message = new InboxMessage();
        message.content = new MessageContent();
        message.messageSource = 'COMPLIANCE';
        component.message = message;
        component.content = <any>{ formContent: {}, title: 'title', messages: {} };

        triggerOnChanges();
        kycStatusServiceMock.kycStatus.next(<any>{ kycVerified: false });

        expect(component.showJumioTriggerButton).toBeTrue();
    });

    it('should go to jumiokyc on triggerJumio', fakeAsync(() => {
        inboxClientConfigMock.triggerJumioFromPlayerInbox = true;
        inboxClientConfigMock.jumioKycUrl = 'jumioKycUrl';
        initComponent();

        trackingServiceMock.trackKycVerifyClicked.and.returnValue(Promise.resolve());

        component.triggerJumio();
        tick();

        expect(inboxServiceMock.close).toHaveBeenCalled();
        expect(trackingServiceMock.trackKycVerifyClicked).toHaveBeenCalled();
        expect(navigationServiceMock.goTo).toHaveBeenCalledWith(productHomepagesConfigMock.portal + inboxClientConfigMock.jumioKycUrl);
    }));

    it('should showCallToActionButton be true by default', () => {
        initComponent();

        expect(component.showCallToActionButton).toBeTrue();
    });

    it('should showCallToActionButton be false if triggerJumioFromPlayerInbox enabled and messageSource == COMPLIANCE', () => {
        inboxClientConfigMock.triggerJumioFromPlayerInbox = true;
        initComponent();
        const message = new InboxMessage();
        message.content = new MessageContent();
        message.messageSource = 'COMPLIANCE';
        component.message = message;
        component.content = <any>{ formContent: {}, title: 'title', messages: {} };

        triggerOnChanges();
        kycStatusServiceMock.kycStatus.next(null);

        expect(component.showCallToActionButton).toBeFalse();
        expect(component.showJumioTriggerButton).toBeFalse();
    });

    describe('toggleTacExpanded()', () => {
        beforeEach(() => {
            initComponent();
            component.message = new InboxMessage();
            component.message.isTnCViewed = undefined;
        });

        it('should set isTacExpanded and message.isTnCViewed to true', () => {
            component.isTacExpanded = false;
            component.toggleTacExpanded();

            expect(component.isTacExpanded).toBeTrue();
            expect(component.message.isTnCViewed).toBeTrue();
        });

        it('should set isTacExpanded to false and message.isTnCViewed to true', () => {
            component.isTacExpanded = true;
            component.toggleTacExpanded();

            expect(component.isTacExpanded).toBeFalse();
            expect(component.message.isTnCViewed).toBeTrue();
        });
    });

    describe('Tnc', () => {
        beforeEach(() => {
            initComponent();
            const message = new InboxMessage();
            message.content = {
                detailTitle: 'title',
                detailImage: {
                    detailImage: 'https://scmedia.partypremium.com/$-$/b24fa7398a704604889afd4aaa672dba.jpg?p=w430h153camiddlecentercmcrop',
                    detailImageLink: 'inbox://cta/#MessageType#/#SourceStatus#/#SOURCE_REFERENCE_ID#',
                    detailImageAttrs: {
                        href: 'inbox://cta/#MessageType#/#SourceStatus#/#SOURCE_REFERENCE_ID#',
                    },
                },
                detailDescription: '<p>description</p>',
                detailCallToAction: `<a href="inbox://cta/#MessageType#/#SourceStatus#/3990231" class="btn-s3">Deposit Now!</a>`,
                shortImage: 'https://scmedia.bwin.com/$-$/9ba5c6fc919543b5bcd4dbd0491c162a.jpg?p=w50h50camiddlecentercmcrop',
                snippetTitle: 'snippet title',
                snippetDescription: '<p>snippet description </p>',
                snippetCallToAction: '<a href="inbox://cta/#MessageType#/#SourceStatus#/#SOURCE_REFERENCE_ID#" class="btn-s3">Claim Now!</a>',
                showManualTermsAndConditions: true,
                isManualTermsAndConditionsEmpty: false,
                expandTermsAndConditionsByDefault: false,
                manualTermsAndConditions: 'manual terms text',
                headerTermsAndConditionsInbox: 'Inbox key terms and conditions',
                inboxImageTitleText: 'image title',
                inboxImageIntroductoryText: 'image intro',
                inboxImageSubtitleText: 'image sub-title',
                inboxImageTitleFontSize: 'SMALL',
                inboxImageTextAlignment: 'RIGHT',
            };
            message.isTnCTemplate = true;
            message.tnCData = 'terms and conditions text';
            component.message = message;
            component.content = {
                form: {},
                title: 'title',
                children: {},
                links: {},
                messages: {
                    ManualTermsAndConditions: 'Manual terms title',
                    TermsAndConditions: 'Terms and conditions title',
                },
            };
        });

        it('show manual Tnc when manual and bonus tnc is set', () => {
            triggerOnChanges();

            showManualTermsAndConditions();
        });

        it('show manual Tnc when only manual are set', () => {
            component.message.isTnCTemplate = false;

            triggerOnChanges();

            showManualTermsAndConditions();
        });

        it('show bonus Tnc when only bonus is set', () => {
            component.message.content.showManualTermsAndConditions = false;

            triggerOnChanges();

            showBonusTermsAndConditions();

            component.message.content.showManualTermsAndConditions = true;
            component.message.content.isManualTermsAndConditionsEmpty = true;

            triggerOnChanges();

            showBonusTermsAndConditions();
        });

        describe('should not show Tnc', () => {
            it('showManualTermsAndConditions = false and isTnCTemplate = false', () => {
                component.message.content.showManualTermsAndConditions = false;
                component.message.isTnCTemplate = false;

                triggerOnChanges();

                shouldNotShowTnc();
            });

            it('showManualTermsAndConditions = false and tnCData is empty', () => {
                component.message.content.showManualTermsAndConditions = false;
                component.message.tnCData = '';

                triggerOnChanges();

                shouldNotShowTnc();
            });

            it('isManualTermsAndConditionsEmpty = true and tnCData is empty', () => {
                component.message.content.isManualTermsAndConditionsEmpty = true;
                component.message.tnCData = '';

                triggerOnChanges();

                shouldNotShowTnc();
            });

            it('isManualTermsAndConditionsEmpty = true and isTnCTemplate = false', () => {
                component.message.content.isManualTermsAndConditionsEmpty = true;
                component.message.isTnCTemplate = false;

                triggerOnChanges();

                shouldNotShowTnc();
            });
        });

        describe('isTacExpanded', () => {
            it('should not expand because expandTermsAndConditionsByDefault is false', () => {
                triggerOnChanges();

                expect(component.isTacExpanded).toBeFalse();
            });

            it('should not expand bause showManualTermsAndConditions is false', () => {
                component.message.content.showManualTermsAndConditions = false;
                component.message.content.expandTermsAndConditionsByDefault = true;
                triggerOnChanges();

                expect(component.isTacExpanded).toBeFalse();
            });

            it('should expand', () => {
                component.message.content.expandTermsAndConditionsByDefault = true;
                triggerOnChanges();

                expect(component.isTacExpanded).toBeTrue();
            });
        });
    });

    function triggerOnChanges() {
        component.ngOnChanges({
            message: new SimpleChange(null, component.message, true),
        });
    }

    function showManualTermsAndConditions() {
        expect(component.showTermsAndConditions).toBeTrue();
        expect(component.termsAndConditionsTitle).toBe('Manual terms title');
        expect(component.termsAndConditionsData).toBe('manual terms text');
    }

    function showBonusTermsAndConditions() {
        expect(component.showTermsAndConditions).toBeTrue();
        expect(component.termsAndConditionsTitle).toBe('Terms and conditions title');
        expect(component.termsAndConditionsData).toBe('terms and conditions text');
    }

    function shouldNotShowTnc() {
        expect(component.showTermsAndConditions).toBeFalse();
    }

    function getMessageMock() {
        const message = new InboxMessage();
        message.content = new MessageContent();
        message.desktopSectionGamesPairs = [
            {
                key: 'key1',
                value: [{ title: 'title1' }, { title: 'title2' }],
            },
            {
                key: 'key2',
                value: [{ title: 'title3' }, { title: 'title4' }],
            },
        ];
        message.mobileSectionGamesPairs = [
            {
                key: 'key3',
                value: [{ title: 'title5' }, { title: 'title6' }],
            },
            {
                key: 'key4',
                value: [{ title: 'title7' }, { title: 'title8' }],
            },
            {
                key: 'key5',
                value: [{ title: 'title9' }, { title: 'title10' }],
            },
        ];

        message.desktopGameList = [
            {
                title: '_key1_',
            },
            {
                title: '_key2_',
            },
        ];

        message.mobileGameList = [
            {
                title: '_key3_',
            },
            {
                title: '_key4_',
            },
        ];

        return message;
    }
});
