import { TestBed } from '@angular/core/testing';

import { GeolocationPosition, MappedGeolocation } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { GeolocationDslResolver } from '../src/geolocation-dsl-resolver';
import { GeolocationServiceMock } from './mocks';

describe('GeolocationDslResolver', () => {
    let target: GeolocationDslResolver;
    let geolocationServiceMock: GeolocationServiceMock;
    let spy: jasmine.Spy;

    beforeEach(() => {
        geolocationServiceMock = MockContext.useMock(GeolocationServiceMock);
        spy = jasmine.createSpy();

        TestBed.configureTestingModule({
            providers: [MockContext.providers, GeolocationDslResolver],
        });
        target = TestBed.inject(GeolocationDslResolver);
    });

    describe('getPosition()', () => {
        it('should get property from position', () => {
            const position = setupPosition();
            spy.withArgs(position).and.returnValue(666);

            // act
            const result = target.getPosition(spy);

            expect(result).toBe(666);
        });

        it('should replace null with zero', () => {
            setupPosition();

            // act
            const result = target.getPosition(spy);

            expect(result).toBe(0);
        });

        it('should throw if no position', () => {
            const act = () => target.getPosition(spy);

            expect(act).toThrowMatching((e) => e.message.includes('no position') && e.message.includes('HasPosition'));
            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe('getLocation()', () => {
        runPropertyTest('valid string', 'xxx', 'xxx');
        runPropertyTest('null', null, '');
        runPropertyTest('undefined', undefined, '');

        function runPropertyTest(conditionDesc: string, property: string | null | undefined, expected: string) {
            it(`should get property from location if ${conditionDesc}`, () => {
                const location = <MappedGeolocation>{};
                setupPosition(location);
                spy.withArgs(location).and.returnValue(property);

                // act
                const result = target.getLocation(spy);

                expect(result).toBe(expected);
            });
        }

        runEmptyTest('no location nor positon', () => {});
        runEmptyTest('no location', () => setupPosition());

        function runEmptyTest(conditionDesc: string, setup: () => void) {
            it(`should get null if ${conditionDesc}`, () => {
                setup();

                // act
                const result = target.getLocation(spy);

                expect(result).toBe('');
                expect(spy).not.toHaveBeenCalled();
            });
        }
    });

    describe('hasPosition', () => {
        it('should return true if there is position', () => {
            setupPosition();

            // act
            const result = target.hasPosition();

            expect(result).toBeTrue();
        });

        it('should return false if there is no position', () => {
            // act
            const result = target.hasPosition();

            expect(result).toBeFalse();
        });
    });

    function setupPosition(mappedLocation?: MappedGeolocation) {
        const position = <GeolocationPosition>{ mappedLocation };
        geolocationServiceMock.positionChanges.next(position);
        return position;
    }
});
