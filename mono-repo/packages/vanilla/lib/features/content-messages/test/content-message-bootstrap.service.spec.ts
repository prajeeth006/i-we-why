import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { EmbeddableComponentsServiceMock } from '../../clock/test/embeddable-components.mock';
import { CloseMessageComponent } from '../src/close-message.component';
import { ContentMessagesBootstrapService } from '../src/content-messages-bootstrap.service';

describe('ContentMessagesBootstrapService', () => {
    let service: ContentMessagesBootstrapService;
    let embeddableComponentsServiceMock: EmbeddableComponentsServiceMock;

    beforeEach(() => {
        embeddableComponentsServiceMock = MockContext.useMock(EmbeddableComponentsServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, ContentMessagesBootstrapService],
        });

        service = TestBed.inject(ContentMessagesBootstrapService);
    });

    describe('run()', () => {
        it('should setup embeddable components', () => {
            service.onFeatureInit();

            expect(embeddableComponentsServiceMock.registerEmbeddableComponent).toHaveBeenCalledWith(CloseMessageComponent, 100);
        });
    });
});
