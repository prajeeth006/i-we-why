import { Component } from '@angular/core';

import { PageMatrixComponent } from '@frontend/vanilla/features/content';

@Component({
    standalone: true,
    imports: [PageMatrixComponent],
    selector: 'vn-server-error',
    template: `<vn-page-matrix path="App-v1.0/partials/internalservererror" />`,
})
export class ServerErrorComponent {}
