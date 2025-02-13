import { CommonModule } from '@angular/common';
import { Component, Input, TrackByFunction, Type, inject } from '@angular/core';

import { DynamicComponentDirective, MenuContentItem } from '@frontend/vanilla/core';

import { HeaderService } from '../header.service';

interface HeaderSectionItem {
    component$: Promise<Type<any> | null>;
    attr: { item: MenuContentItem };
    name: string;
}

@Component({
    standalone: true,
    imports: [CommonModule, DynamicComponentDirective],
    selector: 'vn-header-section',
    template: `
        @for (item of data; track trackByName($index, item)) {
            @if (item.component$ | async; as cmp) {
                <ng-container *vnDynamicComponent="cmp; attr: item.attr"></ng-container>
            }
        }
    `,
})
export class HeaderSectionComponent {
    private readonly headerService = inject(HeaderService);
    protected readonly trackByName: TrackByFunction<HeaderSectionItem> = (_, item) => item.name;

    data: Array<HeaderSectionItem> = [];

    @Input() set items(items: MenuContentItem[]) {
        this.data = items.map((item) => ({
            component$: this.headerService.getLazyComponent(item.type),
            attr: { item },
            name: item.name,
        }));
    }
}
