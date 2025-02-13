import { HttpParams } from '@angular/common/http';

import { LoadingIndicatorHandler } from '../loading-indicator/loading-indicator-handler';

/**
 * Options for {@link ApiBase}.
 *
 * @stable
 */
export interface ApiOptions {
    method?: string;
    showSpinner?: boolean;
    resolveWithFullResponse?: boolean;
    prefix?: string;
    url?: string;
    params?: { [key: string]: any } | HttpParams;
    headers?: { [key: string]: string };
    data?: any;
    responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
    reportProgress?: boolean;
    messageQueueScope?: string;
    retryCount?: number;
    retryDelay?: number | ((attempt: number) => number);
    retryOnStatus?: number[] | ((status: number) => boolean);
    withCredentials?: boolean;
    baseUrl?: string;
}

export interface InternalApiOptions extends ApiOptions {
    loadingIndicator?: LoadingIndicatorHandler;
    url: string;
    method: string;
}

export interface ApiFactoryOptions {
    product: string;
    area: string | null;
    forwardProductApiRequestHeader: boolean;
}
