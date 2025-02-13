import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicHtmlDirective, EmbeddableComponentsService, MenuActionComponent } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { setupComponentFactoryResolver } from '../../../test/test-utils';
import { LoggerMock } from '../languages/logger.mock';
import { MenuActionsServiceMock } from '../menu-actions/menu-actions.mock';

@Component({
    template: '<div [vnDynamicHtml]="template"></div>',
})
class TestHostComponent {
    template: string = '<div><a menu-action="action">Click Me</a></div>';
}

describe('MenuActionComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let menuActionsServiceMock: MenuActionsServiceMock;
    let trackingServiceMock: TrackingServiceMock;
    let loggerMock: LoggerMock;
    let event: Event;
    let preventDefaultSpy: jasmine.Spy;

    beforeEach(() => {
        menuActionsServiceMock = MockContext.useMock(MenuActionsServiceMock);
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);
        loggerMock = MockContext.useMock(LoggerMock);

        TestBed.configureTestingModule({
            imports: [MenuActionComponent, DynamicHtmlDirective],
            providers: [MockContext.providers, EmbeddableComponentsService],
            declarations: [TestHostComponent],
        });

        event = new Event('click');
        preventDefaultSpy = spyOn(event, 'preventDefault');
    });

    function initComponent() {
        setupComponentFactoryResolver();

        const embeddableComponentsService: EmbeddableComponentsService = TestBed.inject(EmbeddableComponentsService);
        embeddableComponentsService.registerEmbeddableComponent(MenuActionComponent);

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
    }

    function getElement(): HTMLElement {
        return fixture.nativeElement.querySelector('a');
    }

    describe('dynamic usage', () => {
        beforeEach(() => {
            initComponent();
        });

        it('should have original text and attribute', () => {
            const element = getElement();

            expect(element).toHaveText('Click Me');
            expect(element).toHaveAttr('menu-action', 'action');
        });

        it('should use menu actions service to go to url when clicked', () => {
            click();

            expect(preventDefaultSpy).toHaveBeenCalled();
            expect(menuActionsServiceMock.invoke).toHaveBeenCalledWith('action', 'Misc', [undefined, undefined, {}]);
        });
    });

    describe('static usage', () => {
        it('should use menu actions service service to go to url when clicked', () => {
            TestBed.overrideTemplate(TestHostComponent, '<div><a menu-action="action">Click Me</a></div>');
            initComponent();

            click();

            expect(menuActionsServiceMock.invoke).toHaveBeenCalledWith('action', 'Misc', [undefined, undefined, {}]);
        });

        it('should use menu actions service service to go to url when clicked and pass menu actions parameters', () => {
            TestBed.overrideTemplate(
                TestHostComponent,
                '<div><a menu-action="action" menu-action-keys=\'["cookieName", "expir"]\' menu-action-values=\'["test", "25896"]\'>Click Me</a></div>',
            );
            initComponent();

            click();

            expect(menuActionsServiceMock.invoke).toHaveBeenCalledWith('action', 'Misc', [
                undefined,
                undefined,
                { cookieName: 'test', expir: '25896' },
            ]);
        });

        it('should log a warning if it fails deserializing menu action parameters', () => {
            TestBed.overrideTemplate(
                TestHostComponent,
                '<div><a menu-action="action" menu-action-keys=\'["page\' menu-action-values=\'["p1"]\'>Click Me</a></div>',
            );
            initComponent();

            click();

            expect(loggerMock.warn).toHaveBeenCalled();
        });

        it('should log a warning if menu action keys dont deserialize to an array', () => {
            TestBed.overrideTemplate(
                TestHostComponent,
                '<div><a menu-action="action" menu-action-keys=\'"page"\' menu-action-values=\'["p1"]\'>Click Me</a></div>',
            );
            initComponent();

            click();

            expect(loggerMock.warn).toHaveBeenCalled();
        });

        it('should log a warning if menu action values dont deserialize to an array', () => {
            TestBed.overrideTemplate(
                TestHostComponent,
                '<div><a menu-action="action" menu-action-keys=\'["page"]\' menu-action-values=\'"p1"\'>Click Me</a></div>',
            );
            initComponent();

            click();

            expect(loggerMock.warn).toHaveBeenCalled();
        });

        it('should log a warning if it fails deserializing tracking data', () => {
            TestBed.overrideTemplate(
                TestHostComponent,
                '<div><a menu-action="action" data-tracking-event="event" data-tracking-keys=\'["page\' data-tracking-values=\'["p1"]\'>Click Me</a></div>',
            );
            initComponent();

            click();

            expect(loggerMock.warn).toHaveBeenCalled();
        });

        it('should log a warning if tracking keys dont deserialize to an array', () => {
            TestBed.overrideTemplate(
                TestHostComponent,
                '<div><a menu-action="action" data-tracking-event="event" data-tracking-keys=\'"page"\' data-tracking-values=\'["p1"]\'>Click Me</a></div>',
            );
            initComponent();

            click();

            expect(loggerMock.warn).toHaveBeenCalled();
        });

        it('should log a warning if tracking values dont deserialize to an array', () => {
            TestBed.overrideTemplate(
                TestHostComponent,
                '<div><a menu-action="action" data-tracking-event="event" data-tracking-keys=\'["page"]\' data-tracking-values=\'"p1"\'>Click Me</a></div>',
            );
            initComponent();

            click();

            expect(loggerMock.warn).toHaveBeenCalled();
        });

        it('should track when clicked', () => {
            TestBed.overrideTemplate(
                TestHostComponent,
                '<div><a menu-action="action" data-tracking-event="event" data-tracking-keys=\'["page"]\' data-tracking-values=\'["p1"]\'>Click Me</a></div>',
            );
            initComponent();

            click();

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('event', { page: 'p1' });
        });
    });

    function click() {
        const element = getElement();
        element.dispatchEvent(event);
        fixture.detectChanges();
    }
});
