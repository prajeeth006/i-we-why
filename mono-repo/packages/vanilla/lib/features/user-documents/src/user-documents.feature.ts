import { runOnFeatureInit } from '@frontend/vanilla/core';

import { UserDocumentsBootstrapService } from './user-documents-bootstrap.service';
import { UserDocumentsService } from './user-documents.service';

export function provide() {
    return [UserDocumentsService, runOnFeatureInit(UserDocumentsBootstrapService)];
}
