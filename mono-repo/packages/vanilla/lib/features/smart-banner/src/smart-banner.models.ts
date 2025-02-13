import { SmartBannerConfig } from './smart-banner.client-config';

export interface ApplicationStoreInfo {
    name: string;
    rating: number;
}

export type SmartBannerData = Pick<SmartBannerConfig, 'content' | 'appInfo'> & {
    appStoreInfo: ApplicationStoreInfo;
    showRating: boolean;
    loaded: boolean;
};
