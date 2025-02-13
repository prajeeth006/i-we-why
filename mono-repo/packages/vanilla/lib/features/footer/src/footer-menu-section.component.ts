import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, signal } from '@angular/core';

import { MenuContentSection } from '@frontend/vanilla/core';

import { FooterMenuItemComponent } from './footer-menu-item.component';
import { ResponsiveFooterContent } from './footer.client-config';

@Component({
    standalone: true,
    imports: [CommonModule, FooterMenuItemComponent],
    selector: 'vn-footer-menu-section',
    templateUrl: 'footer-menu-section.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class]': 'footerClass()',
    },
})
export class FooterMenuSectionComponent implements OnInit {
    section = input.required<MenuContentSection>();

    config = inject(ResponsiveFooterContent);
    expanded = signal(true);
    sectionClass = computed(() => this.section().class);
    footerClass = computed(() =>
        [this.expanded() && this.config.expandableModeEnabled ? 'footer-nav-expanded' : '', 'footer-nav', this.sectionClass()]
            .filter((c) => c)
            .join(' '),
    );

    ngOnInit() {
        this.expanded.set(!this.config.expandableModeEnabled);
    }

    toggle() {
        if (this.config.expandableModeEnabled) {
            this.expanded.update((e) => !e);
        }
    }
}
