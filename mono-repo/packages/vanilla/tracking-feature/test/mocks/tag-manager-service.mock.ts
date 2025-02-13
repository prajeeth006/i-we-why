import { MockService } from 'ng-mocks';

import { TagManagerService } from '../../src/tag-manager.service';

export const TagManagerServiceMock = MockService(TagManagerService, {
    availableClientTagManagers: [],
    init: jest.fn(),
    load: jest.fn(),
});
