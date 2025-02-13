import { TestBed } from '@angular/core/testing';

import { MessageScope } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { CryptoResourceService } from '../src/crypto-resource.service';

describe('CryptoResourceService', () => {
    let service: CryptoResourceService;
    let sharedFeaturesApiServiceMock: SharedFeaturesApiServiceMock;

    beforeEach(() => {
        sharedFeaturesApiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, CryptoResourceService],
        });

        service = TestBed.inject(CryptoResourceService);
    });

    describe('encrypt', () => {
        it('should call relevant API', () => {
            service.encrypt('test', 'login');

            expect(sharedFeaturesApiServiceMock.get).toHaveBeenCalledOnceWith('crypto/encrypt', {
                data: 'test',
                purpose: MessageScope.Login,
            });
        });
    });

    describe('decrypt', () => {
        it('should call relevant API', () => {
            service.decrypt('test', 'login');

            expect(sharedFeaturesApiServiceMock.get).toHaveBeenCalledOnceWith('crypto/decrypt', {
                data: 'test',
                purpose: MessageScope.Login,
            });
        });
    });
});
