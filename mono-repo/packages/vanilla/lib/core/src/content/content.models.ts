/**
 * @stable
 */
export interface ContentItem {
    templateName: string;
    name: string;
    parameters?: { [name: string]: string } | undefined; // Optional undefined
    title?: string;
    titleLink?: ContentLink;
    text?: string;
    image?: ContentImage;
    items?: ContentItem[];
    class?: string;
}

/**
 * @stable
 */
export interface ContentLink {
    url: string;
    text?: string;
    attributes?: { [attr: string]: string };
}

/**
 * @stable
 */
export interface ContentImage {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
}

/**
 * @stable
 */
export interface ContentVideo {
    src: string;
    id: string;
    width: number;
    height: number;
}

/**
 * @stable
 */
export interface PCImage {
    imageLink?: ContentLink;
    image?: ContentImage;
    tooltip?: string;
    iconName?: string;
}

/**
 * @stable
 */
export interface LinkTemplate {
    text?: string;
    htmlAttributes?: { [attr: string]: string };
    url: string;
}

/**
 * @stable
 */
export interface ViewTemplate {
    text?: string;
    title?: string;
    messages?: { [attr: string]: string };
}

/**
 * @stable
 */
export interface GenericListItem {
    messages: { [attr: string]: string };
}

/**
 * @stable
 */
export enum MenuDisplayMode {
    Icon = 'icon',
    Svg = 'svg',
    SvgIcon = 'svg-icon',
    FastIcon = 'FastIcon',
}

/**
 * @stable
 */
export interface MenuContentItem {
    text: string;
    url: string;
    class: string;
    target: string;
    rel: string;
    clickAction: string;
    authstate: any;
    image: ContentImage;
    name: string;
    type: string;
    menuRoute: string;
    menuRouteParent: string;
    layout: string;
    trackEvent: { eventName: string; data: any; [key: string]: any };
    children: MenuContentItem[];
    parameters: { [key: string]: string };
    resources: { [key: string]: string };
    subNavigationContainer: string;
    toolTip?: string;
    webAnalytics?: string;
    svgImage: ContentImage;
    viewBox: string;
    size: string;
    iconType: string;
    defaultAnimation: boolean;
    customAnimation: string;
    cssClass: string;
    iconName: string;
}

/**
 * @stable
 */
export interface ExpandableMenuItem extends MenuContentItem {
    expanded: boolean;
    children: ExpandableMenuItem[];
}

/**
 * @stable
 */
export interface MenuContentSection {
    name: string;
    title: string;
    class: string;
    authstate: any;
    items: MenuContentItem[];
}

/**
 * @stable
 */
export interface ListItem {
    text: string;
    value: string;
}

/**
 * @stable
 */
export interface FormElementTemplateForClient extends Record<string, any> {
    id?: string;
    label?: string;
    toolTip?: string;
    validation?: { [key: string]: string };
    htmlAttributes?: { [key: string]: string };
    values?: ListItem[];
    watermark?: string;
}

/**
 * @stable
 */
export interface ViewTemplateForClient extends Record<string, any> {
    title?: string;
    text?: string;
    messages?: { [key: string]: string };
    validation?: { [key: string]: string };
    form: { [key: string]: FormElementTemplateForClient };
    proxy?: { [key: string]: ProxyItemForClient | FormElementTemplateForClient | ViewTemplateForClient };
    children: { [key: string]: ViewTemplateForClient };
    links: { [key: string]: LinkTemplateForClient };
}

/**
 * @stable
 */
export interface LinkTemplateForClient {
    url?: string;
    relativeUrl?: string;
    htmlAttributes?: { [key: string]: string };
    link?: ContentLink;
    linkText?: string;
    name?: string;
    toolTip?: string;
}

/**
 * @stable
 */
export interface ProxyItemForClient {
    isProxy: boolean;
    rules: ProxyRuleForClient[];
}

/**
 * @stable
 */
export interface ProxyRuleForClient {
    condition?: string;
    document?: ContentItem;
}

/**
 * @stable
 */
export enum MenuItemType {
    TextWidget = 'text-widget',
}
