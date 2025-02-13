import * as figma from '@figma/rest-api-spec';
import axios, { AxiosInstance, AxiosProxyConfig } from 'axios';

import { IFigmaClient } from './types/client.types';

export type FigmaClientOptions = {
    personalAccessToken?: string;
    accessToken?: string;
    proxy?: URL;
};

export class FigmaClient implements IFigmaClient {
    private http: AxiosInstance;

    constructor(opts: FigmaClientOptions) {
        const headers = opts.accessToken ? { Authorization: `Bearer ${opts.accessToken}` } : { 'X-Figma-Token': opts.personalAccessToken };

        const proxy: AxiosProxyConfig | undefined = opts.proxy
            ? {
                  host: opts.proxy.hostname,
                  port: Number.parseInt(opts.proxy.port, 10),
                  protocol: opts.proxy.protocol,
                  auth:
                      opts.proxy.username !== '' && opts.proxy.password !== ''
                          ? {
                                username: opts.proxy.username,
                                password: opts.proxy.password,
                            }
                          : undefined,
              }
            : undefined;

        this.http = axios.create({
            baseURL: `https://api.figma.com`,
            headers: headers,
            proxy: proxy,
        });
    }

    async getFile(pathParams: figma.GetFilePathParams, queryParams: figma.GetFileQueryParams): Promise<figma.GetFileResponse> {
        const response = await this.http.get<figma.GetFileResponse>(`/v1/files/${pathParams.file_key}`, {
            params: queryParams,
        });
        return response.data;
    }

    async getFileNodes(pathParams: figma.GetFileNodesPathParams, queryParams: figma.GetFileNodesQueryParams): Promise<figma.GetFileNodesResponse> {
        return this.http
            .get<figma.GetFileNodesResponse>(`/v1/files/${pathParams.file_key}/nodes`, {
                params: queryParams,
            })
            .then((response) => response.data);
    }

    async getImages(pathParams: figma.GetImagesPathParams, queryParams: figma.GetImagesQueryParams): Promise<figma.GetImagesResponse> {
        return this.http
            .get<figma.GetImagesResponse>(`/v1/images/${pathParams.file_key}`, {
                params: queryParams,
            })
            .then((response) => response.data);
    }

    async getImageFills(pathParams: figma.GetImageFillsPathParams): Promise<figma.GetImageFillsResponse> {
        return this.http.get<figma.GetImageFillsResponse>(`/v1/images/${pathParams.file_key}/fills`).then((response) => response.data);
    }

    async getLocalVariables(pathParams: figma.GetLocalVariablesPathParams): Promise<figma.GetLocalVariablesResponse> {
        return this.http.get<figma.GetLocalVariablesResponse>(`/v1/files/${pathParams.file_key}/variables/local`).then((response) => response.data);
    }

    async getPublishedVariables(pathParams: figma.GetPublishedVariablesPathParams): Promise<figma.GetPublishedVariablesResponse> {
        return this.http
            .get<figma.GetPublishedVariablesResponse>(`/v1/files/${pathParams.file_key}/variables/published`)
            .then((response) => response.data);
    }

    async postVariables(
        pathParams: figma.PostVariablesPathParams,
        requestBody: figma.PostVariablesRequestBody,
    ): Promise<figma.PostVariablesResponse> {
        return this.http
            .post<figma.PostVariablesResponse>(`/v1/files/${pathParams.file_key}/variables`, requestBody)
            .then((response) => response.data);
    }

    async postWebhook(requestBody: figma.PostWebhookRequestBody): Promise<figma.PostWebhookResponse> {
        return this.http.post<figma.PostWebhookResponse>(`/v2/webhooks`, requestBody).then((response) => response.data);
    }

    async getWebhook(pathParams: figma.GetWebhookPathParams): Promise<figma.GetWebhookResponse> {
        return this.http.get<figma.GetWebhookResponse>(`/v2/webhooks/${pathParams.webhook_id}`).then((response) => response.data);
    }

    async putWebhook(pathParams: figma.PutWebhookPathParams, requestBody: figma.PutWebhookRequestBody): Promise<figma.PutWebhookResponse> {
        return this.http.put<figma.PutWebhookResponse>(`/v2/webhooks/${pathParams.webhook_id}`, requestBody).then((response) => response.data);
    }

    async deleteWebhook(pathParams: figma.DeleteWebhookPathParams): Promise<figma.DeleteWebhookResponse> {
        return this.http.delete<figma.DeleteWebhookResponse>(`/v2/webhooks/${pathParams.webhook_id}`).then((response) => response.data);
    }

    async getTeamWebhooks(pathParams: figma.GetTeamWebhooksPathParams): Promise<figma.GetTeamWebhooksResponse> {
        return this.http.get<figma.GetTeamWebhooksResponse>(`/v2/teams/${pathParams.team_id}/webhooks`).then((response) => response.data);
    }

    async getWebhookRequests(pathParams: figma.GetWebhookRequestsPathParams): Promise<figma.GetWebhookRequestsResponse> {
        return this.http.get<figma.GetWebhookRequestsResponse>(`/v2/webhooks/${pathParams.webhook_id}/requests`).then((response) => response.data);
    }

    async getFileStyles(pathParams: figma.GetFileStylesPathParams): Promise<figma.GetFileStylesResponse> {
        return this.http.get<figma.GetFileStylesResponse>(`/v1/files/${pathParams.file_key}/styles`).then((response) => response.data);
    }
}
