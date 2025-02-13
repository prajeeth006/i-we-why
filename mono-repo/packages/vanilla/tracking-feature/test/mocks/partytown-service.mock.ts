import { MockService } from 'ng-mocks';

import { PartytownService } from '../../src/partytown.service';

export const PartytownServiceMock = MockService(PartytownService, {
    createSharedStorage: jest.fn(),
});
