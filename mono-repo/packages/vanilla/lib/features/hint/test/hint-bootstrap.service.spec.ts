import { TestBed } from '@angular/core/testing';

import { UserLoginEvent } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { UserServiceMock } from '../../../core/test/user/user.mock';
import { HintBootstrapService } from '../src/hint-bootstrap.service';
import { HintQueueServiceMock } from './hint-queue.mock';

describe('HintBootstrapService', () => {
    let service: HintBootstrapService;
    let userMock: UserServiceMock;
    let hintQueueServiceMock: HintQueueServiceMock;

    beforeEach(() => {
        userMock = MockContext.useMock(UserServiceMock);
        hintQueueServiceMock = MockContext.useMock(HintQueueServiceMock);

        TestBed.configureTestingModule({
            providers: [HintBootstrapService, MockContext.providers],
        });

        service = TestBed.inject(HintBootstrapService);
    });

    describe('onFeatureInit()', () => {
        it('should add home hint when the user is not authenticated', () => {
            userMock.isAuthenticated = false;

            service.onFeatureInit();

            expect(hintQueueServiceMock.add).toHaveBeenCalledWith('homescreen');
        });

        it('should add home hint when on login', () => {
            service.onFeatureInit();

            expect(hintQueueServiceMock.add).not.toHaveBeenCalled();
            userMock.triggerEvent(new UserLoginEvent());

            expect(hintQueueServiceMock.add).toHaveBeenCalledWith('homescreen');
        });
    });
});
