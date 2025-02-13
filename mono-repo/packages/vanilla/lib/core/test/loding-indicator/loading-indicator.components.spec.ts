import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoadingIndicatorComponent } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DomSanitizerMock } from '../../../features/account-menu/test/dom-change.mock';
import { CommonMessagesMock } from '../../src/client-config/test/common-messages.mock';
import { PageMock } from '../browsercommon/page.mock';
import { LoadingIndicatorServiceMock } from '../http/loading-indicator.mock';

describe('LoadingIndicatorComponent', () => {
    let fixture: ComponentFixture<LoadingIndicatorComponent>;
    let loadingIndicatorServiceMock: LoadingIndicatorServiceMock;
    let domSanitizerMock: DomSanitizerMock;
    let pageMock: PageMock;

    beforeEach(waitForAsync(() => {
        loadingIndicatorServiceMock = MockContext.useMock(LoadingIndicatorServiceMock);
        domSanitizerMock = MockContext.useMock(DomSanitizerMock);
        pageMock = MockContext.useMock(PageMock);
        MockContext.useMock(CommonMessagesMock);
        TestBed.overrideComponent(LoadingIndicatorComponent, {
            set: {
                imports: [CommonModule],
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(LoadingIndicatorComponent);
        fixture.detectChanges();
    }));

    it('should initialize content', () => {
        expect(loadingIndicatorServiceMock.visible).toHaveBeenCalled();
        expect(domSanitizerMock.bypassSecurityTrustHtml).toHaveBeenCalledOnceWith(pageMock.loadingIndicator.spinnerContent);
    });
});
