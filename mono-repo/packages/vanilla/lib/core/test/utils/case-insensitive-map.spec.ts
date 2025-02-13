import { CaseInsensitiveMap } from '@frontend/vanilla/core';

describe('CaseInsensitiveMap', () => {
    it('should be case-insensitive', () => {
        const map: Map<string, number> = new CaseInsensitiveMap();

        expect(map.size).toBe(0);
        expect(map.get('foo')).toBeUndefined();
        expect(map.has('foo')).toBeFalse();

        let spy = jasmine.createSpy();
        map.forEach(spy);
        expect(spy).not.toHaveBeenCalled();

        map.set('foo', 666);

        expect(map.size).toBe(1);
        expect(map.get('foo')).toBe(666);
        expect(map.get('FOO')).toBe(666);
        expect(map.has('foo')).toBeTrue();
        expect(map.has('FOO')).toBeTrue();

        spy = jasmine.createSpy();
        map.forEach(spy);
        expect(spy).toHaveBeenCalledWith(666, 'foo', map);

        map.delete('foo');
        expect(map.size).toBe(0);
    });
});
