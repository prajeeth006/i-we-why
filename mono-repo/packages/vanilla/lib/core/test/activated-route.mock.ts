import { ActivatedRoute, Params, UrlSegment } from '@angular/router';

import { Mock, Stub } from 'moxxi';
import { Subject } from 'rxjs';

@Mock({ of: ActivatedRoute })
export class ActivatedRouteMock {
    snapshot = new ActivatedRouteSnapshotMock();
    url = new Subject<UrlSegment[]>();
    params = new Subject<Params>();
}

export class ActivatedRouteSnapshotMock {
    firstChild: ActivatedRouteSnapshotMock | null;
    params: { [key: string]: any } = {};
    data: any = {};
    queryParamMap = new ParamMapMock();
}

export class ParamMapMock {
    @Stub() get: jasmine.Spy;
}
