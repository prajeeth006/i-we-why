import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { ImageComponent } from '@frontend/vanilla/shared/image';

import { LanguageSwitcherConfig } from './language-switcher.client-config';
import { LanguageSwitcherItem } from './language-switcher.models';

@Component({
    standalone: true,
    selector: 'vn-language-item',
    templateUrl: 'language-item.html',
    host: {
        '[class.d-flex]': 'true',
    },
    imports: [CommonModule, ImageComponent, IconCustomComponent],
})
export class LanguageItemComponent implements OnInit {
    @Input() lang: LanguageSwitcherItem;
    @Input() displayRadioButton = true;

    version: number;
    useFastIcon: boolean = false;
    constructor(public config: LanguageSwitcherConfig) {}

    ngOnInit() {
        this.config.whenReady.subscribe(() => {
            this.version = this.config.version;
            this.useFastIcon = this.config.useFastIcons;
        });
    }
}
