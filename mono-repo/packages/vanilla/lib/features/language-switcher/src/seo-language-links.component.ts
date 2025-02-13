import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { trackByProp } from '@frontend/vanilla/core';
import { first } from 'rxjs/operators';

import { LanguageSwitcherItem } from './language-switcher.models';
import { LanguageSwitcherService } from './language-switcher.service';

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'vn-seo-language-links',
    templateUrl: 'seo-language-links.html',
})
export class SeoLanguageLinksComponent implements OnInit {
    languages: LanguageSwitcherItem[];
    readonly trackByNativeName = trackByProp<LanguageSwitcherItem>('nativeName');

    constructor(
        private languageSwitcherService: LanguageSwitcherService,
        private changeDetectorRef: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        this.languageSwitcherService
            .getLanguageSwitcherData()
            .pipe(first())
            .subscribe((languages: LanguageSwitcherItem[]) => {
                this.languages = languages;
                this.changeDetectorRef.detectChanges();
            });
    }
}
