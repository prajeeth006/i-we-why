import { TestBed } from '@angular/core/testing';

import { CryptoService } from '@frontend/vanilla/shared/crypto';
import { MockContext } from 'moxxi';

import { CryptoResourceServiceMock } from './crypto-resource-service.mock';

describe('CryptoService', () => {
    let service: CryptoService;
    let cryptoResourceServiceMock: CryptoResourceServiceMock;

    beforeEach(() => {
        cryptoResourceServiceMock = MockContext.useMock(CryptoResourceServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, CryptoService],
        });

        service = TestBed.inject(CryptoService);
    });

    describe('encrypt', () => {
        it('should encrypt', () => {
            service.encrypt('test', 'login');

            expect(cryptoResourceServiceMock.encrypt).toHaveBeenCalledOnceWith('test', 'login');
        });
    });

    describe('decrypt', () => {
        it('should decrypt', () => {
            service.decrypt('test', 'login');

            expect(cryptoResourceServiceMock.decrypt).toHaveBeenCalledOnceWith('test', 'login');
        });
    });
});
