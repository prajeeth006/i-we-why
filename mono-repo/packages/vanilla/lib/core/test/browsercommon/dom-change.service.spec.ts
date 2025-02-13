import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { DomChangeService } from '@frontend/vanilla/core';

describe('DomChangeService', () => {
    let service: DomChangeService;
    let parent: HTMLElement;
    let doc: Document;

    beforeEach(() => {
        service = new DomChangeService();
        doc = TestBed.inject(DOCUMENT);
        parent = doc.createElement('div');
    });

    it('should notify about changes in dom', () => {
        const e = doc.createElement('span');

        service.observe(parent).subscribe((m) => {
            expect(m.addedNodes).toContain(e);
        });

        parent.appendChild(e);
    });

    it('should disconnect when unsubscribed', () => {
        const e = doc.createElement('span');

        const s = service.observe(parent).subscribe(() => {
            fail();
        });

        s.unsubscribe();

        parent.appendChild(e);
    });
});
