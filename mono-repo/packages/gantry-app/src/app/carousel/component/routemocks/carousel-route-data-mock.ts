import { Mock } from 'moxxi';

import { RouteDataService } from '../../../common/services/route-data.service';

@Mock({ of: RouteDataService })
export class CarouselRouteDataServiceMockHalf {
    getQueryParams() {
        return { screenType: 'half' };
    }
    getUrl() {
        return 'https://dev.gantry.coral.co.uk/en/gantry/horseracing/latestdesign?eventId=5871273&marketIds=170841151,170841154';
    }
}
