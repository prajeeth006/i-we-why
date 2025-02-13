import { NO_ERRORS_SCHEMA, Type } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BalanceProperties, MenuContentItem, UtilsService } from '@frontend/vanilla/core';
import { Tooltip } from '@frontend/vanilla/shared/tooltips';
import { MockContext } from 'moxxi';
import { MockComponent } from 'ng-mocks';
import { BehaviorSubject, of } from 'rxjs';

import { TimerServiceMock } from '../../../../../core/src/browser/timer.mock';
import { CommonMessagesMock } from '../../../../../core/src/client-config/test/common-messages.mock';
import { TopLevelCookiesConfigMock } from '../../../../../core/test/browser/cookie.mock';
import { DeviceServiceMock } from '../../../../../core/test/browser/device.mock';
import { MockDslPipe } from '../../../../../core/test/browser/dsl.pipe.mock';
import { DslServiceMock } from '../../../../../core/test/dsl/dsl.mock';
import { IntlServiceMock } from '../../../../../core/test/intl/intl.mock';
import { MenuActionsServiceMock } from '../../../../../core/test/menu-actions/menu-actions.mock';
import { UserServiceMock } from '../../../../../core/test/user/user.mock';
import { TooltipsConfigMock } from '../../../../../shared/tooltips/test/tooltips-content.mock';
import { TooltipsServiceMock } from '../../../../../shared/tooltips/test/tooltips-service.mock';
import { AvailableBalanceLayoutComponent } from '../../../../balance-breakdown/src/sub-components/available-balance-layout.component';
import { BalanceFilteredItemsLayoutComponent } from '../../../../balance-breakdown/src/sub-components/balance-filtered-items-layout.component';
import { BalanceLayoutComponent } from '../../../../balance-breakdown/src/sub-components/balance-layout.component';
import { BonusBalanceLayoutComponent } from '../../../../balance-breakdown/src/sub-components/bonus-balance-layout.component';
import { BalanceCtaComponent } from '../../../../balance-breakdown/src/sub-components/cta.component';
import { ExpanderComponent } from '../../../../balance-breakdown/src/sub-components/expander.component';
import { BalanceBreakdownSliderComponent } from '../../../../balance-breakdown/src/sub-components/slider.component';
import { TourneyTokenBalanceLayoutComponent } from '../../../../balance-breakdown/src/sub-components/tourney-token-balance-layout.component';
import { BalanceBreakdownTutorialLayoutComponent } from '../../../../balance-breakdown/src/sub-components/tutorial-layout.component';
import { BalanceBreakdownServiceMock } from '../../../../balance-breakdown/test/balance-breakdown.service.mock';
import { BalancePropertiesServiceMock } from '../../../../balance-properties/test/balance-properties.service.mock';
import { IconCustomComponent } from '../../../../icons/src/icon-fast.component';
import { BalanceBreakdownContentMock } from '../balance-breakdown-content.mock';
import { BalanceBreakdownTrackingServiceMock } from './balance-breakdown-tracking.service.mock';

describe('BalanceBreakdownSubComponents', () => {
    let fixture: ComponentFixture<
        | AvailableBalanceLayoutComponent
        | BalanceLayoutComponent
        | BalanceCtaComponent
        | BonusBalanceLayoutComponent
        | BalanceFilteredItemsLayoutComponent
        | BalanceBreakdownSliderComponent
        | BalanceBreakdownTutorialLayoutComponent
        | TourneyTokenBalanceLayoutComponent
    >;
    let menuActionsServiceMock: MenuActionsServiceMock;
    let balancePropertiesServiceMock: BalancePropertiesServiceMock;
    let balanceBreakdownContentMock: BalanceBreakdownContentMock;
    let intlServiceMock: IntlServiceMock;
    let dslServiceMock: DslServiceMock;
    let balanceBreakdownServiceMock: BalanceBreakdownServiceMock;
    let tooltipsServiceMock: TooltipsServiceMock;
    let timerServiceMock: TimerServiceMock;
    let item: any;
    let balanceSubject: BehaviorSubject<number>;

    beforeEach(() => {
        menuActionsServiceMock = MockContext.useMock(MenuActionsServiceMock);
        balanceBreakdownContentMock = MockContext.useMock(BalanceBreakdownContentMock);
        balancePropertiesServiceMock = MockContext.useMock(BalancePropertiesServiceMock);
        intlServiceMock = MockContext.useMock(IntlServiceMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);
        balanceBreakdownServiceMock = MockContext.useMock(BalanceBreakdownServiceMock);
        tooltipsServiceMock = MockContext.useMock(TooltipsServiceMock);
        timerServiceMock = MockContext.useMock(TimerServiceMock);
        MockContext.useMock(DeviceServiceMock);
        MockContext.useMock(BalanceBreakdownTrackingServiceMock);
        MockContext.useMock(TooltipsConfigMock);
        MockContext.useMock(TopLevelCookiesConfigMock);
        MockContext.useMock(CommonMessagesMock);
        MockContext.useMock(UserServiceMock);

        balanceSubject = new BehaviorSubject(-1);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, UtilsService],
            declarations: [MockDslPipe],
            imports: [BrowserAnimationsModule],
            schemas: [NO_ERRORS_SCHEMA],
        });

        item = {
            url: 'url',
            clickAction: 'action',
            type: 'type',
            name: 'name',
            parameters: {
                'expander-item': 'expanderItem',
            },
            resources: {},
            children: [
                {
                    url: 'url',
                    type: 'type',
                    name: 'filteredItem',
                    parameters: {},
                    resources: {},
                },
                {
                    url: 'url',
                    type: 'type',
                    name: 'expanderItem',
                    parameters: {},
                    resources: {},
                },
            ],
        };
    });

    function initComponent<
        T extends
            | AvailableBalanceLayoutComponent
            | BalanceLayoutComponent
            | BalanceCtaComponent
            | BonusBalanceLayoutComponent
            | BalanceFilteredItemsLayoutComponent
            | ExpanderComponent
            | BalanceBreakdownSliderComponent
            | TourneyTokenBalanceLayoutComponent,
    >(type: Type<T>) {
        TestBed.overrideComponent(type, {
            remove: {
                imports: [IconCustomComponent],
            },
            add: {
                imports: [MockComponent(IconCustomComponent)],
            },
        });

        fixture = TestBed.createComponent(type);

        fixture.componentInstance.item = item;

        fixture.detectChanges();
    }

    describe('BalanceCtaComponent', () => {
        describe('processClick()', () => {
            it('should process specified menu action', () => {
                initComponent(BalanceCtaComponent);
                const event = new Event('click');
                fixture.componentInstance.processClick(event, item);

                expect(menuActionsServiceMock.processClick).toHaveBeenCalled();
            });
        });
    });

    describe('BalanceItemComponent', () => {
        describe('init', () => {
            beforeEach(() => {
                item.resources.TooltipText = 'tooltip text';
                item.resources.DetailsText = 'see details';

                item.parameters.formula = 'f';

                const balance = { accountBalance: 5 } as BalanceProperties;
                balancePropertiesServiceMock.balanceProperties.next(balance);
                balanceSubject.next(9);

                dslServiceMock.evaluateExpression.withArgs('f').and.returnValue(balanceSubject);
            });

            it('should set parameters', () => {
                initComponent(BalanceLayoutComponent);

                const component = fixture.componentInstance as BalanceLayoutComponent;

                expect(component.balance).toBe(9);
                expect(component.hideIfZero).toBeFalse();
                expect(component.hideDetailsIfZero).toBeFalse();
            });

            it('should set properties', () => {
                item.parameters['hide-if-zero'] = 'true';
                item.parameters['hide-details-if-zero'] = 'true';

                initComponent(BalanceLayoutComponent);

                const component = fixture.componentInstance as BalanceLayoutComponent;

                expect(component.hideIfZero).toBeTrue();
                expect(component.hideDetailsIfZero).toBeTrue();
            });
        });
    });

    describe('AvailableBalanceComponent', () => {
        describe('init', () => {
            beforeEach(() => {
                item.resources.TooltipText = 'Release funds tooltip info';
                item.resources.PayPalAmountInfo = '__AMOUNT__ in Pay Pal';
                item.resources.ReleaseFunds = 'Release funds';
                item.resources.ReleaseFundsConfirmation = 'Funds released';
                balanceBreakdownContentMock.isPaypalBalanceMessageEnabled = 'messageCondition';
                balanceBreakdownContentMock.isPaypalReleaseFundsEnabled = 'releaseFundscondition';

                item.parameters.formula = 'f';

                const balance = { accountBalance: 5, payPalBalance: 2 } as BalanceProperties;
                balancePropertiesServiceMock.balanceProperties.next(balance);
                balanceSubject.next(9);

                dslServiceMock.evaluateExpression.withArgs('f').and.returnValue(balanceSubject);
            });

            it('should set parameters', () => {
                initComponent(AvailableBalanceLayoutComponent);

                const component = fixture.componentInstance as AvailableBalanceLayoutComponent;

                expect(component.balance).toBe(<any>balanceSubject);
            });

            it('should set PayPal balance and message when there is PayPal balance', () => {
                const balance = { accountBalance: 5, payPalBalance: 2 } as BalanceProperties;
                balancePropertiesServiceMock.balanceProperties.next(balance);

                intlServiceMock.formatCurrency.and.returnValue('2$');
                initComponent(AvailableBalanceLayoutComponent);

                const component = fixture.componentInstance as AvailableBalanceLayoutComponent;

                expect(component.payPalBalance).toBe(2);
                expect(intlServiceMock.formatCurrency).toHaveBeenCalledWith(2);
                expect(component.payPalBalanceMessage).toBe('2$ in Pay Pal');
            });

            it('should show PayPal message and set release funds properties when enabled', () => {
                dslServiceMock.evaluateExpression.withArgs('messageCondition').and.returnValue(of(true));
                dslServiceMock.evaluateExpression.withArgs('releaseFundscondition').and.returnValue(of(true));

                initComponent(AvailableBalanceLayoutComponent);
                const component = fixture.componentInstance as AvailableBalanceLayoutComponent;

                expect(dslServiceMock.evaluateExpression).toHaveBeenCalledWith('messageCondition');
                expect(dslServiceMock.evaluateExpression).toHaveBeenCalledWith('releaseFundscondition');
                expect(component.showPayPalBalanceMessage).toBeTrue();
                expect(component.showReleaseFunds).toBeTrue();
                expect(component.releaseFundsText).toBe('Release funds');
                expect(component.releaseFundsTooltipText).toBe('Release funds tooltip info');
            });

            it('should release PayPal funds', () => {
                initComponent(AvailableBalanceLayoutComponent);
                const component = fixture.componentInstance as AvailableBalanceLayoutComponent;

                balancePropertiesServiceMock.transfer.and.returnValue(of({}));

                component.releaseFunds();

                expect(balancePropertiesServiceMock.transfer).toHaveBeenCalledWith({
                    amount: 2,
                    fromBalanceType: 'PAYPAL_BAL',
                    toBalanceType: 'MAIN_REAL_BAL',
                });
                expect(balancePropertiesServiceMock.refresh).toHaveBeenCalled();
                expect(component.payPalBalanceMessage).toBe('Funds released');
                expect(component.showReleaseFunds).toBeFalse();
            });
        });
    });

    describe('BonusBalanceLayoutComponent', () => {
        describe('init', () => {
            beforeEach(() => {
                item.parameters.formula = 'c.BonusBalance.Amount("CASINO")';

                dslServiceMock.evaluateExpression.withArgs('c.BonusBalance.Amount("CASINO")').and.returnValue(balanceSubject);
            });

            it('should set parameters', () => {
                initComponent(BonusBalanceLayoutComponent);

                const component = fixture.componentInstance as BonusBalanceLayoutComponent;

                expect(component.balance).toBe(<any>balanceSubject);
            });
        });
    });

    describe('BalanceFilteredItemsLayoutComponent', () => {
        describe('init', () => {
            it('should set parameters', () => {
                const slide = { name: 'filteredItem' } as MenuContentItem;
                balanceBreakdownServiceMock.slide.set(slide);

                initComponent(BalanceFilteredItemsLayoutComponent);
                const component = fixture.componentInstance as BalanceFilteredItemsLayoutComponent;

                expect(component.currentSlide).toEqual({
                    url: 'url',
                    type: 'type',
                    name: 'filteredItem',
                    parameters: {},
                    resources: {},
                } as MenuContentItem);
            });

            it('should set single Product', fakeAsync(() => {
                balanceBreakdownServiceMock.isSingleProduct.set(true);
                initComponent(BalanceFilteredItemsLayoutComponent);

                const component = fixture.componentInstance as BalanceFilteredItemsLayoutComponent;

                expect(timerServiceMock.setTimeout).toHaveBeenCalledOnceWith(jasmine.any(Function));

                tick();

                expect(component.isSingleProduct).toBeTrue();
            }));
        });
    });

    describe('BalanceBreakdownTutorialLayoutComponent', () => {
        describe('init', () => {
            beforeEach(() => {
                item.parameters['tooltip-tutorial'] = 'testtutorial';
            });

            it('should initialize tooltips', () => {
                initComponent(BalanceBreakdownTutorialLayoutComponent);
                const tooltip: Tooltip = { name: 'testtutorial', isActive: true, text: 'test' };
                tooltipsServiceMock.activeTooltip.next(tooltip);
                const component = fixture.componentInstance as BalanceBreakdownTutorialLayoutComponent;

                expect(component.tutorialItem).toEqual('testtutorial');
                expect(component.active).toBeTrue();
            });
        });
    });

    describe('ExpanderComponent', () => {
        describe('init', () => {
            it('should set parameters', () => {
                initComponent(ExpanderComponent);

                const component = fixture.componentInstance as ExpanderComponent;

                expect(component.expanderItem?.name).toBe('expanderItem');
                expect(component.expandableItems.length).toBe(1);
            });
        });

        describe('expand', () => {
            it('should set expand', () => {
                initComponent(ExpanderComponent);

                const component = fixture.componentInstance as ExpanderComponent;
                expect(component.expanded).toBeFalse();

                component.expand();

                expect(component.expanded).toBeTrue();
            });
        });
    });

    describe('TourneyTokenBalanceLayoutComponent', () => {
        describe('init', () => {
            beforeEach(() => {
                item.text = 'G{0}';
                item.parameters.formula = 'c.TourneyTokenBalance.Balance';
                item.parameters.currency = 'c.TourneyTokenBalance.Currency';

                intlServiceMock.getCurrencySymbol.and.returnValue('$');

                balanceSubject.next(10);
                dslServiceMock.evaluateExpression.withArgs('c.TourneyTokenBalance.Balance').and.returnValue(balanceSubject);
                dslServiceMock.evaluateExpression.withArgs('c.TourneyTokenBalance.Currency').and.returnValue(of('USD'));
            });

            it('should set parameters', () => {
                initComponent(TourneyTokenBalanceLayoutComponent);

                const component = fixture.componentInstance as TourneyTokenBalanceLayoutComponent;

                expect(component.balance).toBe(10);
                expect(component.text).toBe('G$');
            });
        });
    });
});
