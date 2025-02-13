import { TestBed } from '@angular/core/testing';

import { DSL_NOT_READY, DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DslCacheServiceMock } from '../../../core/test/dsl/dsl-cache.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { RegistrationDslValuesProvider } from '../src/registration-dsl-values-provider.service';
import { RegistrationInformation } from '../src/registration.models';
import { RegistrationServiceMock } from './registration.mock';

describe('RegistrationDslValuesProvider', () => {
    let target: DslRecordable;
    let registrationServiceMock: RegistrationServiceMock;
    let dslCacheServiceMock: DslCacheServiceMock;
    let userServiceMock: UserServiceMock;

    beforeEach(() => {
        registrationServiceMock = MockContext.useMock(RegistrationServiceMock);
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, RegistrationDslValuesProvider],
        });

        const provider = TestBed.inject(RegistrationDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();
        target = provider.getProviders()['Registration']!;
    });

    describe('Registration', () => {
        it('should return default values is the user is not authenticated', () => {
            userServiceMock.isAuthenticated = false;

            expect(target['Date']).toBe('');
            expect(target['DaysRegistered']).toBe(-1);
        });

        it('should return not ready initially', () => {
            userServiceMock.isAuthenticated = true;

            expect(() => target['Date']).toThrowError(DSL_NOT_READY);
            expect(() => target['DaysRegistered']).toThrowError(DSL_NOT_READY);
        });

        it('should get value once loaded', () => {
            userServiceMock.isAuthenticated = true;
            registrationServiceMock.registrationInformation.next(registrationInformation);

            expect(target['Date']).toBe('25-09-2024');
            expect(target['DaysRegistered']).toBe(352);
        });
    });

    describe('watcher', () => {
        it('should invalidate cache and update value if there is registration information event', () => {
            registrationServiceMock.registrationInformation.next(registrationInformation);

            expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith(['registration']);
        });
    });

    const registrationInformation: RegistrationInformation = {
        date: '25-09-2024',
        daysRegistered: 352,
    };
});
