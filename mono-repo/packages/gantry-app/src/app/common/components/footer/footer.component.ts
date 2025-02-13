import { Component, Input } from '@angular/core';

@Component({
    selector: 'gn-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
    @Input() leftSideText: string;
    @Input() rightSideText: string | null;
    @Input() centerSideText: string | null;

    constructor() {}
}
