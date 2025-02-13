import { MockService } from 'ng-mocks';

import { UtmService } from '../../src/utm-service';

export const UtmServiceMock = MockService(UtmService, {
    parseFromUrl: jest.fn(),
});
