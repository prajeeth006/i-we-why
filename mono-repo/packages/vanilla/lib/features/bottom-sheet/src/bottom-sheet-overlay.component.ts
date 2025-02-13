import { ChangeDetectionStrategy, Component } from '@angular/core';

import { BottomSheetMenuComponent } from './bottom-sheet-menu.component';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [BottomSheetMenuComponent],
    selector: 'vn-bottom-sheet-overlay',
    templateUrl: 'bottom-sheet-overlay.html',
})
export class BottomSheetOverlayComponent {}
