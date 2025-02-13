import { GenericActionsService } from '@frontend/vanilla/core';

describe('GenericActionsService', () => {
    let service: GenericActionsService;
    let spy: jasmine.Spy;

    beforeEach(() => {
        service = new GenericActionsService();

        spy = jasmine.createSpy();
        service.register('testFn', spy);
    });

    describe('isRegistered()', () => {
        it('should return true for registered actions', () => {
            expect(service.isRegistered('testFn')).toBeTrue();
            expect(service.isRegistered('testFn1')).toBeFalse();
        });
    });

    describe('invoke()', () => {
        it('should invoke a function', () => {
            service.invoke('testFn', ['arg']);

            expect(spy).toHaveBeenCalledWith('arg');
        });

        it('should throw an error if function is not registered', () => {
            expect(() => service.invoke('testFn1')).toThrowError();
        });
    });
});
