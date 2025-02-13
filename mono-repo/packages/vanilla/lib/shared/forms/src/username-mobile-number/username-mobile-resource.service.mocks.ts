import { Mock } from 'moxxi';
import { Observable, of } from 'rxjs';

import { UsernameMobileNumberResourceService } from './username-mobile-resource.service';

@Mock({ of: UsernameMobileNumberResourceService })
export class UsernameMobileNumberResourceServiceMock {
    countries: Observable<any> = of([{ predial: '+43', id: 'AT' }]);
}
