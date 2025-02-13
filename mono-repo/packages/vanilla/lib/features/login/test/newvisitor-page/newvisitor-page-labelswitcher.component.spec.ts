import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieName, MenuActionOrigin, MenuContentItem } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { CookieServiceMock } from '../../../../core/test/browser/cookie.mock';
import { MenuActionsServiceMock } from '../../../../core/test/menu-actions/menu-actions.mock';
import { LabelSwitcherServiceMock } from '../../../label-switcher/test/label-switcher.mock';
import { NewVisitorLabelSwitcherComponent } from '../../src/newvisitor-page/label-switcher/newvisitor-page-labelswitcher.component';

describe('NewVisitorLabelSwitcherComponent', () => {
    let fixture: ComponentFixture<NewVisitorLabelSwitcherComponent>;
    let component: NewVisitorLabelSwitcherComponent;
    let menuActionsServiceMock: MenuActionsServiceMock;
    let cookieServiceMock: CookieServiceMock;

    beforeEach(() => {
        menuActionsServiceMock = MockContext.useMock(MenuActionsServiceMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        MockContext.useMock(LabelSwitcherServiceMock);

        TestBed.overrideComponent(NewVisitorLabelSwitcherComponent, {
            set: {
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(NewVisitorLabelSwitcherComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    describe('processClick', () => {
        it('should add cookie and process click', () => {
            const clickEvent = new Event('click');
            const item = <MenuContentItem>{ name: 'test' };

            component.processClick(clickEvent, item);

            expect(cookieServiceMock.put).toHaveBeenCalledOnceWith(CookieName.NewVisitorPageOpted, '1');
            expect(menuActionsServiceMock.processClick).toHaveBeenCalledOnceWith(clickEvent, item, MenuActionOrigin.Misc, false);
        });
    });
});
