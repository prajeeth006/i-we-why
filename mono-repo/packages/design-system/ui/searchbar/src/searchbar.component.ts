import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChild, TemplateRef, ViewEncapsulation, booleanAttribute, computed, input } from '@angular/core';

import { DsSearchInput } from './ds-searchbar-directive';

export const DS_SEARCH_SIZES_ARRAY = ['small', 'large'] as const;
export type DsSearchBarSizes = (typeof DS_SEARCH_SIZES_ARRAY)[number];

@Component({
    standalone: true,
    selector: 'ds-search-bar',
    templateUrl: './searchbar.component.html',
    styleUrls: ['./searchbar.component.scss'],
    host: {
        '[class.ds-search-bar-disabled]': 'disabled()',
        '[class.ds-search-bar-inverse]': 'inverse()',
        '[class]': 'hostClass()',
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgTemplateOutlet, DsSearchInput],
})
export class DsSearchBar {
    @ContentChild(DsSearchInput, { static: true }) searchInput!: DsSearchInput;
    @ContentChild('searchIcon') searchIcon?: TemplateRef<any>;
    @ContentChild('closeIcon') closeIcon?: TemplateRef<any>;

    size = input<DsSearchBarSizes>('large');
    placeholder = input('search');
    disabled = input(false, { transform: booleanAttribute });
    inverse = input(false, { transform: booleanAttribute });
    clearIconTabIndex = 0;

    hostClass = computed(() => `ds-search-bar-${this.size()}`);

    clearIconMouseDownEventHandler() {
        if (this.searchInput) {
            const form = this.searchInput.getForm();
            this.clearIconTabIndex = -1;
            if (form) {
                form.setValue('');
            } else if (this.searchInput.elementRef?.nativeElement) {
                this.searchInput.elementRef.nativeElement.value = '';
            }
        }
    }

    clearIconMouseUpEventHandler() {
        this.clearIconTabIndex = 0;
    }
}
