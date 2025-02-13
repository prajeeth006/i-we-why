import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { DynamicLayoutSlotComponent, SlotName, SlotType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { EventsServiceMock } from '../../../core/src/utils/test/utils.mock';
import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { DomSanitizerMock } from '../../../features/account-menu/test/dom-change.mock';
import { PageMock } from '../browsercommon/page.mock';
import { DynamicLayoutConfigMock } from './dynamic-layout.client-config.mock';
import { DynamicLayoutServiceMock } from './dynamic-layout.mock';

describe('DynamicLayoutSlotComponent', () => {
    let fixture: ComponentFixture<DynamicLayoutSlotComponent>;
    let component: DynamicLayoutSlotComponent;
    let dynamicLayoutConfigMock: DynamicLayoutConfigMock;
    let dynamicLayoutServiceMock: DynamicLayoutServiceMock;
    let dslServiceMock: DslServiceMock;
    let eventsServiceMock: EventsServiceMock;

    beforeEach(() => {
        dynamicLayoutConfigMock = MockContext.useMock(DynamicLayoutConfigMock);
        dynamicLayoutServiceMock = MockContext.useMock(DynamicLayoutServiceMock);
        eventsServiceMock = MockContext.useMock(EventsServiceMock);
        MockContext.useMock(PageMock);
        MockContext.useMock(DomSanitizerMock);

        dslServiceMock = MockContext.useMock(DslServiceMock);

        dynamicLayoutConfigMock.slots = {
            app: {
                type: SlotType.Single,
                isEnabledCondition: 'true',
                content: [],
            },
        };

        TestBed.overrideComponent(DynamicLayoutSlotComponent, {
            set: {
                providers: [MockContext.providers],
                imports: [CommonModule],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(DynamicLayoutSlotComponent);
        component = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
        it('should get and show hard-coded slot initially', () => {
            component.slot = SlotName.Bottom;

            dynamicLayoutServiceMock.getSlot.withArgs(SlotName.Bottom, SlotType.Any).and.returnValue({
                show: jasmine.createSpy('show'),
                display: () => {},
            });
            fixture.detectChanges();

            expect(dynamicLayoutServiceMock.getSlot).toHaveBeenCalledOnceWith(SlotName.Bottom, SlotType.Any);
            expect(component.layoutSlot.show).toHaveBeenCalled();
            expect(dslServiceMock.evaluateExpression).not.toHaveBeenCalled();
            expect(component.templates).toBeUndefined();
        });

        it('should get slot from config and evaluate DSL expression', fakeAsync(() => {
            component.slot = SlotName.App;
            dynamicLayoutServiceMock.getSlot.withArgs(SlotName.App, SlotType.Any).and.throwError('');
            fixture.detectChanges();

            dynamicLayoutServiceMock.getSlot.withArgs(SlotName.App, SlotType.Single).and.returnValue({ show: jasmine.createSpy('show') });
            dynamicLayoutConfigMock.whenReady.next();
            tick();

            expect(dynamicLayoutServiceMock.getSlot).toHaveBeenCalledWith(SlotName.App, SlotType.Single);
            expect(dslServiceMock.evaluateExpression).toHaveBeenCalledOnceWith('true');
            expect(component.templates).toEqual([]);
        }));

        it('should raise event if slot is footer slot', () => {
            component.slot = SlotName.Footer;

            dynamicLayoutServiceMock.getSlot.withArgs(SlotName.Footer, SlotType.Any).and.returnValue({
                show: jasmine.createSpy('show'),
                display: () => {},
            });
            fixture.detectChanges();

            expect(dynamicLayoutServiceMock.getSlot).toHaveBeenCalledOnceWith(SlotName.Footer, SlotType.Any);
            expect(component.layoutSlot.show).toHaveBeenCalled();
            expect(dslServiceMock.evaluateExpression).not.toHaveBeenCalled();
            expect(eventsServiceMock.raise).toHaveBeenCalled();
        });
    });
});
