import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuContentItem } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { PageMock } from '../../../core/test/browsercommon/page.mock';
import { FakeCurrencyPipe2 } from '../../../core/test/intl/intl.mock';
import { MenuActionsServiceMock } from '../../../core/test/menu-actions/menu-actions.mock';
import { BonusBalanceComponent } from '../src/bonus-balance/bonus-balance.component';
import { HeaderServiceMock } from './header.mock';

describe('BonusBalanceComponent', () => {
    let fixture: ComponentFixture<BonusBalanceComponent>;
    let component: BonusBalanceComponent;
    let headerServiceMock: HeaderServiceMock;
    let item: MenuContentItem;
    let trackingServiceMock: TrackingServiceMock;
    let pageMock: PageMock;

    beforeEach(() => {
        headerServiceMock = MockContext.useMock(HeaderServiceMock);
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);
        pageMock = MockContext.useMock(PageMock);
        MockContext.useMock(MenuActionsServiceMock);

        TestBed.overrideComponent(BonusBalanceComponent, {
            set: {
                imports: [CommonModule, FakeCurrencyPipe2],
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        item = { name: 'x', parameters: {} } as any;

        fixture = TestBed.createComponent(BonusBalanceComponent);
        component = fixture.componentInstance;
        component.item = item;
    });

    describe('init', () => {
        it('should setup balance', () => {
            pageMock.product = 'sports';
            item.name = 'bonus-balance';
            item.parameters = {
                balance: 'b',
            };

            headerServiceMock.bonusBalance.set(100);
            fixture.detectChanges();

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('contentView', {
                'component.CategoryEvent': 'navigation',
                'component.LabelEvent': 'mini menu',
                'component.ActionEvent': 'load',
                'component.PositionEvent': 'not applicable',
                'component.LocationEvent': 'sports',
                'component.EventDetails': 'bonus screen',
                'component.URLClicked': 'not applicable',
            });
        });
    });
});
