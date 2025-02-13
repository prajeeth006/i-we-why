import { CommonModule } from '@angular/common';
import { Component, Input, Type } from '@angular/core';

import { DynamicComponentDirective, MenuContentItem, trackByProp } from '@frontend/vanilla/core';
import { DslPipe } from '@frontend/vanilla/shared/browser';

import { LoginService } from '../../login.service';

@Component({
    standalone: true,
    imports: [CommonModule, DynamicComponentDirective, DslPipe],
    selector: 'vn-l-header-section',
    templateUrl: 'header-section.html',
})
export class HeaderSectionComponent {
    @Input() items: MenuContentItem[];
    readonly trackByText = trackByProp<MenuContentItem>('text');
    constructor(private loginService: LoginService) {}

    getItemComponent(type: string): Type<any> | null {
        return this.loginService.getLoginComponent(type);
    }
}
