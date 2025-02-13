import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { DsDivider } from '@frontend/ui/divider';
import { DynamicHtmlDirective } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { SkeletonComponent, SkeletonType } from '@frontend/vanilla/features/skeleton';
import { ImageComponent } from '@frontend/vanilla/shared/image';

import { AccountMenuItemBase } from '../../account-menu-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, DynamicHtmlDirective, SkeletonComponent, ImageComponent, ImageComponent, IconCustomComponent, DsDivider],
    selector: 'vn-am-widget',
    templateUrl: 'widget.html',
})
export class AccountMenuWidgetComponent extends AccountMenuItemBase {
    @Input() hideSkeleton: boolean = false;
    @Input() footerContent: string;

    SkeletonType = SkeletonType;

    constructor() {
        super();
    }
}
