import { Injectable } from '@angular/core';

import { toNumber } from 'lodash-es';
import { IndividualConfig } from 'ngx-toastr';

import { ContentItem } from '../content/content.models';
import { toBoolean } from '../utils/convert';

@Injectable({
    providedIn: 'root',
})
export class ToastrOptionsBuilder {
    build(item: ContentItem): Partial<IndividualConfig> {
        const options = Object.assign({ toastClass: '' }, item.parameters);

        this.convertOption(options, 'closeButton', toBoolean);
        this.convertOption(options, 'disableTimeOut', toBoolean);
        this.convertOption(options, 'easeTime', toNumber);
        this.convertOption(options, 'timeOut', toNumber);
        this.convertOption(options, 'extendedTimeOut', toNumber);
        this.convertOption(options, 'progressBar', toBoolean);
        this.convertOption(options, 'tapToDismiss', toBoolean);
        this.convertOption(options, 'toastClass', (c) => {
            const classes: any[] = [];
            if (c) {
                classes.push(c);
            } else {
                classes.push('toast');
                if (item.parameters!['type']) {
                    classes.push('toast-icon');
                }
            }

            if (item.class) {
                classes.push(item.class);
            }

            if (item.parameters!['closeButton']) {
                classes.push('has-close-icon');
            }

            return classes.join(' ');
        });

        return options;
    }

    private convertOption<T>(options: any, prop: keyof IndividualConfig, convertor: (p: string) => T) {
        if (!options.hasOwnProperty(prop)) {
            return;
        }

        options[prop] = convertor(options[prop]);
    }
}
