import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { HeaderBarBootstrapService } from '../src/header-bar-bootstrap.service';
import { HeaderBarConfigMock, HeaderBarServiceMock } from './header-bar.mocks';

describe('HeaderBarBootstrapService', () => {
    let service: HeaderBarBootstrapService;
    let headerBarServiceMock: HeaderBarServiceMock;
    let configMock: HeaderBarConfigMock;

    beforeEach(() => {
        headerBarServiceMock = MockContext.useMock(HeaderBarServiceMock);
        configMock = MockContext.useMock(HeaderBarConfigMock);

        TestBed.configureTestingModule({
            providers: [HeaderBarBootstrapService, MockContext.providers],
        });
    });

    beforeEach(fakeAsync(() => {
        service = TestBed.inject(HeaderBarBootstrapService);
        service.onFeatureInit();
        configMock.whenReady.next();
        tick();
    }));

    describe('onAppInit', () => {
        it('should register actions', () => {
            expect(headerBarServiceMock.registerActions).toHaveBeenCalled();
        });
    });
});
