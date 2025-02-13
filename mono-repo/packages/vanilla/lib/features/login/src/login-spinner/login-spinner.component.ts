import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { DsLoadingSpinner } from '@frontend/ui/loading-spinner';

import { LoginContentService } from '../login-content.service';
import { LoginSpinnerService } from './login-spinner.service';

/**
 * @stable
 */
@Component({
    standalone: true,
    imports: [CommonModule, DsLoadingSpinner],
    selector: 'vn-login-spinner',
    templateUrl: 'login-spinner.html',
    styleUrls: ['../../../../../../themepark/themes/whitelabel/components/login-spinner/styles.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginSpinnerComponent {
    loginContentService = inject(LoginContentService);
    loginSpinnerService = inject(LoginSpinnerService);
}
