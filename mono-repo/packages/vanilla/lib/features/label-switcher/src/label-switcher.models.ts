import { ContentImage } from '@frontend/vanilla/core';

export interface LabelSwitcherItem {
    name: string;
    country: string | undefined;
    regionCode: string | undefined;
    region: string | undefined;
    text: string;
    url: string;
    isActive: boolean;
    image?: ContentImage;
}
