import { TestBed } from '@angular/core/testing';

import { DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { MediaDslValuesProvider } from '../../../src/dsl/value-providers/media-dsl-values-provider';
import { DeviceServiceMock } from '../../browser/device.mock';
import { MediaQueryServiceMock } from '../../browser/media-query.service.mock';
import { DslCacheServiceMock } from '../dsl-cache.mock';

describe('MediaDslValuesProvider', () => {
    let provider: MediaDslValuesProvider;
    let dslCacheServiceMock: DslCacheServiceMock;
    let mediaQueryServiceMock: MediaQueryServiceMock;
    let deviceServiceMock: DeviceServiceMock;

    beforeEach(() => {
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);
        mediaQueryServiceMock = MockContext.useMock(MediaQueryServiceMock);
        deviceServiceMock = MockContext.useMock(DeviceServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, MediaDslValuesProvider],
        });

        provider = TestBed.inject(MediaDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();
    });

    describe('IsActive', () => {
        it('should return a true if query matches', () => {
            mediaQueryServiceMock.isActive.withArgs('gt-xs').and.returnValue(true);

            const value = provider.getProviders()['Media']!['IsActive']('gt-xs');

            expect(value).toBeTrue();
        });
    });

    describe('Orientation', () => {
        it('should return a true if query matches', () => {
            deviceServiceMock.currentOrientation = 'landscape';

            const value = provider.getProviders()['Media']!['Orientation'];

            expect(value).toBe('landscape');
        });
    });

    describe('watcher', () => {
        it('should invalidate cache if media changes', () => {
            mediaQueryServiceMock.observe.next({
                matches: true,
                breakpoints: {
                    qq: true,
                },
            });
            // don't invalidate at page load
            expect(dslCacheServiceMock.invalidate).not.toHaveBeenCalled();

            // don't invalidate when no changes
            mediaQueryServiceMock.observe.next({
                matches: true,
                breakpoints: {
                    qq: true,
                },
            });
            expect(dslCacheServiceMock.invalidate).not.toHaveBeenCalled();

            mediaQueryServiceMock.observe.next({
                matches: true,
                breakpoints: {
                    qq: false,
                },
            });

            expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith(['media.query']);
            dslCacheServiceMock.invalidate.calls.reset();

            mediaQueryServiceMock.observe.next({
                matches: true,
                breakpoints: {
                    qq: true,
                    dd: false,
                },
            });

            expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith(['media.query']);
        });

        it('should invalidate cache if orientation changes', () => {
            expect(dslCacheServiceMock.invalidate).not.toHaveBeenCalled();

            deviceServiceMock.orientation.next('landscape');

            expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith(['media.orientation']);
        });
    });
});
