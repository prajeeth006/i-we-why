import { Directive, Input } from '@angular/core';

import { ContentItem, ExpandableMenuItem, trackByProp } from '@frontend/vanilla/core';

/**
 * Base class for page matrix template components
 *
 * @stable
 */
@Directive()
export abstract class PCComponent<T = any> {
    @Input() item: T;

    readonly trackByName = trackByProp<ContentItem>('name');
    readonly trackByText = trackByProp<ExpandableMenuItem>('text');

    protected createClass(componentClass: string): string {
        let itemClass = `pc-component ${componentClass}`;
        const additionalClass = (<any>this.item)?.class;

        if (additionalClass) {
            itemClass += ` ${additionalClass}`;
        }

        return itemClass;
    }
}
