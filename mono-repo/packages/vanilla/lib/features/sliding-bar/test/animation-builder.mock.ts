import { AnimationBuilder } from '@angular/animations';

import { Mock, Stub } from 'moxxi';

@Mock({ of: AnimationBuilder })
export class AnimationBuilderMock {
    @Stub() build: jasmine.Spy;
}
