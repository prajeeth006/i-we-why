import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuContentItem } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { MenuActionsServiceMock } from '../../../core/test/menu-actions/menu-actions.mock';
import { AvatarComponent } from '../src/avatar/avatar.component';
import { HeaderConfigMock } from './header.mock';

describe('AvatarComponent', () => {
    let fixture: ComponentFixture<AvatarComponent>;
    let headerContentMock: HeaderConfigMock;
    let menuActionsServiceMock: MenuActionsServiceMock;
    let item: MenuContentItem;

    beforeEach(() => {
        headerContentMock = MockContext.useMock(HeaderConfigMock);
        menuActionsServiceMock = MockContext.useMock(MenuActionsServiceMock);

        TestBed.overrideComponent(AvatarComponent, {
            set: {
                imports: [],
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        item = { name: 'x', parameters: {} } as any;
        headerContentMock.elements.authItems = { parameters: {} } as any;

        fixture = TestBed.createComponent(AvatarComponent);
        fixture.componentInstance.item = item;
    });

    describe('init', () => {
        it('should setup parameters', () => {
            item.parameters = { 'avatar-class': 'avc', 'avatar-icon-class': 'avic', 'show-badge': 'true' };

            fixture.detectChanges();

            expect(fixture.componentInstance.avatarClass).toBe('avc');
            expect(fixture.componentInstance.iconClass).toBe('avic');
            expect(fixture.componentInstance.showBadge).toBeTrue();
        });
    });

    describe('processClick()', () => {
        it('should process specified menu action', () => {
            fixture.detectChanges();

            const event = new Event('click');

            fixture.componentInstance.processClick(event);

            expect(menuActionsServiceMock.processClick).toHaveBeenCalledWith(event, item, 'Header');
        });
    });
});
