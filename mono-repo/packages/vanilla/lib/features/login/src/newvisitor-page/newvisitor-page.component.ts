import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, Type, ViewEncapsulation } from '@angular/core';

import { DynamicComponentDirective, HtmlNode, MenuContentItem, trackByProp } from '@frontend/vanilla/core';
import { PageMatrixDirective } from '@frontend/vanilla/features/content';
import { DslPipe } from '@frontend/vanilla/shared/browser';
import { firstValueFrom } from 'rxjs';

import { LoginContent, NewVisitorContent } from '../login-content.client-config';
import { LoginService } from '../login.service';

@Component({
    standalone: true,
    imports: [CommonModule, DynamicComponentDirective, DslPipe, PageMatrixDirective],
    selector: 'vn-newvisitor-page',
    templateUrl: 'newvisitor-page.component.html',
    styleUrls: ['../../../../../../themepark/themes/whitelabel/components/newvisitor-page/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class NewVisitorPageComponent implements OnInit, OnDestroy {
    readonly trackByText = trackByProp<MenuContentItem>('text');
    content: NewVisitorContent;

    constructor(
        public loginContent: LoginContent,
        private loginService: LoginService,
        private htmlNode: HtmlNode,
    ) {}

    async ngOnInit() {
        await firstValueFrom(this.loginContent.whenReady);

        this.content = this.loginContent.newVisitor;
        this.htmlNode.setCssClass('cdk-global-scrollblock', true);
    }

    ngOnDestroy() {
        this.htmlNode.setCssClass('cdk-global-scrollblock', false);
    }

    getItemComponent(type: string): Type<any> | null {
        return this.loginService.getNewVisitorComponent(type);
    }
}
