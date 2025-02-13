import { TestBed } from '@angular/core/testing';

import { UtilsService } from '@frontend/vanilla/core';
import { FormatPipe } from '@frontend/vanilla/shared/browser';
import { MockContext } from 'moxxi';

import { MessageQueueServiceMock } from '../../../core/test/messages/message-queue.mock';

describe('Pipe: FormatPipe', () => {
    let pipe: FormatPipe;

    beforeEach(() => {
        MockContext.useMock(MessageQueueServiceMock);

        TestBed.configureTestingModule({
            providers: [FormatPipe, UtilsService, MockContext.providers],
        });

        pipe = TestBed.inject(FormatPipe);
    });

    it('should expand one placeholder in a string', () => {
        const result = pipe.transform('hello {0}!', 'world');

        expect(result).toEqual('hello world!');
    });

    it('should expand placeholders in a string, ignoring order', () => {
        const result = pipe.transform('hello {2}, {0}, {1}!', 'zero', 'one', 'two');
        expect(result).toEqual('hello two, zero, one!');
    });
});
