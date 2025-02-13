import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockContext } from 'moxxi';
import { RouteDataServiceMock } from '../../mocks/route-data-service.mock';
import { ElectronParamsService } from './electron-params.service';

describe('ElectronParamsService', () => {
  let service: ElectronParamsService;
  let url: string = 'https://www.somedomain.com?someParam=someValue';
  let urlWithOutParam: string = 'https://www.somedomain.com';

  beforeEach(async () => {
    MockContext.useMock(RouteDataServiceMock);
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      providers: [MockContext.providers]
    });
    service = TestBed.inject(ElectronParamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add sId,dId,bId into Url', () => {
    let updatedUrl = service.addParamAddedByElectron(url);
    expect(updatedUrl).toBe('https://www.somedomain.com/?someParam=someValue&sId=sId&dId=dId&bId=bId');
  });

  it('should add sId,dId,bId into Url', () => {
    let updatedUrl = service.addParamAddedByElectron(urlWithOutParam);
    expect(updatedUrl).toBe('https://www.somedomain.com/?sId=sId&dId=dId&bId=bId');
  });

  it('should add "api-key" to URL if authenticationkey is present', () => {
    let authenticationKey: string = '123456789';
    let updatedUrl = service.authenticateUrl(urlWithOutParam, authenticationKey);
    expect(updatedUrl).toBe('https://www.somedomain.com/?api-key=123456789');
  });

  it('should not add "api-key" to URL if authenticationkey is not present', () => {
    let authenticationKey = '';
    let updatedUrl = service.authenticateUrl(urlWithOutParam, authenticationKey);
    expect(updatedUrl).toContain('https://www.somedomain.com');
  });
});
