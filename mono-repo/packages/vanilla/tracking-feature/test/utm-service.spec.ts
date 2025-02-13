import { TestBed } from '@angular/core/testing';

import { ParsedUrl, QuerySearchParams, UrlService, Utm } from '@frontend/vanilla/core';
import { MockProvider } from 'ng-mocks';

import { TrackingBootstrapService } from '../src/tracking-bootstrap.service';
import { UtmService } from '../src/utm-service';
import { UrlServiceMock } from './mocks/url-service.mock';

let service: UtmService;
let urlServiceMock: typeof UrlServiceMock;

const parseFromUrl = (query: string): Utm => {
    jest.spyOn(urlServiceMock, 'parse').mockReturnValue({ search: new QuerySearchParams(query) } as ParsedUrl);
    return service.parseFromUrl(`http://bwin.com${query}`);
};

const init = () => {
    urlServiceMock = UrlServiceMock;

    TestBed.configureTestingModule({
        providers: [TrackingBootstrapService, MockProvider(UrlService, urlServiceMock)],
    });

    service = TestBed.inject(UtmService);
};

describe("When UtmService's", () => {
    beforeEach(init);

    describe('parseFromUrl method is called with a url then', () => {
        it('should return a valid Utm object if the utm query parameters were correct.', () => {
            const utm: Utm = parseFromUrl('utm_campaign=A&utm_content=b&utm_medium=C&utm_source=1&utm_term=22o&utm_keyword=xx');

            expect(utm.utm_campaign).toBe('A');
            expect(utm.utm_content).toBe('b');
            expect(utm.utm_medium).toBe('C');
            expect(utm.utm_source).toBe('1');
            expect(utm.utm_term).toBe('22o');
            expect(utm.utm_keyword).toBe('xx');
        });

        it('should return an Utm object with empty string params for missing utm query parameters.', () => {
            const utm: Utm = parseFromUrl('utm_campaign=A&utm_term=22o');

            expect(utm.utm_campaign).toBe('A');
            expect(utm.utm_content).toBe('');
            expect(utm.utm_medium).toBe('');
            expect(utm.utm_source).toBe('');
            expect(utm.utm_term).toBe('22o');
            expect(utm.utm_keyword).toBe('');
        });
    });
});
