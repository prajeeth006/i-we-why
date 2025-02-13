import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelSwitcherComponent, LabelSwitcherItem } from '@frontend/vanilla/features/label-switcher';
import { MockContext } from 'moxxi';
import { MockComponent } from 'ng-mocks';

import { HtmlNodeMock } from '../../../core/test/browser/html-node.mock';
import { IconCustomComponent } from '../../icons/src/icon-fast.component';
import { LabelSwitcherConfigMock, LabelSwitcherServiceMock, LabelSwitcherTrackingServiceMock } from './label-switcher.mock';

describe('LabelSwitcherComponent', () => {
    let fixture: ComponentFixture<LabelSwitcherComponent>;
    let component: LabelSwitcherComponent;
    let labelSwitcherServiceMock: LabelSwitcherServiceMock;
    let labelSwitcherTrackingServiceMock: LabelSwitcherTrackingServiceMock;
    let htmlNodeMock: HtmlNodeMock;
    let configMock: LabelSwitcherConfigMock;

    beforeEach(() => {
        labelSwitcherServiceMock = MockContext.useMock(LabelSwitcherServiceMock);
        labelSwitcherTrackingServiceMock = MockContext.useMock(LabelSwitcherTrackingServiceMock);
        htmlNodeMock = MockContext.useMock(HtmlNodeMock);
        configMock = MockContext.useMock(LabelSwitcherConfigMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
            schemas: [NO_ERRORS_SCHEMA],
        });

        TestBed.overrideComponent(LabelSwitcherComponent, {
            remove: {
                imports: [IconCustomComponent],
            },
            add: {
                imports: [MockComponent(IconCustomComponent)],
            },
        });

        labelSwitcherServiceMock.items = [{} as LabelSwitcherItem, {} as LabelSwitcherItem];
        configMock.resources = { messages: {} };
        fixture = TestBed.createComponent(LabelSwitcherComponent);
        component = fixture.componentInstance;
    });

    describe('onInit', () => {
        it('should add class to html node if items not empty', () => {
            fixture.detectChanges();

            expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith('label-switcher-shown', true);
        });
    });

    describe('toggle', () => {
        it('should toggle showLabels property', () => {
            expect(component.showLabels).toBeUndefined();

            component.toggle();

            expect(component.showLabels).toBeTrue();
            expect(labelSwitcherTrackingServiceMock.trackDropDown).toHaveBeenCalledWith('Click', 'Indiana', 'Footer State Switcher');

            component.toggle();

            expect(component.showLabels).toBeFalse();
        });
    });

    describe('showOverlay', () => {
        let item: LabelSwitcherItem;

        beforeEach(() => {
            item = {
                url: 'http://test.com',
                isActive: false,
                name: 'Betting',
                region: 'state',
                regionCode: 'IN',
                country: 'US',
                text: 'betting',
            };
        });

        it('should show overlay', () => {
            component.switchLabel(item);

            expect(labelSwitcherServiceMock.switchLabel).toHaveBeenCalledWith(item);
            expect(labelSwitcherTrackingServiceMock.trackDropDown).toHaveBeenCalledWith('Switch', 'Indiana, Indiana', 'betting', 'http://test.com');
        });

        it('should not show overlay because user clicked on active item', () => {
            item.isActive = true;
            component.switchLabel(item);

            expect(labelSwitcherServiceMock.switchLabel).not.toHaveBeenCalled();
        });
    });
});
