import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ContentItem, MenuActionOrigin } from '@frontend/vanilla/core';
import { PageMatrixComponent, PageMatrixService } from '@frontend/vanilla/features/content';
import { MockContext } from 'moxxi';
import { MockComponent } from 'ng-mocks';

import { HtmlNodeMock } from '../../../core/test/browser/html-node.mock';
import { PageMock } from '../../../core/test/browsercommon/page.mock';
import { ContentServiceMock } from '../../../core/test/content/content.mock';
import { LoggerMock } from '../../../core/test/languages/logger.mock';
import { MenuActionsServiceMock } from '../../../core/test/menu-actions/menu-actions.mock';
import { NativeAppConfigMock } from '../../../core/test/native-app/native-app.mock';
import { setupComponentFactoryResolver } from '../../../test/test-utils';
import { PageMatrixBootstrapService } from '../../content/src/page-matrix-bootstrap.service';
import { IconCustomComponent } from '../../icons/src/icon-fast.component';
import { ContentMessageComponent } from '../src/content-message.component';
import { ContentMessagesBootstrapService } from '../src/content-messages-bootstrap.service';
import { ContentMessagesTrackingServiceMock } from './content-messages-tracking.service.mock';

@Component({
    standalone: true,
    imports: [ContentMessageComponent, MockComponent(IconCustomComponent)],
    template: ` <vn-content-message
        [message]="message"
        scope="kkk"
        (close)="close($event.message, $event.showOnNextSession, $event.showOnNextLogin)" />`,
})
class TestHostComponent {
    message: ContentItem;
    close: jasmine.Spy = jasmine.createSpy('close');
}

describe('ContentMessageComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let message: ContentItem;
    let htmlNodeMock: HtmlNodeMock;
    let contentMessagesTrackingServiceMock: ContentMessagesTrackingServiceMock;
    let menuActionsServiceMock: MenuActionsServiceMock;

    beforeEach(() => {
        htmlNodeMock = MockContext.useMock(HtmlNodeMock);
        contentMessagesTrackingServiceMock = MockContext.useMock(ContentMessagesTrackingServiceMock);
        menuActionsServiceMock = MockContext.useMock(MenuActionsServiceMock);
        MockContext.useMock(ContentServiceMock);
        MockContext.useMock(LoggerMock);
        MockContext.useMock(PageMock);
        MockContext.useMock(NativeAppConfigMock);

        TestBed.configureTestingModule({
            imports: [MockComponent(IconCustomComponent)],
            providers: [PageMatrixService, PageMatrixBootstrapService, MockContext.providers, ContentMessagesBootstrapService],
        });

        TestBed.overrideComponent(TestHostComponent, {
            set: {
                imports: [ContentMessageComponent],
            },
        });

        TestBed.overrideComponent(ContentMessageComponent, {
            remove: {
                imports: [IconCustomComponent],
            },
            add: {
                imports: [MockComponent(IconCustomComponent)],
            },
        });

        setupComponentFactoryResolver();

        const bootstrapService: PageMatrixBootstrapService = TestBed.inject(PageMatrixBootstrapService);
        bootstrapService.onFeatureInit();
        const contentMessagesBootstrapService: ContentMessagesBootstrapService = TestBed.inject(ContentMessagesBootstrapService);
        contentMessagesBootstrapService.onFeatureInit();

        message = {
            name: 'msg1',
            parameters: {
                showCloseButton: 'true',
                messageClass: 'msg-custom-class',
                messageIcon: 'icon-custom-class',
            },
            templateName: 'pctext',
            text: '<p>hello <span class="message-close">close</span></p>',
        };
    });

    function initComponent() {
        fixture = TestBed.createComponent(TestHostComponent);
        fixture.componentInstance.message = message;
        fixture.detectChanges();
    }

    function getMessageElm(): DebugElement {
        const de = fixture.debugElement.query(By.directive(ContentMessageComponent));
        return de.query(By.css('.content-message'));
    }

    function getIcon(): DebugElement {
        return getMessageElm().query(By.css('.message-icon'));
    }

    function getDefaultCloseButton(): DebugElement {
        return getMessageElm().query(By.css('vn-icon[ng-reflect-name="theme-close-i"]'));
    }

    function getInlineCloseButton(): HTMLElement {
        return getMessageElm().nativeElement.querySelector('.message-close');
    }

    it('should render content message', () => {
        initComponent(); // act

        expect(getMessageElm().nativeElement).toHaveClass('msg-custom-class');
        expect(getIcon().nativeElement).toHaveClass('icon-custom-class');
        expect(getDefaultCloseButton().nativeElement).toHaveAttr('extraClass');
        expect(getMessageElm().query(By.directive(PageMatrixComponent))).toBeTruthy();
    });

    it('should not render close button when showCloseButton is falsy', () => {
        message.parameters!.showCloseButton = 'false';

        initComponent(); // act

        expect(getIcon()).toBeTruthy();
        expect(getDefaultCloseButton()).toBeNull();
    });

    it('should track when message is loaded', () => {
        initComponent();

        expect(contentMessagesTrackingServiceMock.trackMessageLoaded).toHaveBeenCalledWith(message, 'kkk');
    });

    it('should close content message when close button is clicked', () => {
        initComponent();

        getDefaultCloseButton().triggerEventHandler('click', new Event('click')); // act

        expect(fixture.componentInstance.close).toHaveBeenCalledWith(message, false, false);
    });

    it('should invoke menu action on close when closeAction specified.', () => {
        initComponent();

        getDefaultCloseButton().triggerEventHandler('click', new Event('click')); // act
        expect(menuActionsServiceMock.invoke).not.toHaveBeenCalled();

        message.parameters!.closeAction = 'closeFunction';
        message.parameters!.queryStringKey = 'show';
        getDefaultCloseButton().triggerEventHandler('click', new Event('click')); // act
        expect(menuActionsServiceMock.invoke).toHaveBeenCalledWith('closeFunction', MenuActionOrigin.PageMatrix, ['show']);
    });

    shouldCloseByInlineButton('without extra params', null, {});
    shouldCloseByInlineButton('with showOnNextSession', '<span class="message-close" data-show-on-next-session="true"></span>', {
        showOnNextSession: true,
    });
    shouldCloseByInlineButton('with showOnNextLogin', '<span class="message-close" data-show-on-next-login="true"></span>', {
        showOnNextLogin: true,
    });

    function shouldCloseByInlineButton(
        testName: string,
        messageHtml: string | null,
        expected: { showOnNextSession?: boolean; showOnNextLogin?: boolean },
    ) {
        it('should close content message when clicked inline close button ' + testName, () => {
            message.text = messageHtml || message.text || '';

            initComponent();

            getInlineCloseButton().dispatchEvent(new Event('click')); // act

            expect(fixture.componentInstance.close).toHaveBeenCalledWith(
                message,
                expected.showOnNextSession || false,
                expected.showOnNextLogin || false,
            );
        });
    }

    it('should close content message when message is clicked and closeOnMessageClick is true', () => {
        message.parameters!.closeOnMessageClick = 'true';
        initComponent();

        getMessageElm().triggerEventHandler('click', new Event('click')); // act

        expect(fixture.componentInstance.close).toHaveBeenCalledWith(message, undefined, undefined);
    });

    it('should not close content message when message is clicked', () => {
        initComponent();

        getMessageElm().triggerEventHandler('click', new Event('click')); // act

        expect(fixture.componentInstance.close).not.toHaveBeenCalled();
    });

    it('should add css class to html node (and remove it when destroyed)', () => {
        message.parameters!.htmlTagClass = 'html-class';

        initComponent();

        expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith('html-class', true);

        fixture.destroy();

        expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith('html-class', false);
    });

    it('not add css class to html node if not set', () => {
        message.parameters = undefined;

        initComponent();

        expect(htmlNodeMock.setCssClass).not.toHaveBeenCalled();
    });
});
