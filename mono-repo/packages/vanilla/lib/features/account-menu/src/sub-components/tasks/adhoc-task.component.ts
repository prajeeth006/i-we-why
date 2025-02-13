import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { DynamicHtmlDirective } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';

import { AccountMenuTaskBaseComponent } from './task-base.component';

@Component({
    standalone: true,
    imports: [CommonModule, DynamicHtmlDirective, TrustAsHtmlPipe, IconCustomComponent],
    selector: 'vn-am-adhoc-task',
    templateUrl: 'task.html',
})
export class AdhocTaskComponent extends AccountMenuTaskBaseComponent implements OnInit {
    constructor() {
        super();
    }

    ngOnInit(): void {
        if (!this.item?.layout) {
            this.item.layout = 'adhoc';
        }
    }
}
