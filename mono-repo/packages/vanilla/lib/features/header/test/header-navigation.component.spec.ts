import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuContentItem } from '@frontend/vanilla/core';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { MockContext } from 'moxxi';

import { MockDslPipe2 } from '../../../core/test/browser/dsl.pipe.mock';
import { ElementRefMock, HtmlElementMock } from '../../../core/test/element-ref.mock';
import { MenuActionsServiceMock } from '../../../core/test/menu-actions/menu-actions.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { BadgeConfigMock } from '../../../shared/badge/test/badge-config.mock';
import { ProductNavigationComponent } from '../src/product-navigation/product-navigation.component';
import { HeaderConfigMock, HeaderServiceMock } from './header.mock';

describe('ProductNavigationComponent', () => {
    let fixture: ComponentFixture<ProductNavigationComponent>;
    let headerServiceMock: HeaderServiceMock;
    let elementRefMock: ElementRefMock;
    let htmlElementMock: HtmlElementMock;

    beforeEach(() => {
        headerServiceMock = MockContext.useMock(HeaderServiceMock);
        elementRefMock = MockContext.useMock(ElementRefMock);
        MockContext.useMock(HeaderConfigMock);
        MockContext.useMock(MenuActionsServiceMock);
        MockContext.useMock(UserServiceMock);
        MockContext.useMock(BadgeConfigMock);

        TestBed.overrideComponent(ProductNavigationComponent, {
            set: {
                providers: [MockContext.providers],
                imports: [CommonModule, TrustAsHtmlPipe, MockDslPipe2],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(ProductNavigationComponent);
        (fixture.componentInstance as any).elementRef = elementRefMock; // Force mock DI

        fixture.detectChanges();
    });

    describe('ngOnInit', () => {
        it('should scroll into view', () => {
            htmlElementMock = new HtmlElementMock();
            elementRefMock.nativeElement.querySelector.withArgs('.active').and.returnValue(htmlElementMock);
            headerServiceMock.highlightedProduct.next({ name: 'testweb' } as MenuContentItem);

            expect(htmlElementMock.scrollIntoView).toHaveBeenCalled();
        });
    });
});
