import { TestBed } from '@angular/core/testing';

import { SignalrParamsService } from './signalr-params.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('SignalrParamsService', () => {
  let service: SignalrParamsService;
  let url: string = 'https://dev-contentsubscriptionservice.itsfogo.com/contentHub?origin=Thunderbolt2';
  let urlWithOutParam: string = 'https://dev-contentsubscriptionservice.itsfogo.com/contentHub';

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    providers: [provideHttpClient(withInterceptorsFromDi())]
});
    service = TestBed.inject(SignalrParamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add params when url doesnot have any', () => {
    let newUrl = service.addParams(urlWithOutParam, { "param1": "value1", "param2": "value2" })
    expect(newUrl).toBe('https://dev-contentsubscriptionservice.itsfogo.com/contentHub?param1=value1&param2=value2' );
  });

  it('should add params when url already have some param', () => {
    let newUrl = service.addParams(url, { "param1": "value1", "param2": "value2" })
    expect(newUrl).toBe("https://dev-contentsubscriptionservice.itsfogo.com/contentHub?origin=Thunderbolt2&param1=value1&param2=value2");
  });
});
