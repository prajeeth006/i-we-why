import { MenuContentItem } from '@frontend/vanilla/core';

/**
 * Represents the navigation item
 *
 * @stable
 */
export class NavigationItem {
    name: string;
    pageTitle: string;
    headerTitle: string | null;
    leftMenuTitle: string | null;
    parent: MenuContentItem | null;
    selectedTopItem: string;
    selectedLeftItem: string | null;
    topMenuItems: MenuContentItem[];
    leftMenuItems: MenuContentItem[];
    hideHeaderCloseButton: boolean | undefined;
}

/**
 * Represents the events fired on navigation layout scroll
 *
 * @stable
 */
export interface NavigationScrollEvent {
    element: HTMLElement;
    isAtBottom: boolean;
}
