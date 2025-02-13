import { ContentImage, ContentItem, ContentLink, ContentVideo, ExpandableMenuItem } from '@frontend/vanilla/core';

/**
 * @stable
 */
export interface PcContentItem extends ContentItem {
    content?: ContentItem[];
    controls?: { [key: string]: string };
    height?: number;
    imageLink?: ContentLink;
    imageOverlay?: ContentImage;
    imageOverlayClass?: string;
    item?: ContentItem;
    maxItems?: number;
    menu?: ExpandableMenuItem;
    menuItems?: ContentItem[];
    optionalText?: string;
    pageClass?: string;
    pageDescription?: string;
    pageId?: string;
    pageMetaTags?: { [key: string]: string };
    pageTitle?: string;
    src?: string;
    subtitle?: string;
    summary?: string;
    video?: ContentVideo;
    width?: number;
    iconName?: string;
}
