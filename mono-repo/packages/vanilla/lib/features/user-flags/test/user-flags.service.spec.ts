import { TestBed } from '@angular/core/testing';

import { UserFlagsService } from '@frontend/vanilla/features/user-flags';
import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { RtmsServiceMock } from '../../../shared/rtms/test/stubs/rtms-mocks';

describe('UserFlagsService', () => {
    let target: UserFlagsService;
    let sharedFeaturesApiServiceMock: SharedFeaturesApiServiceMock;
    let rtmsServiceMock: RtmsServiceMock;

    beforeEach(() => {
        sharedFeaturesApiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);
        rtmsServiceMock = MockContext.useMock(RtmsServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, UserFlagsService],
        });

        target = TestBed.inject(UserFlagsService);
    });

    describe('load', () => {
        it('should call userflags api', () => {
            runTest();
        });

        it('should emit when rtms message with flags is received', () => {
            const spy = runTest();
            spy.calls.reset();

            rtmsServiceMock.messages.next({
                type: 'UPDATE_CRM_FLAG_EVENT',
                payload: {
                    accountName: 'mrco',
                    flags: [
                        { name: 'OFFER', value: 'disabled' },
                        { name: 'translate', value: 'disabled' },
                    ],
                },
            } as any);

            expect(sharedFeaturesApiServiceMock.get).toHaveBeenCalledWith('userflags/invalidatecache');
            expect(spy).toHaveBeenCalledWith([
                { name: 'communication', value: 'disabled' },
                { name: 'OFFER', value: 'disabled' },
                { name: 'translate', value: 'disabled' },
            ]);
        });

        it('should not emit when rtms message does not contains user flags', () => {
            const spy = runTest();
            spy.calls.reset();

            rtmsServiceMock.messages.next({
                type: 'UPDATE_CRM_FLAG_EVENT',
                payload: { accountName: 'mrco', flags: [] },
            } as any);

            expect(sharedFeaturesApiServiceMock.get).not.toHaveBeenCalledWith('userflags/invalidatecache');
            expect(spy).not.toHaveBeenCalled();
        });

        it('should not emit when rtms message type is not correct', () => {
            const spy = runTest();
            spy.calls.reset();

            rtmsServiceMock.messages.next({ type: 'UPDATE_TEST', payload: { accountName: 'mrco', flags: [] } } as any);

            expect(spy).not.toHaveBeenCalled();
        });

        it('should call api only ones', () => {
            target.load();

            expect(sharedFeaturesApiServiceMock.get).toHaveBeenCalledWith('userflags');
            sharedFeaturesApiServiceMock.get.calls.reset();

            target.load();

            expect(sharedFeaturesApiServiceMock.get).not.toHaveBeenCalledWith('userflags');
        });
    });

    describe('flags', () => {
        it('should be null when not loaded', () => {
            const spy = jasmine.createSpy();
            target.flags.subscribe(spy);

            expect(spy).toHaveBeenCalledWith(null);
        });
    });

    function runTest(): jasmine.Spy {
        target.load();
        const spy = jasmine.createSpy();
        target.flags.subscribe(spy);

        expect(sharedFeaturesApiServiceMock.get).toHaveBeenCalledWith('userflags');

        sharedFeaturesApiServiceMock.get.next({
            userFlags: [
                { name: 'offer', value: 'enabled' },
                { name: 'communication', value: 'disabled' },
            ],
        });

        expect(spy).toHaveBeenCalledWith([
            { name: 'offer', value: 'enabled' },
            { name: 'communication', value: 'disabled' },
        ]);

        return spy;
    }
});
