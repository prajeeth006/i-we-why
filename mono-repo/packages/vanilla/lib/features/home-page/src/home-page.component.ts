import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ClientConfigProductName, ContentService } from '@frontend/vanilla/core';
import { PageMatrixComponent } from '@frontend/vanilla/features/content';
import { DslPipe } from '@frontend/vanilla/shared/browser';

@Component({
    standalone: true,
    imports: [CommonModule, DslPipe, PageMatrixComponent],
    selector: 'lh-home-page',
    templateUrl: 'home-page.html',
})
export class HomePageComponent implements OnInit {
    content: any;

    constructor(private contentService: ContentService) {}

    ngOnInit() {
        this.contentService
            .getJson('App-v1.0/PublicPages/HomePage', { product: ClientConfigProductName.SF, filterOnClient: true })
            .subscribe((data) => (this.content = data));
    }
}
