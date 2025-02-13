import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, Type } from '@angular/core';

import { DynamicComponentDirective, HtmlNode, MenuContentItem, trackByProp } from '@frontend/vanilla/core';
import { DslPipe } from '@frontend/vanilla/shared/browser';
import { ImageComponent } from '@frontend/vanilla/shared/image';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LoginConfig } from '../login.client-config';
import { LoginService } from '../login.service';

@Component({
    standalone: true,
    imports: [CommonModule, DynamicComponentDirective, DslPipe, ImageComponent],
    selector: 'vn-new-visitor-page',
    templateUrl: 'new-visitor-page.component.html',
})
export class NewVisitorPageComponent implements OnInit, OnDestroy {
    readonly trackByText = trackByProp<MenuContentItem>('text');
    get newVisitorContent(): Observable<MenuContentItem> {
        return this.loginConfig.whenReady.pipe(map(() => this.loginConfig.newVisitor));
    }

    constructor(
        private loginService: LoginService,
        private loginConfig: LoginConfig,
        private htmlNode: HtmlNode,
    ) {}

    ngOnInit() {
        this.htmlNode.setCssClass('cdk-global-scrollblock', true);
    }

    ngOnDestroy() {
        this.htmlNode.setCssClass('cdk-global-scrollblock', false);
    }

    getItemComponent(type: string): Type<any> | null {
        return this.loginService.getNewVisitorComponent(type);
    }

    getButtons(items: MenuContentItem[]): MenuContentItem | undefined {
        return items.find((i) => i.name === 'buttons');
    }

    getBottomItems(items: MenuContentItem[]): MenuContentItem | undefined {
        return items.find((i) => i.name === 'bottomitems');
    }
}
