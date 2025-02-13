import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossProductLayoutComponent } from '@frontend/vanilla/features/cross-product-layout';
import { MockContext } from 'moxxi';

import { HtmlNodeMock } from '../../../core/test/browser/html-node.mock';
import { MediaQueryServiceMock } from '../../../core/test/browser/media-query.service.mock';
import { OverlayServiceMock } from '../../overlay/test/overlay.mock';

describe('CrossProductLayoutComponent', () => {
    let fixture: ComponentFixture<CrossProductLayoutComponent>;
    let htmlNodeMock: HtmlNodeMock;
    beforeEach(() => {
        MockContext.useMock(OverlayServiceMock);
        htmlNodeMock = MockContext.useMock(HtmlNodeMock);
        MockContext.useMock(MediaQueryServiceMock);

        TestBed.overrideComponent(CrossProductLayoutComponent, {
            set: {
                schemas: [NO_ERRORS_SCHEMA],
                providers: [MockContext.providers],
                imports: [],
            },
        });
    });

    it('should set standalone class', () => {
        initComponent();
        expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith('standalone', true);

        fixture.destroy();

        expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith('standalone', false);
    });

    function initComponent() {
        fixture = TestBed.createComponent(CrossProductLayoutComponent);
        fixture.detectChanges();
    }
});
