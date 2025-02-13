import { importProvidersFrom } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

import { runOnFeatureInit } from '@frontend/vanilla/core';

import { DialogBootstrapService } from './dialog-bootstrap.service';

export function provide() {
    return [importProvidersFrom(MatDialogModule), runOnFeatureInit(DialogBootstrapService)];
}
