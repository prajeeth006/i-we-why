import { Injectable, inject } from '@angular/core';

import { Logger, Page, SharedFeaturesApiService, UserService } from '@frontend/vanilla/core';
import { first } from 'rxjs';

@Injectable()
export class SingleSignOnService {
    private apiService = inject(SharedFeaturesApiService);
    private user = inject(UserService);
    private page = inject(Page);
    private log = inject(Logger);

    setSsoToken() {
        if (this.user.isAuthenticated && this.user.ssoToken) {
            const labels = this.page.singleSignOnLabels.filter((label) => !label?.endsWith(this.page.domain));
            labels?.forEach((url) => {
                this.apiService
                    .post(
                        'singlesignon/setssotoken',
                        { ssoToken: this.user.ssoToken },
                        { prefix: '', baseUrl: url, withCredentials: true, showSpinner: false },
                    )
                    .pipe(first())
                    .subscribe({
                        next: () => this.log.info(`SingleSignOn: Successfully called ${url}/api/singlesignon/setssotoken`),
                        error: (error) => this.log.info(`SingleSignOn: Failed to call ${url}/api/singlesignon/setssotoken`, error),
                    });
            });
        }
    }
}
