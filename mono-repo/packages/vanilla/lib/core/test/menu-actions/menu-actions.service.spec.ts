import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MenuActionItem, MenuActionOrigin, MenuActionsService, WebAnalyticsEventType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../src/tracking/test/tracking.mock';
import { DslServiceMock } from '../dsl/dsl.mock';
import { NativeAppServiceMock } from '../native-app/native-app.mock';
import { NavigationServiceMock } from '../navigation/navigation.mock';

describe('MenuActionsService', () => {
    let service: MenuActionsService;
    let navigationServiceMock: NavigationServiceMock;
    let dslServiceMock: DslServiceMock;
    let nativeAppServiceMock: NativeAppServiceMock;
    let trackingServiceMock: TrackingServiceMock;

    let spy: jasmine.Spy;
    let promiseSpy: jasmine.PromiseSpy;

    beforeEach(() => {
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, MenuActionsService],
        });

        service = TestBed.inject(MenuActionsService);

        spy = jasmine.createSpy('spy');
        promiseSpy = jasmine.promise();

        service.register('testFn', spy);
        service.register('testPromiseFn', promiseSpy);
    });

    function fakeScheduleWaiting() {
        return new Promise((resolve) => setTimeout(resolve, 50));
    }

    describe('invoke()', () => {
        it('should invoke a function', () => {
            service.invoke('testFn', MenuActionOrigin.Menu, ['arg']);

            expect(spy).toHaveBeenCalledWith('Menu', 'arg');
        });

        it('should redirect to url return by the function', () => {
            const testUrl = 'http://www.google.com/';
            spy.and.returnValue(testUrl);

            service.invoke('testFn', MenuActionOrigin.Menu, ['arg']);

            expect(navigationServiceMock.goTo).toHaveBeenCalledWith(testUrl);
        });

        it('should return a promise resolved by the function if it also return a promise', fakeAsync(() => {
            const callbackSpy = jasmine.createSpy('callbackSpy');

            service.invoke('testPromiseFn', MenuActionOrigin.Menu, ['arg']).then(callbackSpy);

            promiseSpy.resolve();
            tick();

            expect(callbackSpy).toHaveBeenCalled();
        }));

        it('should redirect to url if no function is found and first arg is url', () => {
            const testUrl = 'http://www.google.com/';

            service.invoke(undefined, MenuActionOrigin.Menu, [testUrl]);

            expect(navigationServiceMock.goTo).toHaveBeenCalledWith(testUrl);
        });

        it('should do nothing if no function is found and no args are passed', () => {
            service.invoke(undefined, MenuActionOrigin.Menu);
        });
    });

    describe('processClick()', () => {
        let event: Event;

        beforeEach(() => {
            event = <any>{
                preventDefault: jasmine.createSpy('preventDefault'),
            };
        });

        it('should prevent default event and invoke action with fallback url', async () => {
            const item: MenuActionItem = {
                clickAction: 'testFn',
                url: 'url',
                target: 'target',
                parameters: {
                    a: 'b',
                },
            };

            service.processClick(event, item, MenuActionOrigin.Footer);
            trackingServiceMock.triggerEvent.and.returnValue('');
            await fakeScheduleWaiting();

            expect(dslServiceMock.evaluateExpression).toHaveBeenCalledWith('false');
            dslServiceMock.evaluateExpression.next();
            await fakeScheduleWaiting();

            expect(event.preventDefault).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith('Footer', 'url', 'target', { a: 'b' });
        });

        it('should pass in empty object if there are no parameters', async () => {
            const item: MenuActionItem = {
                clickAction: 'testFn',
                url: 'url',
                target: 'target',
            };

            service.processClick(event, item, MenuActionOrigin.Footer);
            trackingServiceMock.triggerEvent.and.returnValue('');
            dslServiceMock.evaluateExpression.next();
            await fakeScheduleWaiting();

            expect(event.preventDefault).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith('Footer', 'url', 'target', {});
        });

        it('should call tracking service if event specified', () => {
            const item: MenuActionItem = {
                clickAction: 'testFn',
                url: 'url',
                target: 'target',
                trackEvent: {
                    eventName: 'test',
                    data: { a: '' },
                },
            };

            service.processClick(event, item, MenuActionOrigin.Footer);

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('test', { a: '' });
        });

        it('should call tracking service if web analytics specified', () => {
            const item: MenuActionItem = {
                clickAction: 'testFn',
                url: 'url',
                target: 'target',
                webAnalytics: `{
                    "click": {
                        "eventName": "Event.Tracking",
                        "data": {
                            "component.CategoryEvent": "my profile",
                            "component.LabelEvent": "my menu",
                            "component.ActionEvent": "click",
                            "component.PositionEvent": "not applicable",
                            "component.LocationEvent": "menu drawer",
                            "component.EventDetails": "menu drawer",
                            "component.URLClicked": "not applicable"
                        }
                    }
                }`,
            };

            service.processClick(event, item, MenuActionOrigin.Footer);

            expect(trackingServiceMock.trackEvents).toHaveBeenCalledWith(item, WebAnalyticsEventType.click);
        });

        it('should not prevent default event and not invoke action if target is specified and menu action is not', () => {
            const item: MenuActionItem = {
                url: 'url',
                target: 'target',
            };

            service.processClick(event, item, MenuActionOrigin.Footer);

            expect(event.preventDefault).not.toHaveBeenCalled();
            expect(dslServiceMock.evaluateExpression).not.toHaveBeenCalledWith();
            expect(spy).not.toHaveBeenCalled();
        });

        it('should not prevent default event and not invoke action if ctrl button is pressed and menu action is not specified', () => {
            const item: MenuActionItem = {
                url: 'url',
            };

            ((<KeyboardEvent>event).ctrlKey as any) = true;

            service.processClick(event, item, MenuActionOrigin.Footer);

            expect(event.preventDefault).not.toHaveBeenCalled();
            expect(dslServiceMock.evaluateExpression).not.toHaveBeenCalledWith();
            expect(spy).not.toHaveBeenCalled();
        });

        it('should send CCB event in native app when ccb-navigation condition is true', async () => {
            nativeAppServiceMock.isNative = true;
            const item: MenuActionItem = {
                url: 'url',
                name: 'name',
                parameters: {
                    'ccb-navigation': 'cond',
                },
            };

            service.processClick(event, item, MenuActionOrigin.Menu);
            trackingServiceMock.triggerEvent.and.returnValue('');
            await fakeScheduleWaiting();

            expect(dslServiceMock.evaluateExpression).toHaveBeenCalledWith('cond');
            dslServiceMock.evaluateExpression.next(true);
            await fakeScheduleWaiting();

            expect(event.preventDefault).toHaveBeenCalled();
            expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledWith({
                eventName: 'MENU_ITEM_NAVIGATION',
                parameters: { url: 'url', name: 'name', section: MenuActionOrigin.Menu },
            });
        });

        it('should send CCB event with custom name in native app when ccb-navigation condition is true', async () => {
            nativeAppServiceMock.isNative = true;
            const item: MenuActionItem = {
                url: 'url',
                name: 'name',
                parameters: {
                    'ccb-navigation': 'cond',
                    'ccb-event-name': 'open-event',
                },
            };

            service.processClick(event, item, MenuActionOrigin.Menu);
            trackingServiceMock.triggerEvent.and.returnValue('');
            await fakeScheduleWaiting();
            expect(dslServiceMock.evaluateExpression).toHaveBeenCalledWith('cond');
            dslServiceMock.evaluateExpression.next(true);
            await fakeScheduleWaiting();

            expect(event.preventDefault).toHaveBeenCalled();
            expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledWith({
                eventName: 'open-event',
                parameters: { url: 'url', name: 'name', section: MenuActionOrigin.Menu },
            });
        });

        it('should not send CCB event in not native app even when ccb-navigation condition is true', async () => {
            const item: MenuActionItem = {
                url: 'url',
                name: 'name',
                parameters: {
                    'ccb-navigation': 'cond',
                },
            };

            service.processClick(event, item, MenuActionOrigin.Menu);
            trackingServiceMock.triggerEvent.and.returnValue('');
            await fakeScheduleWaiting();

            expect(dslServiceMock.evaluateExpression).toHaveBeenCalledWith('cond');
            dslServiceMock.evaluateExpression.next(true);

            expect(event.preventDefault).toHaveBeenCalled();
            expect(nativeAppServiceMock.sendToNative).not.toHaveBeenCalledWith();
            expect(spy).not.toHaveBeenCalled();
        });
    });
});
