// TODO (van9): Remove prefix and introduce baseUrlTemplate, withoutLang, withoutArea
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

import { forOwn } from 'lodash-es';
import { Observable, throwError as _throw, timer } from 'rxjs';
import { catchError, map, mergeMap, retryWhen } from 'rxjs/operators';

import { UrlService } from '../core';
import { LoadingIndicatorService } from '../loading-indicator/loading-indicator.service';
import { isAbsolute } from '../utils/url';
import { ApiFactoryOptions, ApiOptions, InternalApiOptions } from './http.models';

/**
 * @whatItDoes Provides a unified way to call API
 *
 * @howToUse
 *
 * ```
 * export class MyApiService extends ApiBase {}
 *
 * @NgModule()
 * export class MyHttpModule{
 *     static forRoot(): ModuleWithProviders<MyHttpModule> {
 *         return {
 *             ngModule: MyHttpModule,
 *             providers {
 *                 { provide: MyApiService, deps: [ApiServiceFactory], useFactory: myApiServiceFactory },
 *             }
 *         }
 *     }
 * }
 *
 * export function vanillaApiServiceFactory(apiServiceFactory: ApiServiceFactory) {
 *     return apiServiceFactory.create(MyApiService, 'myArea');
 * }
 * ```
 * then use api service
 *
 *```
 * myApiService.get('action').subscribe((data) => {
 * });
 * // will make GET request to /en/myArea/api/action
 * ```
 *
 * @description
 *
 * ## Methods
 *
 * The service provides `get`, `post`, `put` and `delete` methods with following parameters:
 * 1. First parameter is always path
 * 2. Second parameter an object with request parameters. It is translated to query string params for `get` and `delete`, and to payload for `post` and `put`
 * 3. Third parameter is for options
 *
 * Generic method `request` is also provided.
 *
 * ### Options
 *
 * In options you can specify all supported properties for `http` request. These will override all other options sources.
 * - method
 * - data
 * - params (object or instance of `URLSearchParams`)
 * - headers (object or instance of `Headers`)
 *
 * In addition you can specify a few extra options:
 * - prefix - default is `/en/yourArea`, you can override it to get rid of the language prefix for example.
 * - showSpinner - If this is set to true, it will trigger Loading Indicator for the duration of the request. Default options is `false` for `get`, and `true` for `post`, `put` and `delete`.
 * - resolveWithFullResponse - If set to false, only the response data is passed to the promise callback. Otherwise the full http response is passed. The default is `false`.
 * - responseType - Passed to the [HttpClient](https://angular.io/api/common/http/HttpClient).
 * - reportProgress - Passed to the [HttpClient](https://angular.io/api/common/http/HttpClient).
 * - messageQueueScope - Identifies which message panel to use for messages that come from the response.
 * - retryCount - The number of times the request should be retried in case of an error before throwing.
 * - retryDelay - The delay (either in milliseconds, or a function which takes number of retry attempt as a parameter and returns number of milliseconds) before the next retry should be tried.
 * - retryOnStatus - The status codes on which to retry request.
 *
 * Once you instantiated your instance of the service, you can use override default options by setting `defaultOptions` or `default<MethodName>Options` on the service in `onWireup()` method.
 *
 * @stable
 */
export abstract class ApiBase {
    defaultOptions: ApiOptions = {
        resolveWithFullResponse: false,
        showSpinner: false,
        retryCount: 0,
        retryDelay: 500,
        retryOnStatus: [0, 400, 408, 502, 503, 504],
    };

    defaultGetOptions: ApiOptions = {
        method: 'GET',
    };

    defaultPostOptions: ApiOptions = {
        method: 'POST',
        showSpinner: true,
    };

    defaultPutOptions: ApiOptions = {
        method: 'PUT',
        showSpinner: true,
    };

    defaultDeleteOptions: ApiOptions = {
        method: 'DELETE',
        showSpinner: true,
    };

    defaultHeaders: { [key: string]: string } = {};

    private httpClient: HttpClient;
    private loadingIndicatorService: LoadingIndicatorService;
    private urlService: UrlService;

    /**
     * @internal
     */
    wireup(
        urlService: UrlService,
        http: HttpClient,
        loadingIndicatorService: LoadingIndicatorService,
        baseUrl: string,
        lang: string,
        options: ApiFactoryOptions,
        headers?: { [key: string]: string } | null,
    ) {
        this.httpClient = http;
        this.loadingIndicatorService = loadingIndicatorService;
        this.defaultOptions.baseUrl = baseUrl;
        this.urlService = urlService;

        if (options.area) {
            this.defaultOptions.prefix = `/${lang}/${options.area}`;
        } else {
            this.defaultOptions.prefix = `/${lang}`;
        }

        if (isAbsolute(baseUrl)) {
            this.defaultOptions.withCredentials = true;
        }

        if (headers) {
            if (options.product) {
                const hasProductApiHeader = headers.hasOwnProperty(`x-bwin-${options.product}-api`);
                if (hasProductApiHeader && baseUrl && !this.urlService.parse(baseUrl).isSameTopDomain) {
                    delete headers[`x-bwin-${options.product}-api`];
                }
            }
            this.defaultHeaders = headers;
        }

        this.onWireup();
    }

    request(url: string, options?: ApiOptions): Observable<any> {
        if (!options || !options.method) {
            throw new Error(`For 'request' function 'method' option is required.`);
        }

        const normalizedMethod = options.method[0]!.toUpperCase() + options.method.slice(1).toLowerCase();
        const methodDefaultOptions = (this as any)['default' + normalizedMethod + 'Options'] || {};

        const requestOptions = Object.assign({}, this.defaultOptions, methodDefaultOptions, { url }, options);

        return this.callApi(requestOptions);
    }

    get(url: string, params?: any, options?: ApiOptions): Observable<any> {
        const getOptions = Object.assign({}, this.defaultOptions, this.defaultGetOptions, { url, params }, options);

        return this.callApi(getOptions);
    }

    post(url: string, data?: any, options?: ApiOptions): Observable<any> {
        const getOptions = Object.assign({}, this.defaultOptions, this.defaultPostOptions, { url, data }, options);

        return this.callApi(getOptions);
    }

    put(url: string, data?: any, options?: ApiOptions): Observable<any> {
        const getOptions = Object.assign({}, this.defaultOptions, this.defaultPutOptions, { url, data }, options);

        return this.callApi(getOptions);
    }

    delete(url: string, params?: any, options?: ApiOptions): Observable<any> {
        const getOptions = Object.assign({}, this.defaultOptions, this.defaultDeleteOptions, { url, params }, options);

        return this.callApi(getOptions);
    }

    jsonp(url: string, callbackParam: string): Observable<object> {
        return this.httpClient.jsonp(url, callbackParam);
    }

    protected onWireup() {
        // This is intentional
    }

    private callApi(options: InternalApiOptions): Observable<any> {
        let url = options.url;

        if (!isAbsolute(url)) {
            url = '';

            if (options.baseUrl && (!options.prefix || !isAbsolute(options.prefix))) {
                url += options.baseUrl;
            }

            url += (options.prefix || '') + '/api/' + options.url;
        }

        let urlParams = new HttpParams();

        if (options.params) {
            if (options.params instanceof HttpParams) {
                urlParams = options.params;
            } else {
                forOwn(options.params, (value: string | string[], param: string) => {
                    if (Array.isArray(value)) {
                        for (const e of value) {
                            if (e != null) {
                                urlParams = urlParams.append(param, e);
                            }
                        }
                    } else {
                        if (value != null) {
                            urlParams = urlParams.append(param, value);
                        }
                    }
                });
            }
        }

        let headers = new HttpHeaders({ ...this.defaultHeaders, ...(options.headers || {}) });

        if (options.messageQueueScope) {
            headers = headers.append('X-van-message-queue-scope', options.messageQueueScope);
        }

        this.preRequest(options);

        const { data, responseType, reportProgress, withCredentials } = options;

        let request = this.httpClient.request(options.method, url, {
            params: urlParams,
            headers,
            body: data,
            ...(responseType ? { responseType } : {}),
            observe: 'response',
            ...(reportProgress != null ? { reportProgress } : {}),
            ...(withCredentials != null ? { withCredentials } : {}),
        });

        if (options.retryCount) {
            let delayFn: (attempt: number) => number;
            let retryCondition: (status: number) => boolean;

            if (options.retryDelay instanceof Function) {
                delayFn = options.retryDelay;
            } else {
                const delay = options.retryDelay!;
                delayFn = () => delay;
            }

            if (options.retryOnStatus instanceof Function) {
                retryCondition = options.retryOnStatus;
            } else {
                const statuses = options.retryOnStatus || [];
                retryCondition = (status: number) => statuses.indexOf(status) !== -1;
            }

            request = request.pipe(
                retryWhen((errors: any) =>
                    errors.pipe(
                        mergeMap((err: any, i: number) => {
                            const failCount = i + 1;

                            if (failCount > options.retryCount! || !retryCondition(err.status)) {
                                return _throw(err);
                            }

                            return timer(delayFn(failCount));
                        }),
                    ),
                ),
            );
        }

        return request.pipe(
            catchError((err: HttpResponse<any>) => {
                const data = this.postRequest(options, err);

                return _throw(data);
            }),
            map((res) => this.postRequest(options, res)),
        );
    }

    private postRequest(options: InternalApiOptions, response: HttpResponse<any> | HttpErrorResponse): any {
        if (options.loadingIndicator) {
            options.loadingIndicator.done();
        }

        if (options.resolveWithFullResponse) {
            return response;
        }

        if (response instanceof HttpResponse) {
            return response.body;
        }

        return response.error;
    }

    private preRequest(options: InternalApiOptions) {
        if (options.showSpinner) {
            options.loadingIndicator = this.loadingIndicatorService.start({
                url: options.url,
            });
        }
    }
}
