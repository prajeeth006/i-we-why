import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuContentItem } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { MenuActionsServiceMock } from '../../../../core/test/menu-actions/menu-actions.mock';
import { ClaimsServiceMock } from '../../../../core/test/user/claims.mock';
import { CoralCashbackLevelComponent } from '../../src/sub-components/coral-cashback-level.component';

describe('CoralCashbackLevelComponent', () => {
    let fixture: ComponentFixture<CoralCashbackLevelComponent>;
    let component: CoralCashbackLevelComponent;
    let claimsServiceMock: ClaimsServiceMock;

    beforeEach(() => {
        MockContext.useMock(MenuActionsServiceMock);
        claimsServiceMock = MockContext.useMock(ClaimsServiceMock);

        TestBed.overrideComponent(CoralCashbackLevelComponent, {
            set: {
                imports: [],
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });
    });

    beforeEach(() => {
        claimsServiceMock.get.withArgs('vipLevel').and.returnValue('BRONZE');
        fixture = TestBed.createComponent(CoralCashbackLevelComponent);
        component = fixture.componentInstance;
    });

    describe('ngOnInit()', () => {
        it('should set model when vip level exists in items', () => {
            component.item = { name: 'item', children: [{ name: 'level_child' }, { name: 'level_bronze' }] } as MenuContentItem;
            fixture.detectChanges();

            expect(component.model).toEqual({ name: 'level_bronze' } as MenuContentItem);
        });

        it('should not set model when vip level does not exist in items', () => {
            component.item = { name: 'item', children: [{ name: 'level_child' }, { name: 'level_test' }] } as MenuContentItem;
            fixture.detectChanges();

            expect(component.model).toBeUndefined();
        });
    });
});
