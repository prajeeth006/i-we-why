import { TestBed } from '@angular/core/testing';

import { Coordinates, MappedGeolocation } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { HttpClientMock } from '../../../core/test/client-config/http-client.mock';
import { ParsedUrlMock } from '../../../core/test/navigation/navigation.mock';
import { UrlServiceMock } from '../../../core/test/navigation/url.mock';
import { GeolocationResourceService } from '../src/geolocation-resource.service';
import { GeolocationConfigMock } from './mocks';

describe('GeolocationResourceService', () => {
    let target: GeolocationResourceService;
    let apiMock: SharedFeaturesApiServiceMock;
    let httpClient: HttpClientMock;
    let config: GeolocationConfigMock;
    let urlServiceMock: UrlServiceMock;
    let parsedUrl: ParsedUrlMock;

    beforeEach(() => {
        apiMock = MockContext.useMock(SharedFeaturesApiServiceMock);
        httpClient = MockContext.useMock(HttpClientMock);
        config = MockContext.useMock(GeolocationConfigMock);
        urlServiceMock = MockContext.useMock(UrlServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, GeolocationResourceService],
        });
        target = TestBed.inject(GeolocationResourceService);
        parsedUrl = new ParsedUrlMock();
        parsedUrl.absUrl.and.returnValue('https://abc.def.com/?latitude=1&longitude=2');
        urlServiceMock.parse.and.returnValue(parsedUrl);
    });

    it('should call the client api and server api', () => {
        const response = <MappedGeolocation>{ locationId: 'xxx', locationName: 'Laufhaus Wien Mitte' };
        const coords = <Coordinates>{ latitude: 1, longitude: 2 };
        const spy = jasmine.createSpy();
        const spyAppend = spyOn(parsedUrl.search, 'append');
        config.clientApiUrl = 'https://abc.def.com';

        // act
        target.mapGeolocation(coords).subscribe(spy);
        apiMock.get.next(response);
        httpClient.get.next(response);

        expect(apiMock.get).toHaveBeenCalledWith('mappedgeolocation', coords);
        expect(spyAppend).toHaveBeenCalledTimes(2);
        expect(httpClient.get).toHaveBeenCalledWith('https://abc.def.com/?latitude=1&longitude=2');
    });
});
