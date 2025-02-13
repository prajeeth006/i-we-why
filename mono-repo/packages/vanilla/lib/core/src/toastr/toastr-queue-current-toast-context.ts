import { cloneDeep, mapValues } from 'lodash-es';
import { ActiveToast } from 'ngx-toastr';

import { ContentItem } from '../content/content.models';
import { replacePlaceholders, toBoolean } from '../utils/convert';

/**
 * @whatItDoes Holds context for currently displayed toast in the {@link ToastrQueueService}.
 *
 * @stable
 */
export class ToastrQueueCurrentToastContext {
    private readonly _hideOnNavigation: boolean;

    constructor(
        private originalContent: ContentItem,
        private placeholders: { [key: string]: string },
    ) {
        this.replacePlaceholders();
        this._hideOnNavigation = !!(this._content.parameters && toBoolean(this._content.parameters['hideOnNavigation']));
    }

    get hideOnNavigation(): boolean {
        return this._hideOnNavigation;
    }

    private _toast: ActiveToast<any>;

    get toast(): ActiveToast<any> {
        return this._toast;
    }

    private _content: ContentItem;

    get content(): ContentItem {
        return this._content;
    }

    /** @internal */
    setToast(toast: ActiveToast<any>) {
        this._toast = toast;
    }

    /**
     * Sets new or changes existing placeholder values and updates content.
     * **NOTE**: This will not change values already displayed in the toast, but can be used to update placeholders for tracking.
     */
    /** @internal */
    updatePlaceholders(placeholders: { [key: string]: string }) {
        this.placeholders = Object.assign({}, this.placeholders, placeholders);
        this.replacePlaceholders();
    }

    private replacePlaceholders() {
        this._content = cloneDeep(this.originalContent);

        if (!this._content.parameters) {
            this._content.parameters = {};
        }

        this._content.title = this.replaceCustomPlaceholdersInValue(this._content.title);
        this._content.text = this.replaceCustomPlaceholdersInValue(this._content.text);
        this._content.class = this.replaceCustomPlaceholdersInValue(this._content.class);
        this._content.parameters = mapValues(this._content.parameters, (value: string) => this.replaceCustomPlaceholdersInValue(value) || '');
    }

    private replaceCustomPlaceholdersInValue(value: string | undefined): string {
        return replacePlaceholders(value, this.placeholders) || '';
    }
}
