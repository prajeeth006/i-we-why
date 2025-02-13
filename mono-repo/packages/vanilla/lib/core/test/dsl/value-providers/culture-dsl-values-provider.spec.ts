import { TestBed } from '@angular/core/testing';

import { DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { CultureDslValuesProvider } from '../../../src/dsl/value-providers/culture-dsl-values-provider';
import { PageMock } from '../../browsercommon/page.mock';
import { ClaimsServiceMock } from '../../user/claims.mock';

describe('CultureDslValuesProvider', () => {
    let target: any;
    let claimsService: ClaimsServiceMock;

    beforeEach(() => {
        MockContext.useMock(PageMock);
        claimsService = MockContext.useMock(ClaimsServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, CultureDslValuesProvider],
        });

        const provider = TestBed.inject(CultureDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();

        claimsService.get.withArgs('http://api.bwin.com/v3/user/culture').and.returnValue('de-AT');
        target = provider.getProviders()['Culture']!;
    });

    it('resolve', () => {
        expect(target['Allowed']).toBe('en-US, de-AT');
        expect(target['Current']).toBe('en');
        expect(target['Default']).toBe('sw-KE');
        expect(target['FromBrowser']).toBe('de-AT');
        expect(target['FromClaims']).toBe('de-AT');
        expect(target['FromPreviousVisit']).toBe('en-EN');
    });

    describe('GetUrlToken', () => {
        for (const lang of new PageMock().uiLanguages) {
            it(`should return routeValue of ${lang.culture} culture`, () => {
                // act
                const value = target['GetUrlToken'](lang.culture);

                expect(value).toBe(lang.routeValue);
            });
        }

        for (const inputCulture of [null, '', 'gibberish', 'fr-FR']) {
            it(`should throw if input culture is ${inputCulture}`, () => {
                function act() {
                    return target['GetUrlToken'](inputCulture);
                }

                expect(act).toThrowError(`Failed to find culture by name '${inputCulture}' from allowed configured cultures: en-US,de-AT.`);
            });
        }
    });
});
