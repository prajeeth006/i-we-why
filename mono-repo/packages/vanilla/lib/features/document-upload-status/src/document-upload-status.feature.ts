import { registerLazyDslOnModuleInit } from '@frontend/vanilla/core';

import { DocumentUploadStatusDslValuesProvider } from './document-upload-status-dsl-values-provider';

export function provide() {
    return [registerLazyDslOnModuleInit(DocumentUploadStatusDslValuesProvider)];
}
