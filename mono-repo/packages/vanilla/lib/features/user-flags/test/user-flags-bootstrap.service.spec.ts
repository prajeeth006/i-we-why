import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { UserFlagsBootstrapService } from '../src/user-flags-bootstrap.service';
import { UserFlagsServiceMock } from './user-flags.mock';

describe('UserFlagsBootstrapService', () => {
    let service: UserFlagsBootstrapService;
    let userFlagsServiceMock: UserFlagsServiceMock;

    beforeEach(() => {
        userFlagsServiceMock = MockContext.useMock(UserFlagsServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, UserFlagsBootstrapService],
        });

        service = TestBed.inject(UserFlagsBootstrapService);
    });

    describe('onAppInit', () => {
        it('should load', () => {
            service.onFeatureInit();

            expect(userFlagsServiceMock.load).toHaveBeenCalled();
        });
    });
});
