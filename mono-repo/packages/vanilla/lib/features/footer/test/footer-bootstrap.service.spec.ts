import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { SingleSlot, SlotName, VanillaEventNames, ViewTemplateForClient } from '@frontend/vanilla/core';
import { FooterComponent } from '@frontend/vanilla/features/footer';
import { CopyrightComponent } from '@frontend/vanilla/shared/copy-right';
import { MockContext } from 'moxxi';

import { EventsServiceMock } from '../../../core/src/utils/test/utils.mock';
import { DateTimeServiceMock } from '../../../core/test/browser/datetime.service.mock';
import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { DynamicLayoutServiceMock } from '../../../core/test/dynamic-layout/dynamic-layout.mock';
import { FooterBootstrapService } from '../src/footer-bootstrap.service';
import { ResponsiveFooterContentMock } from './responsive-footer.mocks';

describe('FooterBootstrapService', () => {
    let service: FooterBootstrapService;
    let footerConfigMock: ResponsiveFooterContentMock;
    let dynamicLayoutServiceMock: DynamicLayoutServiceMock;
    let dslServiceMock: DslServiceMock;
    let dateTimeServiceMock: DateTimeServiceMock;
    let eventsServiceMock: EventsServiceMock;
    const showSpy: jasmine.Spy = jasmine.createSpy('show');
    const hideSpy: jasmine.Spy = jasmine.createSpy('hide');

    beforeEach(() => {
        footerConfigMock = MockContext.useMock(ResponsiveFooterContentMock);
        dynamicLayoutServiceMock = MockContext.useMock(DynamicLayoutServiceMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);
        dateTimeServiceMock = MockContext.useMock(DateTimeServiceMock);
        eventsServiceMock = MockContext.useMock(EventsServiceMock);

        footerConfigMock.isEnabledCondition = 'condition';
        dynamicLayoutServiceMock.getSlot.and.returnValue((<unknown>{ slotName: 'footer', show: showSpy, hide: hideSpy }) as SingleSlot);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, FooterBootstrapService],
        });

        service = TestBed.inject(FooterBootstrapService);
    });

    describe('onFeatureInit()', () => {
        it('should add footer if enabled and remove if not enabled', fakeAsync(() => {
            footerConfigMock.copyright = <ViewTemplateForClient>{ title: 'copy' };
            dateTimeServiceMock.now.and.returnValue(new Date(1578581243000));
            service.onFeatureInit();
            footerConfigMock.whenReady.next();

            tick();

            expect(dynamicLayoutServiceMock.setComponent).toHaveBeenCalledOnceWith(SlotName.Footer, FooterComponent, null);

            dslServiceMock.evaluateContent.next({ title: 'copy {year}' });
            tick();

            expect(dynamicLayoutServiceMock.addComponent).toHaveBeenCalledOnceWith(SlotName.FooterItems, CopyrightComponent, {
                copyright: 'copy 2020',
            });

            expect(eventsServiceMock.raise).toHaveBeenCalledWith({ eventName: VanillaEventNames.FooterLoaded });

            eventsServiceMock.allEvents.next({ eventName: VanillaEventNames.FooterSlotLoaded });
            tick();

            expect(dslServiceMock.evaluateExpression).toHaveBeenCalledWith('condition');
            dslServiceMock.evaluateExpression.next(true);

            expect(showSpy).toHaveBeenCalled();

            dslServiceMock.evaluateExpression.next(false);
            expect(hideSpy).toHaveBeenCalled();
        }));

        it('should not set CopyrightComponent if copyright is not set', fakeAsync(() => {
            service.onFeatureInit();
            footerConfigMock.whenReady.next();
            tick();

            expect(dynamicLayoutServiceMock.addComponent).not.toHaveBeenCalled();
        }));
    });
});
