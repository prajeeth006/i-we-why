import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { PlayerAttributesService } from '../src/player-attributes.service';

describe('PlayerAttributesService', () => {
    let service: PlayerAttributesService;
    let sharedFeaturesApiServiceMock: SharedFeaturesApiServiceMock;
    let userServiceMock: UserServiceMock;

    beforeEach(() => {
        sharedFeaturesApiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, PlayerAttributesService],
        });

        service = TestBed.inject(PlayerAttributesService);
    });

    describe('refresh', () => {
        it('should call playerAttributes API', () => {
            userServiceMock.isAuthenticated = true;

            service.refresh(false);

            expect(sharedFeaturesApiServiceMock.get).toHaveBeenCalledOnceWith('playerAttributes', { cached: false });
        });

        it('should call playerAttributes API with cached data', () => {
            service.refresh();

            expect(sharedFeaturesApiServiceMock.get).toHaveBeenCalledOnceWith('playerAttributes', { cached: true });
        });

        it('should not call playerAttributes API when user is not authenticated', () => {
            userServiceMock.isAuthenticated = false;

            service.refresh();

            expect(sharedFeaturesApiServiceMock.get).not.toHaveBeenCalled();
        });
    });
});
