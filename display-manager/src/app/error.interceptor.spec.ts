import { TestBed } from '@angular/core/testing';
import { ErrorInterceptor } from './error.interceptor';
import { HttpClientModule, HttpRequest, HttpHandler, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { EMPTY, of } from 'rxjs';
import { CommonService } from './display-manager/display-manager-left-panel/tree-view/services/common-service/common.service';
import { ApiService } from './common/api.service';
import { InterceptorToggleService } from './interceptor-toggle.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

describe('ErrorInterceptor', () => {
  let interceptor: ErrorInterceptor;
  let commonServiceMock: jasmine.SpyObj<CommonService>;
  let apiServiceMock: jasmine.SpyObj<ApiService>;
  let interceptorToggleServiceMock: jasmine.SpyObj<InterceptorToggleService>;

  beforeEach(() => {
    commonServiceMock = jasmine.createSpyObj('CommonService', ['getErrorMessageOnDialogBox']);
    apiServiceMock = jasmine.createSpyObj('ApiService', ['get']);
    interceptorToggleServiceMock = jasmine.createSpyObj('InterceptorToggleService', ['getEnableHttpInterceptor']);

    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [
        ErrorInterceptor,
        { provide: CommonService, useValue: commonServiceMock },
        { provide: ApiService, useValue: apiServiceMock },
        { provide: InterceptorToggleService, useValue: interceptorToggleServiceMock },
      ]
    });

    interceptor = TestBed.inject(ErrorInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should intercept and modify the request header when interceptor is enabled', () => {
    const request = new HttpRequest('GET', '/test');
    const next = { handle: jasmine.createSpy().and.returnValue(EMPTY) } as HttpHandler;

    interceptor.intercept(request, next);

    expect(next.handle).toHaveBeenCalled();
  });

  it('should handle unauthorized error and call getErrorMessageOnDialogBox for unauthorized or forbidden status', () => {
    const errorResponse = new HttpErrorResponse({
      status: HttpStatusCode.Unauthorized,
      statusText: 'Unauthorized'
    });

    interceptorToggleServiceMock.getEnableHttpInterceptor.and.returnValue(of(true));
    commonServiceMock.getErrorMessageOnDialogBox.and.stub();

    interceptor['catchUnauthorisedError'](errorResponse);

    expect(commonServiceMock.getErrorMessageOnDialogBox).toHaveBeenCalledWith(errorResponse, 'Your session has timed out. Please select \'Close\' and sign back in to Display Manager to make further changes.');
  });

  it('should call isUserAuthenticated for non-unauthorized errors and check authentication status', () => {
    const errorResponse = new HttpErrorResponse({
      status: HttpStatusCode.BadRequest,
      statusText: 'Bad Request'
    });

    interceptorToggleServiceMock.getEnableHttpInterceptor.and.returnValue(of(true));
    apiServiceMock.get.and.returnValue(of(false));

    interceptor['catchUnauthorisedError'](errorResponse);

    expect(apiServiceMock.get).toHaveBeenCalledWith('/sitecore/api/displayManager/isUserAuthenticated/');
    expect(commonServiceMock.getErrorMessageOnDialogBox).toHaveBeenCalledWith(errorResponse, 'Your session has timed out. Please select \'Close\' and sign back in to Display Manager to make further changes.');
  });

  it('should not handle error if interceptor is not enabled', () => {
    const errorResponse = new HttpErrorResponse({
      status: HttpStatusCode.Unauthorized,
      statusText: 'Unauthorized'
    });

    interceptorToggleServiceMock.getEnableHttpInterceptor.and.returnValue(of(false));

    interceptor['catchUnauthorisedError'](errorResponse);

    expect(commonServiceMock.getErrorMessageOnDialogBox).not.toHaveBeenCalled();
  });
});
