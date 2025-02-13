export interface LazyAsset {
    url: string;
    media?: string;
    alias?: string;
    lazyLoad: 'Important' | 'Secondary' | 'Custom';
}
