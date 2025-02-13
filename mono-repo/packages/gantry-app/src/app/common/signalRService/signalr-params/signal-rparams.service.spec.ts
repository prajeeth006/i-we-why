import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { SignalRParamsService } from './signal-rparams.service';

describe('SignalRParamsService', () => {
    let service: SignalRParamsService;
    const url: string = 'https://www.somedomain.com?someParam=someValue';
    const urlWithOutParam: string = 'https://www.somedomain.com';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi())],
        });
        service = TestBed.inject(SignalRParamsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should add params when url doesnot have any', () => {
        const newUrl = service.addParams(urlWithOutParam, { param1: 'value1', param2: 'value2' });
        expect(newUrl).toBe('https://www.somedomain.com/?param1=value1&param2=value2');
    });

    it('should add params when url already have some param', () => {
        const newUrl = service.addParams(url, { param1: 'value1', param2: 'value2' });
        expect(newUrl).toBe('https://www.somedomain.com/?someParam=someValue&param1=value1&param2=value2');
    });
});
