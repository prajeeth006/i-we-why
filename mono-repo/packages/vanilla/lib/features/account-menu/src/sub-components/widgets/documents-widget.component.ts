import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { UserDocumentsComponent, UserDocumentsService } from '@frontend/vanilla/features/user-documents';

import { AccountMenuItemBase } from '../../account-menu-item-base';
import { AccountMenuWidgetComponent } from './widget.component';

@Component({
    standalone: true,
    imports: [CommonModule, AccountMenuWidgetComponent, UserDocumentsComponent],
    selector: 'vn-am-documents-widget',
    templateUrl: 'documents-widget.html',
})
export class DocumentsWidgetComponent extends AccountMenuItemBase implements OnInit {
    constructor(public userDocumentsService: UserDocumentsService) {
        super();
    }

    ngOnInit() {
        this.userDocumentsService.refresh();
    }
}
