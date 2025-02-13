import { LowerCaseUrlSerializer } from '@frontend/vanilla/core';

describe('LowerCaseUrlSerializer', () => {
    const serializer = new LowerCaseUrlSerializer();

    it('should lowercase url segments', () => {
        const mixedCaseUrl = '/PATH/To/1/X';

        const tree = serializer.parse(mixedCaseUrl);
        const normalizedUrl = '/' + tree.root.children['primary']?.segments.map((s) => s.path).join('/');

        expect(normalizedUrl).toEqual(mixedCaseUrl.toLowerCase());
    });

    it('should keep casing of queryparams intact', () => {
        const tree = serializer.parse('/PATH/To/1/X?a=qWEr123&B=tZUi');

        expect(tree.queryParams).toEqual({
            a: 'qWEr123',
            B: 'tZUi',
        });
    });
});
