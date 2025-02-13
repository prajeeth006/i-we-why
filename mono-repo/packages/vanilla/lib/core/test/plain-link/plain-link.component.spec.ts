import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DynamicHtmlDirective, EmbeddableComponentsService, PlainLinkComponent } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { getBaseUrl } from '../../../test/test-utils';
import { LoggerMock } from '../languages/logger.mock';
import { NavigationServiceMock } from '../navigation/navigation.mock';

@Component({
    template: '<div [vnDynamicHtml]="template"></div>',
})
class TestHostComponent {
    template: string = '<div><a href="/en/path">Click Me</a></div>';
}

describe('PlainLinkComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let navigationServiceMock: NavigationServiceMock;
    let trackingServiceMock: TrackingServiceMock;
    let loggerMock: LoggerMock;
    let event: Event;
    let preventDefaultSpy: jasmine.Spy;

    beforeEach(() => {
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);
        loggerMock = MockContext.useMock(LoggerMock);

        TestBed.configureTestingModule({
            imports: [PlainLinkComponent, DynamicHtmlDirective],
            providers: [MockContext.providers, EmbeddableComponentsService],
            declarations: [TestHostComponent],
        });

        event = new Event('click');
        preventDefaultSpy = spyOn(event, 'preventDefault');
    });

    function initComponent() {
        const embeddableComponentsService: EmbeddableComponentsService = TestBed.inject(EmbeddableComponentsService);
        embeddableComponentsService.registerEmbeddableComponent(PlainLinkComponent);

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
    }

    function getElement(): HTMLElement {
        return fixture.nativeElement.querySelector('a');
    }

    describe('dynamic usage', () => {
        beforeEach(() => {
            TestBed.overrideTemplate(TestHostComponent, '<div><a href="/en/path">Click Me</a></div>');
            initComponent();
        });

        it('should have original text and href', () => {
            const element = getElement();

            expect(element).toHaveText('Click Me');
            expect(element).toHaveAttr('href', '/en/path');
        });

        it('should use navigation service to go to url when clicked', () => {
            click();

            expectClientNavigation();
        });

        it('should navigate once on multiple clicks', () => {
            click();
            click();

            expect(navigationServiceMock.goTo).toHaveBeenCalledTimes(1);
            expect(preventDefaultSpy).toHaveBeenCalledTimes(2);
        });
    });

    describe('static usage', () => {
        it('should use navigation service to go to url when clicked', () => {
            TestBed.overrideTemplate(TestHostComponent, '<div><a href="/en/path">Click Me</a></div>');
            initComponent();

            click();

            expectClientNavigation();
        });

        it('should log a warning if it fails deserializing tracking data', () => {
            TestBed.overrideTemplate(
                TestHostComponent,
                '<div><a href="/en/path" data-tracking-event="event" data-tracking-keys=\'["page\' data-tracking-values=\'["p1"]\' >Click Me</a></div>',
            );
            initComponent();

            click();

            expect(loggerMock.warn).toHaveBeenCalled();
            expectClientNavigation();
        });

        it('should log a warning if tracking keys dont deserialize to an array', () => {
            TestBed.overrideTemplate(
                TestHostComponent,
                '<div><a href="/en/path" data-tracking-event="event" data-tracking-keys=\'"page"\' data-tracking-values=\'["p1"]\' >Click Me</a></div>',
            );
            initComponent();

            click();

            expect(loggerMock.warn).toHaveBeenCalled();
            expectClientNavigation();
        });

        it('should log a warning if tracking values dont deserialize to an array', () => {
            TestBed.overrideTemplate(
                TestHostComponent,
                '<div><a href="/en/path" data-tracking-event="event" data-tracking-keys=\'["page"]\' data-tracking-values=\'"p1"\' >Click Me</a></div>',
            );
            initComponent();

            click();

            expect(loggerMock.warn).toHaveBeenCalled();
            expectClientNavigation();
        });

        testTemplate(
            '<a href="javascript:alert()">Click Me</a>',
            false,
            false,
            null,
            null,
            'should not client navigate if url starts with javascript',
        );
        testTemplate('<a href="mailto:lol@lol.lol">Click Me</a>', false, false, null, null, 'should not client navigate if url starts with mailto');
        testTemplate('<a href="tel:777888999">Click Me</a>', false, false, null, null, 'should not client navigate if url starts with tel');
        testTemplate('<a target="_blank" href="/en/path">Click Me</a>', false, false, null, null, 'should not client navigate link has target');
        testTemplate('<a target="_self" href="/en/path">Click Me</a>', true, true, null, null, 'should client navigate link has target=_self');
        testTemplate('<a href="#">Click Me</a>', false, true, null, null, 'should not client navigate but preventDefault link href is #');
        testTemplate('<a href="">Click Me</a>', false, true, null, null, 'should not client navigate but preventDefault link href is empty');
        testTemplate(
            '<a data-tracking-event="event" data-tracking-keys=\'["page"]\' data-tracking-values=\'["p1"]\' href="/en/path">Click Me</a>',
            true,
            true,
            'event',
            { page: 'p1' },
            'should track',
        );

        function testTemplate(
            template: string,
            clientNav: boolean,
            shouldPreventDefault: boolean,
            trackingEvent: string | null,
            trackingData: any,
            description: string,
        ) {
            it(description, () => {
                TestBed.overrideTemplate(TestHostComponent, template);
                initComponent();

                const component: PlainLinkComponent = fixture.debugElement.query(By.directive(PlainLinkComponent)).componentInstance;

                event = {
                    currentTarget: getElement(),
                    preventDefault: jasmine.createSpy(),
                } as any;

                preventDefaultSpy = event.preventDefault as any;

                component.onClick(event);

                if (trackingEvent) {
                    expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith(trackingEvent, trackingData || {});
                } else {
                    expect(trackingServiceMock.triggerEvent).not.toHaveBeenCalled();
                }

                if (clientNav) {
                    expectClientNavigation();
                } else {
                    expect(navigationServiceMock.goTo).not.toHaveBeenCalled();
                }

                if (shouldPreventDefault) {
                    expect(preventDefaultSpy).toHaveBeenCalled();
                } else {
                    expect(preventDefaultSpy).not.toHaveBeenCalled();
                }
            });
        }
    });

    function click() {
        const element = getElement();
        element.dispatchEvent(event);
        fixture.detectChanges();
    }

    function expectClientNavigation() {
        expect(navigationServiceMock.goTo).toHaveBeenCalledWith(getBaseUrl() + '/en/path');
        expect(preventDefaultSpy).toHaveBeenCalled();
    }
});
