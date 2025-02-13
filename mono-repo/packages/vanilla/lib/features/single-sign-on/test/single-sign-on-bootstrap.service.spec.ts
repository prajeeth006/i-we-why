import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { SingleSignOnBootstrapService } from '../src/single-sign-on-bootstrap.service';
import { SingleSignOnServiceMock } from './single-sign-on.mock';

describe('SingleSignOnBootstrapService', () => {
    let service: SingleSignOnBootstrapService;
    let singleSignOnServiceMock: SingleSignOnServiceMock;

    beforeEach(() => {
        singleSignOnServiceMock = MockContext.useMock(SingleSignOnServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, SingleSignOnBootstrapService],
        });

        service = TestBed.inject(SingleSignOnBootstrapService);
    });

    it('init', () => {
        service.onFeatureInit();

        expect(singleSignOnServiceMock.setSsoToken).toHaveBeenCalled();
    });
});
