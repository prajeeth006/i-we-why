import { importProvidersFrom } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

import { runOnFeatureInit } from '@frontend/vanilla/core';

import { LoginBootstrapService } from './login-bootstrap.service';
import { LoginDialogService } from './login-dialog/login-dialog.service';

export function provide() {
    return [LoginDialogService, importProvidersFrom(MatDialogModule), runOnFeatureInit(LoginBootstrapService)];
}
