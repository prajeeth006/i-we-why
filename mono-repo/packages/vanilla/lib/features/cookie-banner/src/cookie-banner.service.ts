import { Injectable, inject } from '@angular/core';

import { CookieService, Logger, Page, SharedFeaturesApiService, WINDOW } from '@frontend/vanilla/core';

@Injectable({
    providedIn: 'root',
})
export class CookieBannerService {
    private apiService = inject(SharedFeaturesApiService);
    private page = inject(Page);
    private log = inject(Logger);
    private cookieService = inject(CookieService);
    readonly #window = inject(WINDOW);

    setOptanonGroupCookie() {
        if (this.#window.OneTrust) {
            this.#window.OneTrust.OnConsentChanged(() => {
                const params = new URLSearchParams(this.cookieService.get('OptanonConsent'));
                const groups = params.get('groups');
                const labels = this.page.singleSignOnLabels.filter((label) => !label?.endsWith(this.page.domain));
                labels?.forEach((url: any) => {
                    this.apiService
                        .post(
                            'cookiebanner/setOptanonGroupCookie',
                            { cookieValue: groups },
                            { prefix: '', baseUrl: url, withCredentials: true, showSpinner: false },
                        )
                        .pipe()
                        .subscribe({
                            next: () => this.log.info(`Cookie Banner: Successfully called ${url}/api/cookiebanner/setCookie`),
                            error: (error) => this.log.info(`Cookie Banner: Failed to call ${url}/api/cookiebanner/setCookie`, error),
                        });
                });
            });
        } else {
            this.log.info(`Cookie Banner: OneTrust missing on window`);
        }
    }
}
