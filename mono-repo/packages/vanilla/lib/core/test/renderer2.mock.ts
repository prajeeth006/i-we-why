import { Renderer2 } from '@angular/core';

import { Mock, Stub } from 'moxxi';

@Mock({ of: Renderer2 })
export class Renderer2Mock {
    @Stub() createElement: jasmine.Spy;
    @Stub() createViewRoot: jasmine.Spy;
    @Stub() createText: jasmine.Spy;
    @Stub() setElementProperty: jasmine.Spy;
    @Stub() setElementAttribute: jasmine.Spy;
    @Stub() setText: jasmine.Spy;
    @Stub() setBindingDebugInfo: jasmine.Spy;
    @Stub() createTemplateAnchor: jasmine.Spy;
    @Stub() projectNodes: jasmine.Spy;
    @Stub() attachViewAfter: jasmine.Spy;
    @Stub() detachView: jasmine.Spy;
    @Stub() destroyView: jasmine.Spy;
    @Stub() listen: jasmine.Spy;
    @Stub() listenGlobal: jasmine.Spy;
    @Stub() setElementClass: jasmine.Spy;
    @Stub() setElementStyle: jasmine.Spy;
    @Stub() invokeElementMethod: jasmine.Spy;
    @Stub() animate: jasmine.Spy;
}
