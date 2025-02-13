import { ClientConfigDiff, ClientConfigService } from '@frontend/vanilla/core';
import { MockService } from 'ng-mocks';
import { Observable } from 'rxjs';

export const ClientConfigServiceMock = MockService(ClientConfigService, {
    updates: new Observable<ClientConfigDiff>(),
    load: jest.fn().mockResolvedValue({}),
});
