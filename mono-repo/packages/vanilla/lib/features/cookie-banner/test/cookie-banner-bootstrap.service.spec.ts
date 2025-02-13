import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { CookieBannerBootstrapService } from '../src/cookie-banner-bootstrap.service';
import { CookieBannerServiceMock } from './cookie-banner.mock';

describe('CookieBannerBootstrapService', () => {
    let service: CookieBannerBootstrapService;
    let serviceMock: CookieBannerServiceMock;

    beforeEach(() => {
        serviceMock = MockContext.useMock(CookieBannerServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, CookieBannerBootstrapService],
        });

        service = TestBed.inject(CookieBannerBootstrapService);
    });

    it('init', () => {
        service.onFeatureInit();

        expect(serviceMock.setOptanonGroupCookie).toHaveBeenCalled();
    });
});
