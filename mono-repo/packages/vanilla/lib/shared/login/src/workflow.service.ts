import { Injectable } from '@angular/core';

import {
    LoginResponseHandlerService,
    LoginResponseOptions,
    LoginStoreService,
    ProductNavigationService,
    SharedFeaturesApiService,
    UserService,
    WorkflowHandleResponse,
    WorkflowResponse,
} from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';

/**
 * @whatItDoes Provides options to get the user out of workflow mode.
 */
@Injectable({
    providedIn: 'root',
})
export class WorkflowService {
    constructor(
        private api: SharedFeaturesApiService,
        private loginResponseHandler: LoginResponseHandlerService,
        private loginStore: LoginStoreService,
        private user: UserService,
        private productNavigationService: ProductNavigationService,
    ) {}

    /**
     * @whatItDoes Calls POS API `FinalizeWorkflow` method, executes login including redirection.
     *
     * @description
     *
     * It is required to call this to get the user out of the workflow.
     *
     */
    async finalize(options?: LoginResponseOptions): Promise<WorkflowResponse> {
        return await this.execute(this.user.workflowType < 0 ? 'finalizePostLoginWorkflow' : 'finalizeWorkflow', options);
    }

    /**
     * @whatItDoes Calls POSAPi `SkipWorkflow` method, executes login including redirection.
     *
     * @description
     *
     * Skips the workflow.
     */
    async skip(options?: LoginResponseOptions): Promise<WorkflowResponse> {
        return await this.execute(this.user.workflowType < 0 ? 'finalizePostLoginWorkflow' : 'skipworkflow', options);
    }

    /**
     * @whatItDoes Calls POSAPi `workflowdata` and then finalize().
     *
     * @description
     *
     * Finalizes workflow with data.
     */
    async finalizeWithData(data: any, options?: LoginResponseOptions): Promise<WorkflowResponse> {
        await firstValueFrom(this.api.post('workflowdata', data));

        return await this.finalize(options);
    }

    /**
     * @whatItDoes Calls POS API `FinalizeWorkflow` method, executes login without redirection.
     *
     * @description
     *
     * It is required to call this to get the user out of the workflow.
     *
     */
    async finalizeHandle(options?: LoginResponseOptions): Promise<WorkflowHandleResponse> {
        return await this.executeHandle(this.user.workflowType < 0 ? 'finalizePostLoginWorkflow' : 'finalizeWorkflow', options);
    }

    /**
     * @whatItDoes Calls POSAPi `workflowdata`, then `FinalizeWorkflow` method, executes login without redirection.
     *
     * @description
     *
     * It is required to call this to get the user out of the workflow.
     *
     */
    async finalizeWithDataHandle(data: any, options?: LoginResponseOptions): Promise<WorkflowHandleResponse> {
        await firstValueFrom(this.api.post('workflowdata', data));

        return await this.finalizeHandle(options);
    }

    private async execute(action: string, options?: LoginResponseOptions): Promise<WorkflowResponse> {
        let response;

        try {
            response = await firstValueFrom(this.api.post(action, this.getParameters()));
        } catch (loginError: any) {
            this.productNavigationService.goTo(loginError?.redirectUrl);
            return { loginError: loginError };
        }

        await this.loginResponseHandler.handleResponse(response, options);

        return {}; // better not to return response here because handleResponse redirects. if they need it they need to use Handle method
    }

    private async executeHandle(action: string, options?: LoginResponseOptions): Promise<WorkflowHandleResponse> {
        let response;

        try {
            response = await firstValueFrom(this.api.post(action, this.getParameters()));
        } catch (error: any) {
            this.productNavigationService.goTo(error?.redirectUrl);

            return { loginError: error };
        }

        const loginRedirectInfo = await this.loginResponseHandler.handle(response, options);

        return { loginResponse: response, loginRedirectInfo: loginRedirectInfo };
    }

    private getParameters(): { loginType: string | null } {
        return {
            loginType: this.loginStore.LoginType,
        };
    }
}
