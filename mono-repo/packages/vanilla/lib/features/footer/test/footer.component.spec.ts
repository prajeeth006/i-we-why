import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MenuContentItem, SlotName, SlotType } from '@frontend/vanilla/core';
import { FooterComponent } from '@frontend/vanilla/features/footer';
import { DslPipe } from '@frontend/vanilla/shared/browser';
import { MockContext } from 'moxxi';
import { Subject } from 'rxjs';

import { HtmlNodeMock } from '../../../core/test/browser/html-node.mock';
import { LanguageInfoMock, PageMock } from '../../../core/test/browsercommon/page.mock';
import { HttpClientMock } from '../../../core/test/client-config/http-client.mock';
import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { DynamicLayoutServiceMock } from '../../../core/test/dynamic-layout/dynamic-layout.mock';
import { ResponsiveFooterContentMock } from './responsive-footer.mocks';

describe('FooterComponent', () => {
    let fixture: ComponentFixture<FooterComponent>;
    let component: FooterComponent;
    let page: PageMock;
    let dslServiceMock: DslServiceMock;
    let showLangDslSubject: Subject<boolean>;
    let htmlNodeMock: HtmlNodeMock;
    let dynamicLayoutServiceMock: DynamicLayoutServiceMock;
    let responsiveFooterContentMock: ResponsiveFooterContentMock;

    beforeEach(() => {
        htmlNodeMock = MockContext.useMock(HtmlNodeMock);
        page = MockContext.useMock(PageMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);
        dynamicLayoutServiceMock = MockContext.useMock(DynamicLayoutServiceMock);
        MockContext.useMock(HttpClientMock);
        responsiveFooterContentMock = MockContext.useMock(ResponsiveFooterContentMock);

        showLangDslSubject = new Subject<boolean>();
        dslServiceMock.evaluateExpression.withArgs('showLangDsl').and.returnValue(showLangDslSubject);
        dynamicLayoutServiceMock.getSlot.and.returnValue({
            display: () => {},
        });

        TestBed.overrideComponent(FooterComponent, {
            set: {
                imports: [CommonModule, DslPipe],
                schemas: [NO_ERRORS_SCHEMA],
                providers: [MockContext.providers],
            },
        });

        fixture = TestBed.createComponent(FooterComponent);
        component = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
        it('should show language switcher for multiple languages', fakeAsync(() => {
            fixture.detectChanges();
            responsiveFooterContentMock.whenReady.next();
            tick();

            expect(dynamicLayoutServiceMock.getSlot).toHaveBeenCalledOnceWith(SlotName.Footer, SlotType.Single);
            expect(component.showResponsiveLanguageSwitcher).toEqual(true);
            expect(dslServiceMock.evaluateExpression).toHaveBeenCalledWith('showLangDsl');
        }));

        it('should not show language switcher if only one language', fakeAsync(() => {
            page.uiLanguages = [new LanguageInfoMock('en', 'english')];
            fixture.detectChanges();
            responsiveFooterContentMock.whenReady.next();
            tick();

            expect(component.showResponsiveLanguageSwitcher).toEqual(false);
            expect(dslServiceMock.evaluateExpression).not.toHaveBeenCalled();
            expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith('footer_items-help-contact-shown', true);
        }));

        it('should toggle language switcher based on DSL condition', fakeAsync(() => {
            fixture.detectChanges();
            responsiveFooterContentMock.whenReady.next();
            tick();
            showLangDslSubject.next(true);

            expect(component.showResponsiveLanguageSwitcher).toEqual(true);
            expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith('language-switcher-shown', true);
            expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith('footer_items-help-contact-shown', false);

            showLangDslSubject.next(false);

            expect(component.showResponsiveLanguageSwitcher).toEqual(false);
            expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith('language-switcher-shown', false);
            expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith('footer_items-help-contact-shown', true);
        }));

        it('should set item', fakeAsync(() => {
            fixture.detectChanges();
            responsiveFooterContentMock.whenReady.next();
            tick();
            dslServiceMock.evaluateContent.next({
                name: 'helpbutton',
            });

            expect(fixture.componentInstance.helpButton).toEqual({
                name: 'helpbutton',
            } as MenuContentItem);
        }));
    });
});
