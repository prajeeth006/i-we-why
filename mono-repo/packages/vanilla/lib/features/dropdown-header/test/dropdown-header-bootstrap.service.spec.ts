import { ComponentFactoryResolver } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { DynamicLayoutServiceMock } from '../../../core/test/dynamic-layout/dynamic-layout.mock';
import { DropDownHeaderBootstrapService } from '../src/dropdown-header-bootstrap.service';
import { DropDownHeaderMenuComponent } from '../src/sub-components/dropdown-header-menu.component';
import { DropDownHeaderContentMock, DropDownHeaderServiceMock } from './dropdown-header.mocks';

describe('DropdownHeaderBootstrapService', () => {
    let service: DropDownHeaderBootstrapService;
    let dynamicLayoutServiceMock: DynamicLayoutServiceMock;
    let dropDownHeaderServiceMock: DropDownHeaderServiceMock;
    let dropDownHeaderContent: DropDownHeaderContentMock;

    beforeEach(() => {
        dynamicLayoutServiceMock = MockContext.useMock(DynamicLayoutServiceMock);
        dropDownHeaderContent = MockContext.useMock(DropDownHeaderContentMock);
        dropDownHeaderServiceMock = MockContext.useMock(DropDownHeaderServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DropDownHeaderBootstrapService, ComponentFactoryResolver],
        });

        service = TestBed.inject(DropDownHeaderBootstrapService);
    });

    describe('run()', () => {
        it('should add', fakeAsync(() => {
            service.onFeatureInit();
            dropDownHeaderContent.whenReady.next();
            tick();

            expect(dynamicLayoutServiceMock.addComponent).toHaveBeenCalled();
            expect(dropDownHeaderServiceMock.setDropDownHeaderComponent).toHaveBeenCalledWith('menu', DropDownHeaderMenuComponent);
        }));
    });
});
