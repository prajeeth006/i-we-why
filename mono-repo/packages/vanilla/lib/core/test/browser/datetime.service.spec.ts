import { TestBed, fakeAsync } from '@angular/core/testing';

import { DateTimeService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { UserServiceMock } from '../user/user.mock';

describe('DateTimeService', () => {
    let service: DateTimeService;
    let userServiceMock: UserServiceMock;

    beforeEach(() => {
        userServiceMock = MockContext.useMock(UserServiceMock);
        TestBed.configureTestingModule({
            providers: [MockContext.providers, DateTimeService],
        });

        service = TestBed.inject(DateTimeService);
    });

    describe('now', () => {
        it('should return datetime now', fakeAsync(() => {
            const date = new Date();
            expect(service.now()).toEqual(date);
        }));
    });

    describe('convertToUserTimezone', () => {
        it('should convert datetime now to user time zone', () => {
            const date = new Date();
            expect(service.convertLocalToUserTimezone(date)).toEqual(
                new Date(date.getTime() + date.getTimezoneOffset() * 60000 + userServiceMock.userTimezoneUtcOffset * 60000),
            );
        });
    });
});
