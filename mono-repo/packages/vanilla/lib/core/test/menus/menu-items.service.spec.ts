import { MenuItemsService } from '@frontend/vanilla/core';

describe('MenuItemsService', () => {
    let service: MenuItemsService;

    beforeEach(() => {
        service = new MenuItemsService();
    });

    describe('counters', () => {
        it('should set counter', () => {
            service.setCounter('sec', 'item', 5, 'class');

            expect(service.getCounter('sec', 'item')).toEqual({ count: 5, cssClass: 'class', type: undefined });
        });

        it('should initialize counter with get and then update it', () => {
            const counter = service.getCounter('sec', 'item');

            expect(counter?.count).toBeUndefined();
            expect(counter?.cssClass).toBeUndefined();

            service.setCounter('sec', 'item', 5, 'class');

            expect(counter?.count).toBe(5);
            expect(counter?.cssClass).toBe('class');
        });
    });

    describe('active', () => {
        it('should set active', () => {
            service.setActive('sec', 'item');

            expect(service.isActive('sec', 'item')).toBeTrue();
        });

        it('return false for not active item', () => {
            expect(service.isActive('sec', 'item')).toBeFalse();
        });
    });

    describe('setDescription', () => {
        it('should set description', () => {
            service.setDescription('sec', 'item', 'desc');

            expect(service.getDescription('sec', 'item')).toBe('desc');
        });
    });

    describe('setDescriptionCssClass', () => {
        it('should set description', () => {
            service.setDescriptionCssClass('sec', 'item', 'desc');

            expect(service.getDescriptionCssClass('sec', 'item')).toBe('desc');
        });
    });
});
