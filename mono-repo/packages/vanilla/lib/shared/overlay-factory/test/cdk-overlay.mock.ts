import { Overlay, OverlayRef } from '@angular/cdk/overlay';

import { Mock, Stub, StubObservable } from 'moxxi';

@Mock({ of: Overlay })
export class OverlayMock {
    scrollStrategies = new MockScrollStrategies();
    @Stub() create: jasmine.Spy;
    @Stub() position: jasmine.Spy;

    constructor() {
        this.position.and.callFake(() => new MockPositionStrategies());
    }
}

export class MockScrollStrategies {
    @Stub() block: jasmine.Spy;
    @Stub() noop: jasmine.Spy;

    constructor() {
        this.block.and.returnValue('block');
        this.noop.and.returnValue('noop');
    }
}

export class MockPositionStrategies {
    position: string = '';
    positions: any[];
    push: boolean;
    flexDimensions: boolean;
    anchor: any;

    global() {
        this.position += 'g';
        return this;
    }

    flexibleConnectedTo(anchor: any) {
        this.position += 'f';
        this.anchor = anchor;
        return this;
    }

    withPositions(positions: any[]) {
        this.positions = positions;
        return this;
    }

    withFlexibleDimensions(flex: boolean) {
        this.flexDimensions = flex;
        return this;
    }

    withPush(push: boolean) {
        this.push = push;
        return this;
    }

    bottom() {
        this.position += 'b';
        return this;
    }

    top() {
        this.position += 't';
        return this;
    }

    right() {
        this.position += 'r';
        return this;
    }

    centerHorizontally() {
        this.position += 'ch';
        return this;
    }

    centerVertically() {
        this.position += 'cv';
        return this;
    }
}

@Mock({ of: OverlayRef })
export class OverlayRefMock {
    @StubObservable() backdropClick: jasmine.ObservableSpy;
    @StubObservable() detachments: jasmine.ObservableSpy;
    @StubObservable() attachments: jasmine.ObservableSpy;
    @Stub() attach: jasmine.Spy;
    @Stub() detach: jasmine.Spy;
    @Stub() detachBackdrop: jasmine.Spy;
    @Stub() dispose: jasmine.Spy;
    @Stub() getConfig: jasmine.Spy;
    @Stub() updatePositionStrategy: jasmine.Spy;
}
