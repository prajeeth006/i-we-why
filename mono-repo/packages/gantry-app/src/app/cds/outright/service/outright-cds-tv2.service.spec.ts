import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { MockTv2OutRightCdsData } from '../mocks/mock-tv2-outright-cds.data';
import { OutrightCdsTv2Service } from './outright-cds-tv2.service';

describe('OutrightCdsTv2Service', () => {
    let service: OutrightCdsTv2Service;
    let outrightTv2CdsMockdata: MockTv2OutRightCdsData;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(OutrightCdsTv2Service);
        outrightTv2CdsMockdata = new MockTv2OutRightCdsData();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('create outright cds for tv2PosteSmall length', () => {
        const antePosteSmall = service.getOutrightSelectionData(outrightTv2CdsMockdata.outrightSmall);
        if (antePosteSmall) {
            expect(antePosteSmall?.selections?.length).toBe(6);
        }
    });

    it('create outright cds tv2PosteSmall and check selectionPrice', () => {
        const antePosteSmall = service.getOutrightSelectionData(outrightTv2CdsMockdata.outrightSmall);
        if (antePosteSmall) {
            expect(antePosteSmall?.selections?.[0]?.selectionPrice).toBe('2/5');
        }
    });

    it('create outright cds tv2PosteSmall and check selectionName', () => {
        const antePosteSmall = service.getOutrightSelectionData(outrightTv2CdsMockdata.outrightSmall);
        if (antePosteSmall) {
            expect(antePosteSmall?.selections?.[0]?.selectionName).toBe('Hartlepool United');
        }
    });

    it('create outright cds  tv2PosteSmall and check selectionPrice', () => {
        const antePosteSmall = service.getOutrightSelectionData(outrightTv2CdsMockdata.outrightSmall);
        if (antePosteSmall) {
            expect(antePosteSmall?.selections?.[1]?.selectionPrice).toBe('7/10');
        }
    });

    it('create outright cds tv2PosteSmall selection and check selectionName', () => {
        const antePosteSmall = service.getOutrightSelectionData(outrightTv2CdsMockdata.outrightSmall);
        if (antePosteSmall) {
            expect(antePosteSmall?.selections?.[1]?.selectionName).toBe('Ulsan Hyundai FC');
        }
    });

    it('create outright cds for tv2PostMedium length', () => {
        const antePostMedium = service.getOutrightSelectionData(outrightTv2CdsMockdata.outrightMedium);
        if (antePostMedium) {
            expect(antePostMedium?.selections?.length).toBe(12);
        }
    });

    it('create outright cds tv2PostMedium and check selectionName', () => {
        const antePostMedium = service.getOutrightSelectionData(outrightTv2CdsMockdata.outrightMedium);
        if (antePostMedium) {
            expect(antePostMedium?.selections?.[1]?.selectionName).toBe('Jamshedpur');
        }
    });

    it('create outright cds tv2PostMedium and check selectionPrice', () => {
        const antePostMedium = service.getOutrightSelectionData(outrightTv2CdsMockdata.outrightMedium);
        if (antePostMedium) {
            expect(antePostMedium?.selections?.[0]?.selectionPrice).toBe('2/5');
        }
    });

    it('create outright cds for tv2PostLarge length', () => {
        const antePostLarge = service.getOutrightSelectionData(outrightTv2CdsMockdata.outrightLarge);
        if (antePostLarge) {
            expect(antePostLarge?.selections?.length).toBe(23);
        }
    });
    it('create outright cds for tv2PostLarge selectionPrice', () => {
        const antePostLarge = service.getOutrightSelectionData(outrightTv2CdsMockdata.outrightLarge);
        if (antePostLarge) {
            expect(antePostLarge?.selections?.[0]?.selectionPrice).toBe('2/5');
        }
    });

    it('create outright cds for tv2PostLarge selectionName', () => {
        const antePostLarge = service.getOutrightSelectionData(outrightTv2CdsMockdata.outrightLarge);
        if (antePostLarge) {
            expect(antePostLarge?.selections?.[0]?.selectionName).toBe('Hartlepool United');
        }
    });
});
