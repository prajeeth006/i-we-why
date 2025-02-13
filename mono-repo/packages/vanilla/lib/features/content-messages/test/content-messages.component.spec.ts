import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentItem } from '@frontend/vanilla/core';
import { ContentMessagesComponent } from '@frontend/vanilla/features/content-messages';
import { MockContext } from 'moxxi';

import { HtmlNodeMock } from '../../../core/test/browser/html-node.mock';
import { MenuActionsServiceMock } from '../../../core/test/menu-actions/menu-actions.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { ContentMessagesServiceMock } from './content-messages.mock';

describe('ContentMessagesComponent', () => {
    let fixture: ComponentFixture<ContentMessagesComponent>;
    let contentMessagesServiceMock: ContentMessagesServiceMock;
    let menuActionsServiceMock: MenuActionsServiceMock;
    let htmlNodeMock: HtmlNodeMock;
    let overlayRef: OverlayRefMock;
    let messages: ContentItem[];
    let closedCookieKey: string;

    beforeEach(() => {
        contentMessagesServiceMock = MockContext.useMock(ContentMessagesServiceMock);
        htmlNodeMock = MockContext.useMock(HtmlNodeMock);
        overlayRef = MockContext.useMock(OverlayRefMock);
        menuActionsServiceMock = MockContext.useMock(MenuActionsServiceMock);
        MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
            schemas: [NO_ERRORS_SCHEMA],
        });

        messages = [
            { name: 'msg-1', templateName: 'pctext' },
            { name: 'closed-1', templateName: 'pctext' },
            { name: 'closed-2', templateName: 'pctext' },
            { name: 'msg-2', templateName: 'pctext' },
        ];
        closedCookieKey = 'kkk';
        contentMessagesServiceMock.getClosedMessageNames.and.returnValue(['closed-1', 'closed-2', 'closed-3']);
    });

    function initComponent() {
        fixture = TestBed.createComponent(ContentMessagesComponent);

        fixture.componentInstance.closedCookieKey = <any>closedCookieKey;
        fixture.componentInstance.messages = <any>messages;
        fixture.componentInstance.cssClassForHtmlNode = 'has-messages';

        fixture.detectChanges();
        fixture.componentInstance.ngOnChanges({
            messages: new SimpleChange(undefined, messages, true),
            closedCookieKey: new SimpleChange(undefined, closedCookieKey, true),
        });
    }

    describe('init', () => {
        it('should expose messages which are not already closed', () => {
            initComponent(); // act

            expectShown({ messages: [messages[0]!, messages[3]!], hasCssClass: true });
            expect(contentMessagesServiceMock.getClosedMessageNames).toHaveBeenCalledWith(closedCookieKey);
        });

        it('should show nothing if all messages filtered', () => {
            messages = [messages[1], messages[2], <any>null, undefined];

            initComponent(); // act

            expectShown({ messages: [], hasCssClass: false });
        });

        it('should show nothing if no messages', () => {
            messages = [];
            initializeAndExpectNothing();
        });

        it('should show nothing if messages are undefined', () => {
            messages = <any>undefined;
            initializeAndExpectNothing();
        });

        it('should show nothing if closedCookieKey is undefined', () => {
            closedCookieKey = <any>undefined;
            initializeAndExpectNothing();
        });

        function initializeAndExpectNothing() {
            initComponent(); // act
            expectShown({ messages: [], hasCssClass: false });
            expect(contentMessagesServiceMock.getClosedMessageNames).not.toHaveBeenCalled();
        }
    });

    describe('on changes e.g. client-side filtering', () => {
        it('should add messages to show', () => {
            const newMessages = messages.concat({ name: 'closed-3', templateName: 'pcteaser' }, { name: 'msg3', templateName: 'pcimage' });

            runChangesAndExpect(newMessages, {
                messages: [messages[0]!, messages[3]!, newMessages[5]!],
                hasCssClass: true,
            });
        });

        it('should remove messages to show', () => {
            runChangesAndExpect(
                [messages[1]!, messages[2]!], // keep only closed -> filtered
                { messages: [], hasCssClass: false },
            );
        });

        function runChangesAndExpect(newMessages: ContentItem[], expected: { messages: ContentItem[]; hasCssClass: boolean }) {
            initComponent();
            fixture.componentInstance.messages = newMessages;

            fixture.componentInstance.ngOnChanges({ messages: new SimpleChange(messages, newMessages, false) }); // act

            expectShown(expected);
            expect(contentMessagesServiceMock.getClosedMessageNames).toHaveBeenCalledTimes(2);
        }
    });

    function expectShown(expected: { messages: ContentItem[]; hasCssClass: boolean }) {
        expect(fixture.componentInstance.messagesToShow).toEqual(expected.messages);
        expect(htmlNodeMock.setCssClass.calls.mostRecent().args).toEqual(['has-messages', expected.hasCssClass]);
    }

    describe('overlay', () => {
        it('should close messages on backdrop click with closeMessageOnOvelayClick flag', () => {
            messages[0]!.parameters = { writeCookieOnOverlayClick: 'true' };
            messages[1]!.parameters = { writeCookieOnOverlayClick: 'true' }; // already closed -> shouldn't be closed again
            initComponent();

            overlayRef.backdropClick.next();

            expect(contentMessagesServiceMock.markMessageAsClosed).toHaveBeenCalledWith(messages[0], closedCookieKey);
            expect(contentMessagesServiceMock.markMessageAsClosed).toHaveBeenCalledTimes(1);
            expect(menuActionsServiceMock.invoke).not.toHaveBeenCalled();
        });

        it('should close messages on backdrop click and trigger closeAction', () => {
            messages[0]!.parameters = { closeAction: 'action', queryStringKey: 'query' };

            initComponent();

            overlayRef.backdropClick.next();

            expect(menuActionsServiceMock.invoke).toHaveBeenCalledWith('action', 'PageMatrix', ['query']);
        });

        it('should hide overlay if last message is closed', () => {
            contentMessagesServiceMock.markMessageAsClosed.and.callFake(() =>
                contentMessagesServiceMock.getClosedMessageNames.and.returnValue(['closed-1', 'closed-2', 'msg-1']),
            );

            messages.splice(3, 1); // keep last shown message
            initComponent();

            fixture.componentInstance.closeMessage(messages[0]!); // act

            expect(overlayRef.dispose).toHaveBeenCalled();
            expectShown({ messages: [], hasCssClass: false });
        });
    });

    describe('closeMessage()', () => {
        it('should mark message as closed and refresh messages', () => {
            initComponent();

            fixture.componentInstance.closeMessage(messages[0]!); // act

            expect(contentMessagesServiceMock.markMessageAsClosed).toHaveBeenCalledWith(messages[0], closedCookieKey, {
                showOnNextSession: false,
                showOnNextLogin: false,
            });
            expectShown({ messages: [messages[3]!], hasCssClass: true }); // particular message should be hidden
        });
    });

    describe('OnDestroy()', () => {
        it('should remove the cssClassForHtmlNode', () => {
            initComponent();

            fixture.componentInstance.ngOnDestroy(); // act

            expect(htmlNodeMock.setCssClass.calls.mostRecent().args).toEqual(['has-messages', false]);
        });
    });
});
