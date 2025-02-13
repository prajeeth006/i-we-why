import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { RegistrationService } from '../src/registration.service';

describe('RegistrationInformationService', () => {
    let target: RegistrationService;
    let userServiceMock: UserServiceMock;
    let apiServiceMock: SharedFeaturesApiServiceMock;

    beforeEach(() => {
        userServiceMock = MockContext.useMock(UserServiceMock);
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, RegistrationService],
        });

        target = TestBed.inject(RegistrationService);
    });

    describe('load', () => {
        it('should not call api', () => {
            userServiceMock.isAuthenticated = false;

            target.load();

            expect(apiServiceMock.get).not.toHaveBeenCalled();
        });

        it('should call api and emit value', () => {
            const spy = jasmine.createSpy();
            target.registrationInformation.subscribe(spy);

            target.load();

            expect(apiServiceMock.get).toHaveBeenCalledWith('registrationinfo');

            apiServiceMock.get.next({ date: '10-12-2202', daysRegistered: 5 });

            expect(spy).toHaveBeenCalledWith({ date: '10-12-2202', daysRegistered: 5 });
        });
    });
});
