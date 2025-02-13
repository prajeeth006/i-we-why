import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { NavigationBootstrapService } from '../../src/navigation/navigation-bootstrap.service';
import { NavigationServiceMock } from './navigation.mock';

describe('NavigationBootstrapService', () => {
    let service: NavigationBootstrapService;
    let navigationServiceMock: NavigationServiceMock;

    beforeEach(() => {
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, NavigationBootstrapService],
        });

        service = TestBed.inject(NavigationBootstrapService);
    });

    it('should init navigation service', () => {
        service.onAppInit();

        expect(navigationServiceMock.init).toHaveBeenCalled();
    });
});
