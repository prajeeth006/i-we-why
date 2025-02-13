import { DynamicLayoutService, MultiSlot, SingleSlot, SlotName, SlotType } from '@frontend/vanilla/core';

class MyComponent {}

class MyComponent2 {}

describe('DynamicLayoutService', () => {
    let service: DynamicLayoutService;
    const attr = { arg: '1' };

    beforeEach(() => {
        service = new DynamicLayoutService();
    });

    describe('registerSlot()', () => {
        it('should throw when name is already registered', () => {
            service.registerSlot(SlotName.App, SlotType.Single);
            expect(() => {
                service.registerSlot(SlotName.App, SlotType.Single);
            }).toThrowError();
        });
    });

    describe('single slot', () => {
        beforeEach(() => {
            service.registerSlot(SlotName.App, SlotType.Single);
        });

        describe('setComponent()', () => {
            it('should set component to registered slot', () => {
                service.setComponent(SlotName.App, MyComponent, attr);

                const slot = service.getSlot<SingleSlot>(SlotName.App, SlotType.Single);

                expect(slot.component!.component).toBe(MyComponent);
                expect(slot.component!.attr).toBe(attr);
            });
        });

        describe('removeComponent()', () => {
            it('should remove component from slot', () => {
                service.setComponent(SlotName.App, MyComponent, attr);
                service.removeComponent(SlotName.App);

                const slot = service.getSlot<SingleSlot>(SlotName.App, SlotType.Single);

                expect(slot.component).toBeNull();
            });
        });

        describe('getSlot()', () => {
            it('should throw when requesting single slot as multi', () => {
                expect(() => {
                    service.getSlot(SlotName.App, SlotType.Multi);
                }).toThrowError();
            });

            it('should throw if slot does not exist', () => {
                expect(() => {
                    service.getSlot(SlotName.Header, SlotType.Single);
                }).toThrowError();
            });
        });
    });

    describe('multi slot', () => {
        beforeEach(() => {
            service.registerSlot(SlotName.App, SlotType.Multi);
        });

        describe('addComponent()', () => {
            it('should add components to registered slot', () => {
                service.addComponent(SlotName.App, MyComponent, attr);
                service.addComponent(SlotName.App, MyComponent2);

                const slot = service.getSlot<MultiSlot>(SlotName.App, SlotType.Multi);

                expect(slot.components[0]!.component).toBe(MyComponent);
                expect(slot.components[0]!.attr).toBe(attr);

                expect(slot.components[1]!.component).toBe(MyComponent2);
                expect(slot.components[1]!.attr).toBeUndefined();
            });

            it('should not allow multiples of the same component', () => {
                service.addComponent(SlotName.App, MyComponent, attr);

                expect(() => {
                    service.addComponent(SlotName.App, MyComponent);
                }).toThrowError();
            });
        });

        describe('removeComponent()', () => {
            it('should remove component from slot', () => {
                service.addComponent(SlotName.App, MyComponent, attr);
                service.removeComponent(SlotName.App, MyComponent);

                const slot = service.getSlot<MultiSlot>(SlotName.App, SlotType.Multi);

                expect(slot.components.length).toBe(0);
            });
        });

        describe('removeComponents()', () => {
            it('should remove all components from slot', () => {
                service.addComponent(SlotName.App, MyComponent, attr);
                service.addComponent(SlotName.App, MyComponent2, attr);
                service.removeComponents(SlotName.App);

                const slot = service.getSlot<MultiSlot>(SlotName.App, SlotType.Multi);

                expect(slot.components.length).toBe(0);
            });
        });

        describe('getSlot()', () => {
            it('should throw when requesting multi slot as single', () => {
                expect(() => {
                    service.getSlot(SlotName.App, SlotType.Single);
                }).toThrowError();
            });
        });
    });

    describe('getSlots()', () => {
        it('should return registered slots', () => {
            service.registerSlot(SlotName.App, SlotType.Single);
            service.registerSlot(SlotName.Header, SlotType.Multi);

            const slots = service.getSlots();

            expect(Object.keys(slots).length).toBe(2);

            expect(slots[0]!.slotName).toBe(SlotName.App);
            expect(slots[0] instanceof SingleSlot);

            expect(slots[1]!.slotName).toBe(SlotName.Header);
            expect(slots[1] instanceof MultiSlot);
        });
    });
});
