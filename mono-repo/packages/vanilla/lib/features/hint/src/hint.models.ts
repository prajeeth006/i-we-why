export enum HitType {
    HomeScreen = 'homescreen',
}

export interface HintQueueItem {
    name: string;
    shouldShow: boolean;
    displayCounter?: number;
    expires?: number;
    product?: string;
}
