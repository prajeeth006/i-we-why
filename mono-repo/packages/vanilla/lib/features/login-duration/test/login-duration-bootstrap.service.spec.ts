import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { SlotName } from '@frontend/vanilla/core';
import { LoginDurationComponent } from '@frontend/vanilla/features/login-duration';
import { MockContext } from 'moxxi';

import { DynamicLayoutServiceMock } from '../../../core/test/dynamic-layout/dynamic-layout.mock';
import { EmbeddableComponentsServiceMock } from '../../clock/test/embeddable-components.mock';
import { LoginDurationBootstrapService } from '../src/login-duration-bootstrap.service';
import { CurrentSessionConfigMock } from './current-session.mock';
import { LoginDurationConfigMock } from './login-duration-config.mock';

describe('LoginDurationBootstrapService', () => {
    let service: LoginDurationBootstrapService;
    let dynamicLayoutServiceMock: DynamicLayoutServiceMock;
    let loginDurationConfigMock: LoginDurationConfigMock;
    let embeddableComponentsServiceMock: EmbeddableComponentsServiceMock;
    let currentSessionConfigMock: CurrentSessionConfigMock;

    beforeEach(() => {
        dynamicLayoutServiceMock = MockContext.useMock(DynamicLayoutServiceMock);
        loginDurationConfigMock = MockContext.useMock(LoginDurationConfigMock);
        embeddableComponentsServiceMock = MockContext.useMock(EmbeddableComponentsServiceMock);
        currentSessionConfigMock = MockContext.useMock(CurrentSessionConfigMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, LoginDurationBootstrapService],
        });

        loginDurationConfigMock.slotName = SlotName.HeaderTopItems;
        service = TestBed.inject(LoginDurationBootstrapService);
    });

    describe('onFeatureInit()', () => {
        it('should add component to slot', fakeAsync(() => {
            service.onFeatureInit();
            loginDurationConfigMock.whenReady.next();
            currentSessionConfigMock.whenReady.next();
            tick();

            expect(embeddableComponentsServiceMock.registerEmbeddableComponent).toHaveBeenCalledWith(LoginDurationComponent, 100);
            expect(dynamicLayoutServiceMock.addComponent).toHaveBeenCalledWith(SlotName.HeaderTopItems, LoginDurationComponent, null);
        }));
    });
});
