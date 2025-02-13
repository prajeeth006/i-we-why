import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieName, MenuActionOrigin, MenuContentItem } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { CookieServiceMock } from '../../../../core/test/browser/cookie.mock';
import { MenuActionsServiceMock } from '../../../../core/test/menu-actions/menu-actions.mock';
import { NewVisitorPageMenuItemComponent } from '../../src/newvisitor-page/menu-item/newvisitor-page-menuitem.component';

describe('NewVisitorPageMenuItemComponent', () => {
    let fixture: ComponentFixture<NewVisitorPageMenuItemComponent>;
    let component: NewVisitorPageMenuItemComponent;
    let menuActionsServiceMock: MenuActionsServiceMock;
    let cookieServiceMock: CookieServiceMock;

    beforeEach(() => {
        menuActionsServiceMock = MockContext.useMock(MenuActionsServiceMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);

        TestBed.overrideComponent(NewVisitorPageMenuItemComponent, {
            set: {
                imports: [],
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(NewVisitorPageMenuItemComponent);
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
