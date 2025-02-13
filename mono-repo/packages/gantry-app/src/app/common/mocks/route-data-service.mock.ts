import { Mock } from 'moxxi';

import { RouteDataService } from '../services/route-data.service';

@Mock({ of: RouteDataService })
export class RouteDataServiceMock {
    getQueryParams() {
        return { sId: 'sId', dId: 'dId', bId: 'bId' };
    }
    getUrl() {
        return 'https://gantry.coral.co.uk/en/gantry/';
    }
    isLatestSixResultUrl() {
        return true;
    }
    isLatestFourResultUrl() {
        return true;
    }
}
