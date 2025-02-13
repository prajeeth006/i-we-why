import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { MockTv2OutRightCdsData } from '../mocks/mock-tv2-outright-cds.data';
import { OutrighCdsTv2SpecialService } from './outrigh-cds-tv2-special.service';

describe('OutrighCdsTv2SpecialService', () => {
    let service: OutrighCdsTv2SpecialService;

    let outrightTv2CdsMockdata: MockTv2OutRightCdsData;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(OutrighCdsTv2SpecialService);
        outrightTv2CdsMockdata = new MockTv2OutRightCdsData();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('create special outright cds for tv2PosteSmall length', () => {
        const outRightCDSTv2Content = service.getOutRightTv2Content(outrightTv2CdsMockdata.outrightSpecialSmall);
        if (outRightCDSTv2Content) {
            expect(outRightCDSTv2Content?.finalResult?.selections?.length).toBe(2);
        }
    });

    it('create special outright cds tv2PosteSmall and check selectionPrice', () => {
        const outRightCDSTv2Content = service.getOutRightTv2Content(outrightTv2CdsMockdata.outrightSpecialSmall);
        if (outRightCDSTv2Content) {
            expect(outRightCDSTv2Content?.finalResult?.selections?.[0]?.selectionPrice).toBe('21/20');
        }
    });

    it('create outright cds tv2PosteSmall and check selectionName', () => {
        const antePosteSmall = service.getOutRightTv2Content(outrightTv2CdsMockdata.outrightSpecialSmall);
        if (antePosteSmall) {
            expect(antePosteSmall?.finalResult?.selections?.[1]?.selectionName).toBe('Selection2');
        }
    });

    it('create special outright cds for tv2PosteMedium length', () => {
        const outRightCDSTv2Content = service.getOutRightTv2Content(outrightTv2CdsMockdata.outrightSpecialMedium);
        if (outRightCDSTv2Content) {
            expect(outRightCDSTv2Content?.finalResult?.selections?.length).toBe(15);
        }
    });

    it('create outright cds tv2PosteMedium and check selectionName', () => {
        const antePosteSmall = service.getOutRightTv2Content(outrightTv2CdsMockdata.outrightSpecialMedium);
        if (antePosteSmall) {
            expect(antePosteSmall?.finalResult?.selections?.[14]?.selectionName).toBe('Selection16');
        }
    });

    it('create special outright cds tv2PosteMedium and check selectionPrice', () => {
        const outRightCDSTv2Content = service.getOutRightTv2Content(outrightTv2CdsMockdata.outrightSpecialMedium);
        if (outRightCDSTv2Content) {
            expect(outRightCDSTv2Content?.finalResult?.selections?.[0]?.selectionPrice).toBe('1/5');
        }
    });

    it('create special outright cds for tv2PosteLarge length', () => {
        const outRightCDSTv2Content = service.getOutRightTv2Content(outrightTv2CdsMockdata.outrightSpecialLarge);
        if (outRightCDSTv2Content) {
            expect(outRightCDSTv2Content?.finalResult?.selections?.length).toBe(19);
        }
    });
});
