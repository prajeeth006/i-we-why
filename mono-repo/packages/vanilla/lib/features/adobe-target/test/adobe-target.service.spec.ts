import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { ContentServiceMock } from '../../../core/test/content/content.mock';
import { LoggerMock } from '../../../core/test/languages/logger.mock';
import { AdobeTargetService } from '../src/adobe-target.service';
import { AdobeTargetBaseServiceMock } from './adobe-target.mock';

describe('AdobeTargetService', () => {
    let service: AdobeTargetService;
    let adobeTargetBaseServiceMock: AdobeTargetBaseServiceMock;
    let contentServiceMock: ContentServiceMock;
    let loggerMock: LoggerMock;

    beforeEach(() => {
        adobeTargetBaseServiceMock = MockContext.useMock(AdobeTargetBaseServiceMock);
        contentServiceMock = MockContext.useMock(ContentServiceMock);
        loggerMock = MockContext.useMock(LoggerMock);
        TestBed.configureTestingModule({
            providers: [MockContext.providers, AdobeTargetService],
        });
    });

    beforeEach(() => {
        service = TestBed.inject(AdobeTargetService);
    });

    describe('getOffer()', () => {
        it('should return content', () => {
            const spy = jasmine.createSpy();
            service.getOffer({ mbox: 'test' }).subscribe(spy);
            adobeTargetBaseServiceMock.getOffer.completeWith({ offer: [{ content: [{ path: 'path' }] }] });
            expect(contentServiceMock.getJsonFiltered).toHaveBeenCalledWith('path');

            contentServiceMock.getJsonFiltered.completeWith({ doc: 'bla' });
            expect(spy).toHaveBeenCalledWith({ doc: 'bla' });
        });

        it('should log error', () => {
            const spy = jasmine.createSpy();
            service.getOffer({ mbox: 'test' }).subscribe(spy);

            adobeTargetBaseServiceMock.getOffer.completeWith({ foo: 'bar' });
            expect(loggerMock.errorRemote).toHaveBeenCalledWith('Failed extracting path from adobe target response.', { foo: 'bar' });
            expect(contentServiceMock.getJsonFiltered).not.toHaveBeenCalled();
        });
    });
});
