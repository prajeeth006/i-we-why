import { Injectable } from '@angular/core';

import { DataLayerProxyService } from '../../src/data-layer-proxy.service';

@Injectable()
export class DataLayerProxyMock extends DataLayerProxyService {
    override patchDataLayer(): Promise<void> {
        return Promise.resolve();
    }
}
