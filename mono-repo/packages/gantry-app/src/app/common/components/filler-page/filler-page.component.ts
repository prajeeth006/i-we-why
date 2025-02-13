import { Component, Input, ViewEncapsulation } from '@angular/core';

import { Observable } from 'rxjs';

@Component({
    selector: 'gn-filler-page',
    templateUrl: './filler-page.component.html',
    styleUrls: ['./filler-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class FillerPageComponent {
    @Input() fillerPageMessage$: Observable<string>;
    @Input() pageName: string;

    constructor() {}
}
