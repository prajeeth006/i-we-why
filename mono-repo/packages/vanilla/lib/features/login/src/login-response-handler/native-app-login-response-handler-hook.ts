import { Injectable } from '@angular/core';

import { LoginResponseHandlerContext, LoginResponseHandlerHook, LoginStoreService, PostLoginService } from '@frontend/vanilla/core';

@Injectable()
export class NativeAppLoginResponseHandlerHook implements LoginResponseHandlerHook {
    constructor(
        private loginStore: LoginStoreService,
        private postLoginService: PostLoginService,
    ) {}

    async onPostLogin(context: LoginResponseHandlerContext) {
        /// avoid sending event if delay is enabled and this is not last handling
        if (this.loginStore.PostLoginCcbEventDelayEnabled && !context.isLastIteration) {
            return;
        }

        await this.postLoginService.sendPostLoginEvent(context.response.postLoginValues, context.options.additionalPostLoginCcbParameters);
    }
}
