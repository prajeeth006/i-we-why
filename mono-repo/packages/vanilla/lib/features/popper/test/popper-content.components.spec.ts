import { CUSTOM_ELEMENTS_SCHEMA, Component, DebugElement, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MockContext } from 'moxxi';
import { MockComponent } from 'ng-mocks';
import { NgxFloatUiContentComponent } from 'ngx-float-ui';

import { CommonMessagesMock } from '../../../core/src/client-config/test/common-messages.mock';
import { IconCustomComponent } from '../../icons/src/icon-fast.component';
import { PopperContentComponent } from '../src/popper-content.component';

@Component({
    standalone: true,
    imports: [PopperContentComponent],
    template:
        '<vn-popper-content [closeLinkText]="closeText" [closeType]="closeType" (onCloseLinkClick)="onCloseSpy()"><ng-container content><p>{{text}}</p></ng-container></vn-popper-content>',
})
export class TestHostComponent {
    text: string;
    closeType: 'button' | 'link' | 'none' = 'link';
    closeText: string;
    onCloseSpy = jasmine.createSpy();

    @ViewChild(PopperContentComponent) component: PopperContentComponent;
}

describe('PopperContentComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let commonMessagesMock: CommonMessagesMock;

    beforeEach(() => {
        commonMessagesMock = MockContext.useMock(CommonMessagesMock);

        TestBed.overrideComponent(TestHostComponent, {
            set: {
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
            },
        });

        TestBed.overrideComponent(PopperContentComponent, {
            remove: {
                imports: [IconCustomComponent],
            },
            add: {
                imports: [MockComponent(IconCustomComponent)],
            },
        });

        commonMessagesMock.PopoverCloseText = 'GOT IT';
    });

    function initComponent() {
        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();

        const popperEl = getPopper();

        fixture.componentInstance.component.content = popperEl && popperEl.componentInstance;
    }

    function getPopper(): DebugElement {
        return fixture.debugElement.query(By.directive(PopperContentComponent)).query(By.directive(NgxFloatUiContentComponent));
    }

    it('should render popper content', () => {
        initComponent();

        fixture.componentInstance.text = 'Pop';
        fixture.detectChanges();

        const popperEl = getPopper();

        expect(popperEl.nativeElement.querySelector('p')).toHaveText('Pop');
        expect(popperEl.nativeElement.querySelector('.popper-close-link')).toHaveText('GOT IT');
    });

    it('should show close ex if specified', () => {
        initComponent();

        fixture.componentInstance.closeType = 'button';
        fixture.detectChanges();

        const popperEl = getPopper();

        expect(popperEl.nativeElement.querySelector('.popper-close-link')).toBeNull();
        expect(popperEl.nativeElement.querySelector('vn-icon[ng-reflect-name="theme-ex"]')).not.toBeNull();
    });

    it('should override close link text', () => {
        initComponent();

        fixture.componentInstance.closeText = 'special';
        fixture.detectChanges();

        const popperEl = getPopper();

        expect(popperEl.nativeElement.querySelector('.popper-close-link')).toHaveText('special');
    });

    it('should close popover and fire an event when close link is clicked', () => {
        initComponent();

        const popperEl = getPopper();
        const closeLink: HTMLElement = popperEl.nativeElement.querySelector('.popper-close-link');

        spyOn(popperEl.componentInstance, 'hide');
        closeLink.dispatchEvent(new Event('click'));

        expect(popperEl.componentInstance.hide).toHaveBeenCalled();
        expect(fixture.componentInstance.onCloseSpy).toHaveBeenCalled();
    });
});
