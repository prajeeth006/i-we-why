import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieName, UserLogoutEvent } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { CookieServiceMock } from '../../../../core/test';
import { PageMock } from '../../../../core/test/browsercommon/page.mock';
import { MenuActionsServiceMock } from '../../../../core/test/menu-actions/menu-actions.mock';
import { UserServiceMock } from '../../../../core/test/user/user.mock';
import { DepositButtonComponent } from '../../src/deposit-button/deposit-button.component';

describe('DepositButtonComponent', () => {
    let fixture: ComponentFixture<DepositButtonComponent>;
    let component: DepositButtonComponent;
    let cookieServiceMock: CookieServiceMock;
    let userServiceMock: UserServiceMock;

    beforeEach(() => {
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        MockContext.useMock(MenuActionsServiceMock);
        MockContext.useMock(PageMock);

        TestBed.overrideComponent(DepositButtonComponent, {
            set: {
                imports: [],
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(DepositButtonComponent);
        component = fixture.componentInstance;

        component.item = <any>{};
    });

    describe('constructor', () => {
        it('should remove depositTooltipDismissed cookie on user logout', () => {
            userServiceMock.triggerEvent(new UserLogoutEvent());

            expect(cookieServiceMock.remove).toHaveBeenCalledOnceWith(CookieName.DepositTooltipDismissed);
        });
    });

    describe('ngOnInit', () => {
        it('should set isTooltipEnabled to false if not real player and has no cookie', () => {
            fixture.detectChanges();

            expect(component.isTooltipEnabled()).toBeFalse();
        });

        it('should set isTooltipEnabled to true if not real player and has depositTooltip cookie', () => {
            component.item.toolTip = 'Deposit';
            cookieServiceMock.get.withArgs(CookieName.DepositTooltip).and.returnValue('1');
            cookieServiceMock.get.withArgs(CookieName.DepositTooltipDismissed).and.returnValue(undefined);

            fixture.detectChanges();

            expect(component.isTooltipEnabled()).toBeTrue();
        });

        it('should set isTooltipEnabled to false if real player and no cookie', () => {
            userServiceMock.realPlayer = true;

            fixture.detectChanges();

            expect(component.isTooltipEnabled()).toBeFalse();
        });

        it('should set isTooltipEnabled to false if real player and has depositTooltip cookie', () => {
            userServiceMock.realPlayer = true;
            cookieServiceMock.get.withArgs(CookieName.DepositTooltip).and.returnValue('1');
            cookieServiceMock.get.withArgs(CookieName.DepositTooltipDismissed).and.returnValue(undefined);

            fixture.detectChanges();

            expect(component.isTooltipEnabled()).toBeFalse();
        });

        it('should set isTooltipEnabled to false if not real player and has depositTooltipDismissed cookie', () => {
            cookieServiceMock.get.withArgs(CookieName.DepositTooltip).and.returnValue('1');
            cookieServiceMock.get.withArgs(CookieName.DepositTooltipDismissed).and.returnValue('1');

            fixture.detectChanges();

            expect(component.isTooltipEnabled()).toBeFalse();
        });
    });

    describe('onTooltipClose', () => {
        it('should put depositTooltipDismissed cookie', () => {
            component.onTooltipClose();

            expect(cookieServiceMock.put).toHaveBeenCalledOnceWith(CookieName.DepositTooltipDismissed, '1');
        });
    });
});
