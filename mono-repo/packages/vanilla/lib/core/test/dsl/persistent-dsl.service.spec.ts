import { TestBed } from '@angular/core/testing';

import { DSL_NOT_READY, PersistentDslLoadOptions, PersistentDslService, UserLoginEvent } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { UserServiceMock } from '../../../core/test/user/user.mock';

describe('PersistentDslService', () => {
    let service: PersistentDslService;
    let userServiceMock: UserServiceMock;
    const options: PersistentDslLoadOptions = { fetchEnabled: true };
    const fetchSpy = jasmine.createSpy();

    beforeEach(() => {
        userServiceMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, PersistentDslService],
        });

        service = TestBed.inject(PersistentDslService);
    });

    describe('getResult()', () => {
        it('should work correctly', () => {
            let result = service.getResult<boolean>(options, fetchSpy, () => null);
            expect(result).toBe(DSL_NOT_READY);
            expect(options.fetchEnabled).toBeFalse();
            expect(fetchSpy).toHaveBeenCalledTimes(1);

            result = service.getResult<boolean>(options, fetchSpy, () => false);
            expect(result).toBeFalse();
            expect(fetchSpy).toHaveBeenCalledTimes(1);

            userServiceMock.triggerEvent(new UserLoginEvent());
            expect(fetchSpy).toHaveBeenCalledTimes(2);
        });
    });
});
