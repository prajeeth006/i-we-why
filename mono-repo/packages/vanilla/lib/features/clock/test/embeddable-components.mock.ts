import { EmbeddableComponentsService } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';

@Mock({ of: EmbeddableComponentsService })
export class EmbeddableComponentsServiceMock {
    @Stub() registerEmbeddableComponent: jasmine.Spy;
    @Stub() createDynamicHtml: jasmine.Spy;
}
