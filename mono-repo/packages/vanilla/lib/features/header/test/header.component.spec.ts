import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { MenuActionsServiceMock } from '../../../core/test/menu-actions/menu-actions.mock';
import { Renderer2Mock } from '../../../core/test/renderer2.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { ContentMessagesServiceMock } from '../../content-messages/test/content-messages.mock';
import { HeaderMessagesService } from '../src/header-messages.service';
import { HeaderComponent } from '../src/header.component';
import { HeaderConfigMock, HeaderServiceMock } from './header.mock';
import { NavigationPillServiceMock } from './navigation-pill/navigation-pill.service.mock';

describe('HeaderComponent', () => {
    let fixture: ComponentFixture<HeaderComponent>;
    let headerContentMock: HeaderConfigMock;
    let menuActionsServiceMock: MenuActionsServiceMock;
    let renderer2Mock: Renderer2Mock;

    beforeEach(() => {
        headerContentMock = MockContext.useMock(HeaderConfigMock);
        menuActionsServiceMock = MockContext.useMock(MenuActionsServiceMock);
        renderer2Mock = MockContext.useMock(Renderer2Mock);
        MockContext.useMock(UserServiceMock);
        MockContext.useMock(HeaderServiceMock);
        MockContext.useMock(ContentMessagesServiceMock);
        MockContext.useMock(NavigationPillServiceMock);
        MockContext.useMock(DslServiceMock);

        TestBed.overrideComponent(HeaderComponent, {
            set: {
                providers: [MockContext.providers, HeaderMessagesService],
                imports: [CommonModule],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(HeaderComponent);

        (fixture.componentInstance as any).renderer2 = renderer2Mock; // Force mock DI

        headerContentMock.elements = {
            leftItems: [{ name: 'a' }],
            authItems: [{}],
            unauthItems: [{}],
        } as any;

        fixture.detectChanges();
    });

    describe('ngOnInit', () => {
        it('should register scroll event listener', () => {
            headerContentMock.enableToggleOnScroll = true;
            headerContentMock.whenReady.next();

            expect(renderer2Mock.listen).toHaveBeenCalled();
        });
    });

    describe('processClick()', () => {
        it('should process specified menu action', () => {
            const event = new Event('click');
            fixture.componentInstance.processClick(event, headerContentMock.elements.leftItems[0]);

            expect(menuActionsServiceMock.processClick).toHaveBeenCalledWith(event, headerContentMock.elements.leftItems[0], 'Header');
        });
    });
});
