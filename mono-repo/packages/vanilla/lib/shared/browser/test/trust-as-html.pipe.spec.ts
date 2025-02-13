import { TestBed } from '@angular/core/testing';

import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';

describe('Pipe: TrustAsHtmlPipe', () => {
    let pipe: TrustAsHtmlPipe;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TrustAsHtmlPipe],
        });

        pipe = TestBed.inject(TrustAsHtmlPipe);
    });

    it('should work with undefined', () => {
        const safeHtml = pipe.transform(undefined) as any;

        expect(safeHtml.changingThisBreaksApplicationSecurity).toEqual('');
    });

    it('should work with null', () => {
        const safeHtml = pipe.transform(null) as any;

        expect(safeHtml.changingThisBreaksApplicationSecurity).toEqual('');
    });

    it('should leave html intact', () => {
        const content = '<b>hello</b>';
        const safeHtml = pipe.transform(content) as any;

        expect(safeHtml).not.withContext('Expected SafeHtml instance').toBeNull();
        expect(safeHtml.changingThisBreaksApplicationSecurity).toEqual(content);
    });
});
