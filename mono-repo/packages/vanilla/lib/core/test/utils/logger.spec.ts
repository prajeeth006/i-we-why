import { Logger } from '@frontend/vanilla/core';

import { PageMock } from '../browsercommon/page.mock';

describe('Logger', () => {
    let logger: Logger;

    beforeEach(() => {
        logger = new Logger(new PageMock());
    });

    describe('sanitize log message', () => {
        it('should remove password from message', () => {
            const sanitizesMessage = logger.sanitizeMessage('This is test user with, password:abc');
            expect(sanitizesMessage).toContain('This is test user with, ');
        });

        it('should remove password from object', () => {
            const sanitizesMessage = logger.sanitizeMessage('{user: "testuser", password:"abc", city:"abc"}');
            expect(sanitizesMessage).toEqual('{user: "testuser",  city:"abc"}');
        });
        it('should remove password from object if password at end', () => {
            const sanitizesMessage = logger.sanitizeMessage('{user: "testuser", password:"abc"}');
            expect(sanitizesMessage).toEqual('{user: "testuser", }');
        });

        it('should remove password from object if password at start', () => {
            const sanitizesMessage = logger.sanitizeMessage('{password:"abc", user: "testuser", city:"abc"}');
            expect(sanitizesMessage).toEqual('{ user: "testuser", city:"abc"}');
        });
    });
});
