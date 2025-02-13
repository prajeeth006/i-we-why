import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener } from '@angular/core';

import { MenuItemComponent } from '@frontend/vanilla/features/menus';
import { DslPipe } from '@frontend/vanilla/shared/browser';

import { HeaderItemBase } from '../header-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, DslPipe, MenuItemComponent],
    selector: 'vn-h-dropdown',
    templateUrl: 'dropdown.html',
})
export class DropdownComponent extends HeaderItemBase {
    @HostListener('document:click', ['$event'])
    clickOutside(event: Event) {
        this.clickOrTouchOutside(event);
    }
    @HostListener('document:touchstart', ['$event'])
    touchOutside(event: Event) {
        this.clickOrTouchOutside(event);
    }

    showChildren: boolean = false;
    constructor(private elementRef: ElementRef) {
        super();
    }

    toggle() {
        this.showChildren = !this.showChildren;
    }
    private clickOrTouchOutside(event: Event) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            if (this.showChildren) this.toggle();
        }
    }
}
