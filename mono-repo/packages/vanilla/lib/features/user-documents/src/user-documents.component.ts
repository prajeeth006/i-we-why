import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DynamicHtmlDirective, MenuContentItem, SofStatusDetails, SofStatusDetailsCoreService, TrackingService } from '@frontend/vanilla/core';
import { BalancePropertiesService } from '@frontend/vanilla/features/balance-properties';
import { FormatPipe } from '@frontend/vanilla/shared/browser';
import { KycStatus, KycStatusService } from '@frontend/vanilla/shared/kyc';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { UserDocumentsConfig } from './user-documents.client-config';
import {
    DocumentDetails,
    DocumentStatus,
    DocumentVerificationStatus,
    GracePeriodUnit,
    UserDocumentsResponse,
    VerificationUseCase,
} from './user-documents.models';

/**
 * Sitecore: {@link http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={63AE6738-595A-481C-BF4E-E39399377774}&la=}
 *
 * @stable
 */
@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, DynamicHtmlDirective, FormatPipe],
    selector: 'vn-am-user-documents',
    templateUrl: 'user-documents.html',
})
export class UserDocumentsComponent implements OnInit {
    item = input.required<MenuContentItem>();
    userDocuments = input.required<UserDocumentsResponse>();

    DocumentStatus = DocumentStatus;
    VerificationUseCase = VerificationUseCase;
    getNotice = computed(() => {
        if (!this.userDocuments().documentVerificationStatus?.length) {
            return;
        }

        for (const status in DocumentStatus) {
            const haveSameStatus = this.userDocuments().documentVerificationStatus.every((document: DocumentVerificationStatus) =>
                document.documentDetails.every((details: DocumentDetails) => details.documentStatus === status),
            );

            if (this.userDocuments().documentVerificationStatus.length > 1 && !haveSameStatus) {
                continue; // Skip if not all documents have the same status.
            }

            const haveNotice = this.userDocuments().documentVerificationStatus.every((document: DocumentVerificationStatus) =>
                document.documentDetails.some((details: DocumentDetails) => details.documentStatus === status),
            );

            if (haveNotice) {
                const isVerified = this.userDocuments().documentVerificationStatus.every(
                    (document: DocumentVerificationStatus) => document.isVerified,
                );

                return this.item().resources[`${isVerified ? DocumentStatus.Verified : status}_Notice`];
            }
        }

        return;
    });

    readonly kycStatus = signal<KycStatus | null>(null);
    sofStatusDetails: Observable<SofStatusDetails | null>;

    constructor(
        public config: UserDocumentsConfig,
        public sofStatusDetailsService: SofStatusDetailsCoreService,
        public balancePropertiesService: BalancePropertiesService,
        private kycStatusService: KycStatusService,
        private trackingService: TrackingService,
    ) {
        this.kycStatusService.kycStatus
            .pipe(
                takeUntilDestroyed(),
                filter((status: KycStatus | null): status is KycStatus => status !== null),
            )
            .subscribe((kycStatus: KycStatus) => {
                const isUkKycRefreshRequired = this.getKycStatusValue<string>(kycStatus, 'isUkKycRefreshRequired') === 'y';

                kycStatus.graceDaysUnit =
                    isUkKycRefreshRequired && kycStatus.additionalKycInfo
                        ? this.getKycStatusValue<string>(kycStatus, 'ukKycRefreshGraceDaysUnit') || GracePeriodUnit.Days
                        : kycStatus.graceDaysUnit || GracePeriodUnit.Days;

                this.kycStatus.set(kycStatus);
            });
    }

    ngOnInit() {
        this.sofStatusDetailsService.whenReady.subscribe(() => {
            this.sofStatusDetailsService.refresh();
            this.sofStatusDetails = this.sofStatusDetailsService.statusDetails;
        });
        this.trackingService.trackContentItemEvent(this.item().trackEvent, 'LoadedEvent');
    }

    getTemplate(name?: string): MenuContentItem | undefined {
        return this.item().children?.find((item: MenuContentItem) => name && item.name.indexOf(name.toLowerCase()) > -1);
    }

    getLink(useCase: VerificationUseCase, status: string): string | undefined {
        return status === DocumentStatus.Required ? this.item().resources[`${useCase}_link`.toUpperCase()] : undefined;
    }

    getGracePeriod(useCase: VerificationUseCase, kycStatus: KycStatus, sofRedStatusDays?: number): string | undefined {
        let gracePeriod: number;

        if (sofRedStatusDays) {
            kycStatus.graceDaysUnit = GracePeriodUnit.Days;
            gracePeriod = sofRedStatusDays;
        } else {
            gracePeriod = kycStatus.isKycStarted ? kycStatus.verificationDaysLeft : kycStatus.depositGraceDays;
        }

        if (gracePeriod === -1 && useCase === VerificationUseCase.UkKycRefresh) {
            kycStatus.graceDaysUnit = this.getKycStatusValue<string>(kycStatus, 'ukKycRefreshGraceDaysUnit') || GracePeriodUnit.Days;
            gracePeriod = this.getKycStatusValue<number>(kycStatus, 'ukKycRefreshgraceDays') || -1;
        }

        return this.getGracePeriodText(gracePeriod, kycStatus.graceDaysUnit);
    }

    documentHaveStatus(documentStatus: DocumentStatus): boolean {
        return this.userDocuments().documentVerificationStatus.some((document: DocumentVerificationStatus) =>
            document.documentDetails.find((details: DocumentDetails) => details.documentStatus === documentStatus),
        );
    }

    private getGracePeriodText(gracePeriod: number, graceUnit: string): string | undefined {
        if (!gracePeriod || gracePeriod < 1) {
            return;
        }

        if (graceUnit?.toLowerCase() === GracePeriodUnit.Days) {
            // Hide grace period if true
            if (gracePeriod >= Number(this.item().parameters.hideGracePeriodDaysThreshold)) {
                return;
            }

            // Convert days to hours if true
            if (gracePeriod <= Number(this.item().parameters.gracePeriodDaysToHoursThreshold)) {
                return `${gracePeriod * 24} ${this.item().resources[gracePeriod === 1 ? 'HourLeft' : 'HoursLeft']}`;
            }

            return `${gracePeriod} ${this.item().resources[gracePeriod === 1 ? 'DayLeft' : 'DaysLeft']}`;
        }

        return `${gracePeriod} ${this.item().resources[gracePeriod === 1 ? 'HourLeft' : 'HoursLeft']}`;
    }

    private getKycStatusValue<T>(kycStatus: KycStatus, key: string): T | undefined {
        return kycStatus.additionalKycInfo?.find((info: { [key: string]: string }) => info.Key === key)?.Value as T | undefined;
    }
}
