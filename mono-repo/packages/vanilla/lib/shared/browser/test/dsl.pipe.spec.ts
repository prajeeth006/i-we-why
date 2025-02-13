import { DslPipe } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';

describe('Pipe: DslPipe', () => {
    let pipe: DslPipe;
    let dslServiceMock: DslServiceMock;

    beforeEach(() => {
        dslServiceMock = MockContext.createMock(DslServiceMock);

        pipe = new DslPipe(<any>dslServiceMock);
    });

    it('should trasnform content using content dsl service', () => {
        const content = [{ condition: 'a', text: 'b' }];
        const spy = jasmine.createSpy('spy');

        pipe.transform(content).subscribe(spy);

        expect(dslServiceMock.evaluateContent).toHaveBeenCalledWith(content);

        const newContent = [{ text: 'c' }];
        dslServiceMock.evaluateContent.next(newContent);

        expect(spy).toHaveBeenCalledWith(newContent);
    });
});
