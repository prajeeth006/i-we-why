import { TestBed } from '@angular/core/testing';

import { OutrightCdsService } from './outright-cds.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockContext } from 'moxxi';
import { RouterTestingModule } from '@angular/router/testing';
import { MockOutrightCdsData } from '../mocks/mock-outright-cds';

describe('OutrightCdsService', () => {
  let service: OutrightCdsService;
  let outrightCdsMockdata: MockOutrightCdsData;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [MockContext.providers]
    });
    service = TestBed.inject(OutrightCdsService);
    outrightCdsMockdata = new MockOutrightCdsData();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('create outright cds for antePosteSmall length', () => {
    const antePosteSmall = service.getOutrightSelectionData(outrightCdsMockdata.antePosteSmall);
    if (antePosteSmall) {
      expect(antePosteSmall?.selections?.length).toBe(6);
    }
  });

  it('create outright cds antePosteSmall and check selectionPrice', () => {
    const antePosteSmall = service.getOutrightSelectionData(outrightCdsMockdata.antePosteSmall);
    if (antePosteSmall) {
      expect(antePosteSmall?.selections?.[0]?.selectionPrice).toBe('22');
    }
  });

  it('create outright cds antePosteSmall and check selectionName', () => {
    const antePosteSmall = service.getOutrightSelectionData(outrightCdsMockdata.antePosteSmall);
    if (antePosteSmall) {
      expect(antePosteSmall?.selections?.[0]?.selectionName).toBe('ADAM SCOTT ');
    }
  });

  it('create outright cds  antePosteSmall and check selectionPrice', () => {
    const antePosteSmall = service.getOutrightSelectionData(outrightCdsMockdata.antePosteSmall);
    if (antePosteSmall) {
      expect(antePosteSmall?.selections?.[1]?.selectionPrice).toBe('30');
    }
  });

  it('create outright cds antePosteSmall and check selectionName', () => {
    const antePosteSmall = service.getOutrightSelectionData(outrightCdsMockdata.antePosteSmall);
    if (antePosteSmall) {
      expect(antePosteSmall?.selections?.[1]?.selectionName).toBe('ALEX CEJKA ');
    }
  });

  it('create outright cds for antePostMedium length', () => {
    const antePostMedium = service.getOutrightSelectionData(outrightCdsMockdata.antePostMedium);
    if (antePostMedium) {
      expect(antePostMedium?.selections?.length).toBe(10);
    }
  });

  it('create outright cds antePostMedium and check selectionName', () => {
    const antePostMedium = service.getOutrightSelectionData(outrightCdsMockdata.antePostMedium);
    if (antePostMedium) {
      expect(antePostMedium?.selections?.[1]?.selectionName).toBe('SRI LANKA');
    }
  });

  it('create outright cds antePostMedium and check selectionPrice', () => {
    const antePostMedium = service.getOutrightSelectionData(outrightCdsMockdata.antePostMedium);
    if (antePostMedium) {
      expect(antePostMedium?.selections?.[0]?.selectionPrice).toBe('11');
    }
  });

  it('create outright cds for antePostLarge length', () => {
    const antePostLarge = service.getOutrightSelectionData(outrightCdsMockdata.antePostLarge);
    if (antePostLarge) {
      expect(antePostLarge?.selections?.length).toBe(22);
    }
  });
  it('create outright cds for antePostLarge selectionPrice', () => {
    const antePostLarge = service.getOutrightSelectionData(outrightCdsMockdata.antePostLarge);
    if (antePostLarge) {
      expect(antePostLarge?.selections?.[0]?.selectionPrice).toBe("3");
    }
  });

  it('create outright cds for antePostLarge selectionName', () => {
    const antePostLarge = service.getOutrightSelectionData(outrightCdsMockdata.antePostLarge);
    if (antePostLarge) {
      expect(antePostLarge?.selections?.[0]?.selectionName).toBe('GIANCARLO FISICHELLA ');
    }
  });

});
