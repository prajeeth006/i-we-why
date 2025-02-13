import { TestBed } from '@angular/core/testing';

import { ClaimsConfig, ClaimsService } from '@frontend/vanilla/core';
import { Mock, MockContext } from 'moxxi';

import { ClientConfigServiceMock } from '../client-config/client-config.mock';

@Mock({ of: ClaimsConfig })
export class ClaimsConfigMock extends ClaimsConfig {}

describe('ClaimsService', () => {
    let service: ClaimsService;
    let clientConfigServiceMock: ClientConfigServiceMock;
    let claimsConfigMock: ClaimsConfigMock;

    beforeEach(() => {
        claimsConfigMock = MockContext.useMock(ClaimsConfigMock);
        clientConfigServiceMock = MockContext.useMock(ClientConfigServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
        });

        claimsConfigMock['http://ns/claim1'] = 'val1';

        service = TestBed.inject(ClaimsService);
    });

    describe('get()', () => {
        it('should return claim by claimType', () => {
            const claim = service.get('http://ns/claim1');

            expect(claim).toBe('val1');
        });

        it('should return claim by short name', () => {
            const claim = service.get('claim1');

            expect(claim).toBe('val1');
        });

        it('should return undefined if claim doesnt exist', () => {
            const claim = service.get('claim2');

            expect(claim).toBeNull();
        });
    });

    it('should regenerate claim short names when updates when claim config changes', () => {
        claimsConfigMock['http://ns/claim2'] = 'val2';

        const diff = new Map([['vnClaims', new Map()]]);

        clientConfigServiceMock.updates.next(diff);

        const claim = service.get('claim2');

        expect(claim).toBe('val2');
    });
});
