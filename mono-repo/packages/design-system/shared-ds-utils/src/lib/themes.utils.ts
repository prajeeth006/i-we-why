import { THEME_LIST } from './themes.constant';

export function getDesignSystemThemes(config: { only?: string[]; exclude?: string[] } = {}): Record<string, string> {
    return THEME_LIST.reduce(
        (obj: Record<string, string>, theme) => {
            if (config.only && !config.only.includes(theme.name)) {
                return obj;
            }
            if (config.exclude && config.exclude.includes(theme.name)) {
                return obj;
            }
            return {
                ...obj,
                [theme.name]: `${theme.mainThemeparkClass}${theme.enableDarkBg ? ' dark-bg' : ''}`,
            };
        },
        {} satisfies Record<string, string>,
    );
}

export function getThemeparkThemes(config: { only?: string[]; exclude?: string[] } = {}): Record<string, string> {
    return THEME_LIST.reduce(
        (obj: Record<string, string>, theme) => {
            const themeParkList = [theme.mainThemeparkClass, ...(theme.alternativeThemeparkClasses ?? [])].filter((x) => {
                if (config.only && !config.only.includes(x)) {
                    return false;
                }
                return !(config.exclude && config.exclude.includes(x));
            });
            const newObj = themeParkList.reduce(
                (themeParkObj: Record<string, string>, themePark) => ({
                    ...themeParkObj,
                    [`${theme.name} (${themePark.slice('th-'.length)})`]: `${themePark}${theme.enableDarkBg ? ' dark-bg' : ''}`,
                }),
                {} satisfies Record<string, string>,
            );
            return {
                ...obj,
                ...newObj,
            };
        },
        {} satisfies Record<string, string>,
    );
}
