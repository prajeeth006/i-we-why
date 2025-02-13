import { TestBed } from '@angular/core/testing';

import { DsButton, dsButtonProjectableNodes } from '@frontend/ui/button';
import { MockContext } from 'moxxi';

import { EmbeddableComponentsServiceMock } from '../../../features/clock/test/embeddable-components.mock';
import { LinkBehaviorComponent, MenuActionComponent } from '../../public_api';
import { ButtonBehaviorComponent } from '../../src/plain-link/button-behavior.component';
import { PlainLinkBootstrapService } from '../../src/plain-link/plain-link-bootstrap.service';

describe('PlainLinkBootstrapService', () => {
    let service: PlainLinkBootstrapService;
    let embeddableComponentsServiceMock: EmbeddableComponentsServiceMock;

    beforeEach(() => {
        embeddableComponentsServiceMock = MockContext.useMock(EmbeddableComponentsServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, PlainLinkBootstrapService],
        });

        service = TestBed.inject(PlainLinkBootstrapService);
    });

    it('should register dsbutton component', () => {
        service.onAppInit();

        expect(embeddableComponentsServiceMock.registerEmbeddableComponent).toHaveBeenCalledWith(DsButton, 5, {
            projectableNodesMapper: dsButtonProjectableNodes,
        });
        expect(embeddableComponentsServiceMock.registerEmbeddableComponent).toHaveBeenCalledWith(LinkBehaviorComponent, 8);
        expect(embeddableComponentsServiceMock.registerEmbeddableComponent).toHaveBeenCalledWith(MenuActionComponent, 10);
        expect(embeddableComponentsServiceMock.registerEmbeddableComponent).toHaveBeenCalledWith(ButtonBehaviorComponent, 12);
    });
});
