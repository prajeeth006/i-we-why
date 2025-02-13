import { Component, Input, ViewEncapsulation } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { Brands } from '../../constants/brands';
import { ShowErrorPageUrlContent } from './models/error-content.model';
import { ErrorContentService } from './services/error-content.service';

declare global {
    interface Window {
        label: string;
    }
}
@Component({
    selector: 'gn-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ErrorComponent {
    @Input() errorMessage$: Observable<string>;
    brandLabel: string;
    errorPageContent$: BehaviorSubject<ShowErrorPageUrlContent> = new BehaviorSubject<ShowErrorPageUrlContent>({
        brandImagePathInElectron: this.getBrandSpecificPath(window['label']),
        showDataFeedApiUrl: false,
    });

    showErrorPageUrl$: Observable<ShowErrorPageUrlContent>;

    constructor(private errorContent: ErrorContentService) {
        this.brandLabel = window['label'];
        this.showErrorPageUrl$ = this.errorPageContent$.asObservable();
        this.errorContent.showErrorPageUrl$.subscribe((result: ShowErrorPageUrlContent) => {
            if (result?.brandImagePathInElectron) {
                this.errorPageContent$.next(result);
            }
        });
    }

    getBrandSpecificPath(brand: string) {
        if (brand?.toLowerCase()?.includes(Brands.Ladbrokes)) {
            return 'file:///opt/rdisp-frontend-helper/util/assets/Ladbrokes_logo.svg';
        } else {
            return 'file:///opt/rdisp-frontend-helper/util/assets/Coral_logo.svg';
        }
    }
}
