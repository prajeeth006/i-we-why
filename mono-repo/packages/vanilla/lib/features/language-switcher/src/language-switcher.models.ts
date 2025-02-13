export interface LanguageSwitcherItem {
    nativeName: string;
    routeValue: string;
    url: string;
    image: string | null;
    isActive: boolean;
    culture?: string;
}

export interface LanguageSwitcherMenuData {
    openedByLanguageSelector: boolean;
}
