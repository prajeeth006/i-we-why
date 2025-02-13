import { Injectable, inject } from '@angular/core';

import { IconsModel } from './icons-model';
import { IconsetConfig } from './icons.client-config';

@Injectable({ providedIn: 'root' })
export class IconFastService {
    config = inject(IconsetConfig);

    getIconParameter(uniqueIconName: string, parameter: string) {
        if (this.config.iconItems) {
            const matchingIcon: IconsModel = this.config.iconItems.find(
                (data: IconsModel) => data.name === uniqueIconName || data.iconName === uniqueIconName,
            ) || {
                name: 'notfound',
                iconName: '',
                parameters: { urlId: '' },
                image: { src: '' },
            };

            if (matchingIcon.name != 'notfound') {
                return this.getAvailableValues(parameter, matchingIcon);
            }
        }
        return '';
    }

    getAvailableValues(parameter: string, icon: IconsModel) {
        switch (parameter) {
            case 'urlId':
                return icon.parameters?.urlId ?? icon.image?.src ?? icon.imageUrl;
            case 'size':
                return icon.parameters?.size ?? icon.size;
            case 'extraClass':
                return icon.parameters?.extraClass ?? icon.extraClass;
            case 'fillColor':
                return icon.parameters?.fillColor ?? icon.fillColor;
            case 'title':
                return icon.parameters?.title ?? icon.title;
            default:
                return '';
        }
    }

    static isValueHere(obj: any, searchValue: string): boolean {
        for (let key in obj) {
            if (obj[key] === searchValue) {
                return true;
            }
        }
        return false;
    }
}
