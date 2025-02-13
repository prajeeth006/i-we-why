/**
 * @stable
 */
export interface DocumentDetails {
    documentStatus: string;
    documentType: string;
    documentStatusLastUpdated?: Date;
    uploadedDate: Date;
    uploadedReason: string;
    documentsCount: number;
}

/**
 * @stable
 */
export interface DocumentVerificationStatus {
    useCase: VerificationUseCase;
    isVerified: boolean;
    verifiedTime?: Date;
    documentDetails: DocumentDetails[];
}

/**
 * @stable
 */
export interface UserDocumentsResponse {
    documentVerificationStatus: DocumentVerificationStatus[];
}

/**
 * @stable
 *
 * Order matters.
 */
export enum DocumentStatus {
    Failed = 'Failed',
    Required = 'Required',
    InProgress = 'InProgress',
    Verified = 'Verified',
}

/**
 * @stable
 */
export enum VerificationUseCase {
    All = 'ALL',
    Kyc = 'KYC',
    TwoPlusTwo = 'TWO-PLUS-TWO',
    UkKycRefresh = 'UK-KYC-REFRESH',
    Sof = 'SOF',
}

/**
 * @stable
 */
export enum GracePeriodUnit {
    Hours = 'hours',
    Days = 'days',
}
