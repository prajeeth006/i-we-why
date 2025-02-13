import { CommonModule } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DynamicHtmlDirective, PageMatrixService, WINDOW } from '@frontend/vanilla/core';
import { PCComponentHeaderV2Component, PageMatrixComponent, PageMatrixDirective, ProfilesDirective } from '@frontend/vanilla/features/content';
import { AuthstateDirective } from '@frontend/vanilla/shared/auth';
import { HtmlAttrsDirective, TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { MockContext } from 'moxxi';
import { MockComponent } from 'ng-mocks';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { TopLevelCookiesConfigMock } from '../../../core/test/browser/cookie.mock';
import { DeviceServiceMock } from '../../../core/test/browser/device.mock';
import { HtmlNodeMock } from '../../../core/test/browser/html-node.mock';
import { PageMock } from '../../../core/test/browsercommon/page.mock';
import { ContentServiceMock } from '../../../core/test/content/content.mock';
import { LoggerMock } from '../../../core/test/languages/logger.mock';
import { MenuActionsServiceMock } from '../../../core/test/menu-actions/menu-actions.mock';
import { NavigationServiceMock, ParsedUrlMock } from '../../../core/test/navigation/navigation.mock';
import { UrlServiceMock } from '../../../core/test/navigation/url.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import * as pc2 from '../../../features/content/src/components-v2/pc.components';
import { TooltipsConfigMock } from '../../../shared/tooltips/test/tooltips-content.mock';
import { setupComponentFactoryResolver } from '../../../test/test-utils';
import { MenuItemsServiceMock } from '../../account-menu/test/menu-items.mock';
import { CookieConsentTrackingServiceMock } from '../../cookie-consent/test/cookie-consent-tracking.mock';
import { IconCustomComponent } from '../../icons/src/icon-fast.component';
import { MetaTagsServiceMock } from '../../meta-tags/test/meta-tags.mock';
import { PCMenuItemComponent } from '../src/components-v2/pc-menu-item.component';
import { ContentFilterComponent } from '../src/content-filter.component';
import { PageMatrixBootstrapService } from '../src/page-matrix-bootstrap.service';
import { NavScrollDirective } from '../src/pc-scrollmenu.directive';

@Component({
    standalone: true,
    template: '<vn-page-matrix [content]="content"/>',
    imports: [PageMatrixComponent],
})
class TestHostComponent {
    content: any;
}

describe('PageMatrixComponentsV2', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let pageMock: PageMock;
    let metaTagsServiceMock: MetaTagsServiceMock;
    let menuItemsServiceMock: MenuItemsServiceMock;
    let htmlNodeMock: HtmlNodeMock;
    let windowMock: WindowMock;
    let tooltipConfigMock: TooltipsConfigMock;
    let content: any;
    let component: any;
    let componentImports: any[] = [];

    describe('template', () => {
        beforeEach(() => {
            MockContext.useMock(ContentServiceMock);
            metaTagsServiceMock = MockContext.useMock(MetaTagsServiceMock);
            htmlNodeMock = MockContext.useMock(HtmlNodeMock);
            pageMock = MockContext.useMock(PageMock);
            MockContext.useMock(LoggerMock);
            MockContext.useMock(UserServiceMock);
            menuItemsServiceMock = MockContext.useMock(MenuItemsServiceMock);
            MockContext.useMock(CookieConsentTrackingServiceMock);
            MockContext.useMock(TrackingServiceMock);
            MockContext.useMock(DeviceServiceMock);
            windowMock = new WindowMock();
            tooltipConfigMock = MockContext.useMock(TooltipsConfigMock);
            MockContext.useMock(TopLevelCookiesConfigMock);

            pageMock.imageProfiles['teaser'] = {
                prefix: 't-',
                widthBreakpoints: [20],
            };
            pageMock.imageProfiles['teaser2'] = {
                prefix: 't2-',
                widthBreakpoints: [30],
            };
            windowMock.location.href = 'http://10.33.1.47:9876';
        });

        function initComponent() {
            TestBed.configureTestingModule({
                providers: [
                    MockContext.providers,
                    PageMatrixService,
                    PageMatrixBootstrapService,
                    {
                        provide: WINDOW,
                        useValue: windowMock,
                    },
                ],
            });

            TestBed.overrideComponent(TestHostComponent, {
                set: {
                    imports: [PageMatrixComponent],
                },
            });

            TestBed.overrideComponent(component, {
                set: {
                    imports: [
                        CommonModule,
                        PCComponentHeaderV2Component,
                        ContentFilterComponent,
                        TrustAsHtmlPipe,
                        AuthstateDirective,
                        HtmlAttrsDirective,
                        DynamicHtmlDirective,
                        PageMatrixDirective,
                        ProfilesDirective,
                        ...componentImports,
                    ],
                    schemas: [NO_ERRORS_SCHEMA],
                },
            });

            setupComponentFactoryResolver();

            const bootstrapService: PageMatrixBootstrapService = TestBed.inject(PageMatrixBootstrapService);
            bootstrapService.onFeatureInit();

            fixture = TestBed.createComponent(TestHostComponent);

            fixture.componentInstance.content = content;

            fixture.detectChanges();
            tooltipConfigMock.whenReady.next();
        }

        function q(selector?: string): HTMLElement | null {
            const de = fixture.debugElement.query(By.directive(PageMatrixComponent));
            if (!de) {
                return null;
            }

            if (!selector) {
                return de.nativeElement;
            }

            return de.nativeElement.querySelector(selector);
        }

        describe('pc text', () => {
            beforeEach(() => {
                component = pc2.PCTextComponent;
            });

            it('should render pc text', () => {
                content = {
                    templateName: 'pctext',
                    class: 'wrapper',
                    text: '<p>text</p>',
                };

                initComponent();

                expect(q('vn-pc-text')).toHaveClass('pc-component');
                expect(q('vn-pc-text')).toHaveClass('pc-text');
                expect(q('vn-pc-text')).toHaveClass('wrapper');
                expect(q('h3')).toBeNull();
                expect(q('div.pc-txt p')).toHaveText('text');
            });

            it('should render pc text with title', () => {
                content = {
                    templateName: 'pctext',
                    text: '<p>text</p>',
                    title: 'title',
                    parameters: {
                        'title-class': 'tcls',
                    },
                };

                initComponent();

                expect(q('h3.pc-h.tcls')).toHaveText('title');
                expect(q('vn-pc-component-header-v2')).toHaveClass('pc-header');
                expect(q('div.pc-txt p')).toHaveText('text');
            });

            it('should render pc text with h1 title', () => {
                content = {
                    templateName: 'pctext',
                    text: '<p>text</p>',
                    title: 'title',
                    parameters: {
                        'title-tag': 'h1',
                    },
                };

                initComponent();

                expect(q('h1.pc-h')).toHaveText('title');
                expect(q('vn-pc-component-header-v2')).toHaveClass('pc-header');
                expect(q('div.pc-txt p')).toHaveText('text');
            });

            it('should render pc text with title link', () => {
                content = {
                    templateName: 'pctext',
                    text: '<p>text</p>',
                    title: 'title',
                    titleLink: {
                        url: 'urlMatch',
                        text: 'unused text',
                        attributes: {
                            class: 'cls',
                        },
                    },
                };

                initComponent();

                const titleLink = q('h3.pc-h a.pc-h-a');

                expect(titleLink).toHaveText('title');
                expect(titleLink).toHaveClass('cls');
                expect(titleLink).toHaveAttr('href', 'urlMatch');
                expect(q('div.pc-txt p')).toHaveText('text');
            });
        });

        describe('rawtext', () => {
            beforeEach(() => {
                component = pc2.PCRawTextComponent;
            });

            it('should render raw text', () => {
                content = {
                    templateName: 'pctext',
                    class: 'wrapper',
                    text: '<p>text</p>',
                    parameters: {
                        template: 'RawText',
                    },
                };

                initComponent();

                expect(q('vn-pc-raw-text')).not.toHaveClass('pc-component');
                expect(q('vn-pc-raw-text')).toHaveClass('wrapper');
                expect(q('p')).toHaveText('text');
            });
        });

        describe('pc image', () => {
            beforeEach(() => {
                component = pc2.PCImageComponent;
            });

            it('should render pc image', () => {
                content = {
                    templateName: 'pcimage',
                    class: 'wrapper',
                    image: {
                        src: 'images/image.png',
                        alt: 'alt',
                        width: 50,
                        height: 100,
                    },
                };

                initComponent();

                expect(q('vn-pc-image')).toHaveClass('pc-component');
                expect(q('vn-pc-image')).toHaveClass('pc-image');
                expect(q('vn-pc-image')).toHaveClass('wrapper');

                expect(q('vn-pc-component-header-v2')).toBeNull();

                const image = q('img.pc-img');

                expect(image).toHaveAttr('src', 'images/image.png');
                expect(image).toHaveAttr('alt', 'alt');
            });

            it('should render pc image with title', () => {
                content = {
                    templateName: 'pcimage',
                    image: {
                        src: 'images/image.png',
                        alt: 'alt',
                        width: 50,
                        height: 100,
                    },
                    title: 'title',
                };

                initComponent();

                expect(q('h3.pc-h')).toHaveText('title');

                const image = q('img.pc-img');

                expect(image).toHaveAttr('src', 'images/image.png');
                expect(image).toHaveAttr('alt', 'alt');
            });

            it('should render pc image with link', () => {
                content = {
                    templateName: 'pcimage',
                    image: {
                        src: 'images/image.png',
                        alt: 'alt',
                        width: 50,
                        height: 100,
                    },
                    imageLink: {
                        url: 'urlMatch',
                        attributes: {
                            class: 'cls',
                        },
                    },
                };

                initComponent();

                expect(q('h3')).toBeNull();

                const imageLink = q('a.pc-img-a');

                expect(imageLink).toHaveAttr('href', 'urlMatch');
                expect(imageLink).toHaveClass('cls');

                const image = q('a.pc-img-a img.pc-img');

                expect(image).toHaveAttr('src', 'images/image.png');
                expect(image).toHaveAttr('alt', 'alt');
            });
        });

        describe('rawimage', () => {
            beforeEach(() => {
                component = pc2.PCRawImageComponent;
            });

            it('should render raw image', () => {
                content = {
                    templateName: 'pcimage',
                    class: 'wrapper',
                    image: {
                        src: 'images/image.png',
                        alt: 'alt',
                        width: 50,
                        height: 100,
                    },
                    parameters: {
                        template: 'RawImage',
                    },
                };

                initComponent();

                expect(q('vn-pc-raw-image')).not.toHaveClass('pc-component');
                expect(q('vn-pc-raw-image')).toHaveClass('wrapper');

                const image = q('vn-image');
                expect(image).toBeDefined();
            });
        });

        describe('pc image text', () => {
            beforeEach(() => {
                component = pc2.PCImageTextComponent;
            });

            it('should render pc image text', () => {
                content = {
                    templateName: 'pcimagetext',
                    class: 'wrapper',
                    image: {
                        src: 'images/image.png',
                        alt: 'alt',
                        width: 50,
                        height: 100,
                    },
                    text: '<p>text</p>',
                };

                initComponent();

                expect(q('vn-pc-image-text')).toHaveClass('pc-component');
                expect(q('vn-pc-image-text')).toHaveClass('pc-image-text');
                expect(q('vn-pc-image-text')).toHaveClass('wrapper');

                expect(q('vn-pc-component-header-v2')).toBeNull();

                const image = q('img.pc-img');

                expect(image).toHaveAttr('src', 'images/image.png');
                expect(image).toHaveAttr('alt', 'alt');

                expect(q('div.pc-txt p')).toHaveText('text');
            });

            it('should render pc image text with title', () => {
                content = {
                    templateName: 'pcimagetext',
                    image: {
                        src: 'images/image.png',
                        alt: 'alt',
                        width: 50,
                        height: 100,
                    },
                    title: 'title',
                    text: '<p>text</p>',
                };

                initComponent();

                expect(q('h3.pc-h')).toHaveText('title');

                const image = q('img.pc-img');

                expect(image).toHaveAttr('src', 'images/image.png');
                expect(image).toHaveAttr('alt', 'alt');

                expect(q('div.pc-txt p')).toHaveText('text');
            });

            it('should render pc image text with link', () => {
                content = {
                    templateName: 'pcimagetext',
                    image: {
                        src: 'images/image.png',
                        alt: 'alt',
                        width: 50,
                        height: 100,
                    },
                    imageLink: {
                        url: 'urlMatch',
                        attributes: {
                            class: 'cls',
                        },
                    },
                    text: '<p>text</p>',
                };

                initComponent();

                expect(q('h3')).toBeNull();

                const imageLink = q('a.pc-img-a');

                expect(imageLink).toHaveAttr('href', 'urlMatch');
                expect(imageLink).toHaveClass('cls');

                const image = q('a.pc-img-a img.pc-img');

                expect(image).toHaveAttr('src', 'images/image.png');
                expect(image).toHaveAttr('alt', 'alt');

                expect(q('div.pc-txt p')).toHaveText('text');
            });
        });

        describe('pc teaser', () => {
            beforeEach(() => {
                component = pc2.PCTeaserComponent;
            });

            it('should render pc teaser', () => {
                windowMock.matchMedia('(max-width: 10px)').matches = true;
                windowMock.matchMedia('(max-width: 20px)').matches = true;
                windowMock.matchMedia('(max-width: 30px)').matches = true;

                content = {
                    templateName: 'pc teaser',
                    image: {
                        src: 'http://10.33.1.47:9876/images/image.png?p=t-20',
                        alt: 'alt',
                        width: 50,
                        height: 100,
                    },
                    class: 'wrapper',
                    text: '<p>text</p>',
                    summary: 'summary',
                    subtitle: 'subtitle',
                    optionalText: '<p>otext</p>',
                    title: 'title',
                    imageOverlay: {
                        src: 'http://10.33.1.47:9876/images/large.png',
                        alt: 'oalt',
                        width: 50,
                        height: 100,
                    },
                    imageOverlayClass: 'ocls',
                    parameters: {
                        'image-profiles-set': 'teaser',
                        'overlay-image-profiles-set': 'teaser2',
                        'subtitle-tag': 'h6',
                        'summary-tag': 'h2',
                        'subtitle-class': 'sucls',
                        'summary-class': 'smcls',
                    },
                };

                initComponent();

                expect(q('vn-pc-teaser')).toHaveClass('pc-component');
                expect(q('vn-pc-teaser')).toHaveClass('pc-teaser');
                expect(q('vn-pc-teaser')).toHaveClass('wrapper');

                expect(q('h3.pc-h')).toHaveText('title');

                const image = q('div.pc-t-img-cont img.pc-img');

                expect(image).toHaveAttr('src', 'http://10.33.1.47:9876/images/image.png?p=t-20');
                expect(image).toHaveAttr('alt', 'alt');
                expect(image).toHaveAttr('alt', 'alt');

                const overlayImage = q('div.pc-t-img-opt img');

                expect(overlayImage).toHaveAttr('src', 'http://10.33.1.47:9876/images/large.png?p=t2-30');
                expect(overlayImage).toHaveAttr('alt', 'oalt');
                expect(overlayImage).toHaveClass('ocls');

                expect(q('div.pc-t-h-cont h6.pc-t-h-cont-sub.sucls')).toHaveText('subtitle');
                expect(q('div.pc-t-h-cont h2.pc-t-h-cont-sum.smcls')).toHaveText('summary');
                expect(q('div.pc-t-txt p')).toHaveText('text');
                expect(q('div.pc-t-txt-opt p')).toHaveText('otext');
            });

            it('should render pc teaser with image link and title link', () => {
                content = {
                    templateName: 'pc teaser',
                    image: {
                        src: 'images/image.png',
                        alt: 'alt',
                        width: 50,
                        height: 100,
                    },
                    text: '<p>text</p>',
                    summary: 'summary',
                    subtitle: 'subtitle',
                    optionalText: '<p>otext</p>',
                    title: 'title',
                    imageLink: {
                        url: 'urlMatch',
                        attributes: {
                            class: 'cls',
                        },
                    },
                    titleLink: {
                        url: 'title url',
                        attributes: {
                            class: 'cls',
                        },
                        text: 'unused text',
                    },
                    parameters: {},
                };

                initComponent();

                const titleLink = q('h3.pc-h a.pc-h-a');

                expect(titleLink).toHaveAttr('href', 'title url');
                expect(titleLink).toHaveText('title');
                expect(titleLink).toHaveClass('cls');

                const imageLink = q('div.pc-t-img-cont a.pc-img-a');

                expect(imageLink).toHaveAttr('href', 'urlMatch');
                expect(imageLink).toHaveClass('cls');

                const image = q('div.pc-t-img-cont a.pc-img-a img.pc-img');

                expect(image).toHaveAttr('src', 'images/image.png');
                expect(image).toHaveAttr('alt', 'alt');

                expect(q('div.pc-t-h-cont h4.pc-t-h-cont-sub')).toHaveText('subtitle');
                expect(q('div.pc-t-h-cont h5.pc-t-h-cont-sum')).toHaveText('summary');
                expect(q('div.pc-t-txt p')).toHaveText('text');
                expect(q('div.pc-t-txt-opt p')).toHaveText('otext');
            });

            it('should use title link text if title is not specified', () => {
                content = {
                    templateName: 'pc teaser',
                    titleLink: {
                        url: 'title url',
                        attributes: {
                            class: 'cls',
                        },
                        text: 'title link text',
                    },
                };

                initComponent();

                const titleLink = q('h3.pc-h a.pc-h-a');

                expect(titleLink).toHaveAttr('href', 'title url');
                expect(titleLink).toHaveText('title link text');
                expect(titleLink).toHaveClass('cls');
            });

            it('should not render optional sections if not specified', () => {
                content = {
                    templateName: 'pc teaser',
                };

                initComponent();

                expect(q('h3')).toHaveText('');
                expect(q('div.pc-t-img-cont a')).toBeNull();
                expect(q('div.pc-t-img-cont img')).toBeNull();
                expect(q('div.pc-t-h-cont h4')).toBeNull();
                expect(q('div.pc-t-h-cont h5')).toBeNull();
                expect(q('div.pc-t-txt')).toBeNull();
                expect(q('div.pc-t-txt-opt')).toBeNull();
                expect(q('div.pc-t-img-opt')).toBeNull();
            });
        });

        describe('pc-toggle', () => {
            let pcToggleTestsRan: number;

            beforeAll(() => {
                pcToggleTestsRan = 0;
            });

            beforeEach(() => {
                component = pc2.PCToggleComponent;
            });

            it('should render pc-toggle', () => {
                content = {
                    templateName: 'pctext',
                    class: 'wrapper',
                    text: '<p>text</p>',
                    title: 'title',
                    parameters: {
                        render: 'pc-toggle',
                    },
                };

                initComponent();
                fixture.detectChanges();

                expect(q('vn-pc-toggle')).toHaveClass('pc-component');
                expect(q('vn-pc-toggle')).toHaveClass('pc-toggle');
                expect(q('vn-pc-toggle')).toHaveClass('wrapper');

                expect(q('h3')).toBeNull();
                expect(q('label.pc-toggle-label')).toHaveText('title');
                expect(q('div.pc-txt p')).toHaveText('text');

                pcToggleTestsRan++;
            });

            it('should not render if text is empty', () => {
                content = {
                    templateName: 'pctext',
                    title: 'title',
                    parameters: {
                        render: 'pc-toggle',
                    },
                };

                initComponent();

                expect(q('div')).toBeNull();

                pcToggleTestsRan++;
            });

            it('should have unique checkbox id', () => {
                content = {
                    templateName: 'pctext',
                    text: '<p>text</p>',
                    title: 'title',
                    parameters: {
                        render: 'pc-toggle',
                    },
                };

                initComponent();

                expect(q('input')).toHaveAttr('id', 'pctoggle_chbx_' + pcToggleTestsRan);
                expect(q('label')).toHaveAttr('for', 'pctoggle_chbx_' + pcToggleTestsRan);

                pcToggleTestsRan++;

                fixture = TestBed.createComponent(TestHostComponent);
                fixture.componentInstance.content = content;
                fixture.detectChanges();

                expect(q('input')).toHaveAttr('id', 'pctoggle_chbx_' + pcToggleTestsRan);
                expect(q('label')).toHaveAttr('for', 'pctoggle_chbx_' + pcToggleTestsRan);

                pcToggleTestsRan++;
            });
        });

        describe('pc component folder', () => {
            beforeEach(() => {
                component = pc2.PCComponentFolderComponent;
            });

            it('should render folder with child items', () => {
                content = {
                    templateName: 'pccomponentfolder',
                    class: 'wrapper',
                    items: [
                        {
                            templateName: 'pctext',
                            text: '<p>text1</p>',
                        },
                        {
                            templateName: 'pcimage',
                            image: {
                                src: 'images/image.png',
                                width: 50,
                            },
                        },
                    ],
                };

                initComponent();

                expect(q('vn-pc-component-folder')).toHaveClass('pc-component');
                expect(q('vn-pc-component-folder')).toHaveClass('pc-folder');
                expect(q('vn-pc-component-folder')).toHaveClass('wrapper');

                expect(q('vn-pc-text div p')).toHaveText('text1');
                expect(q('vn-pc-image img')).toHaveAttr('src', 'images/image.png');
            });

            it('should render folder with title', () => {
                content = {
                    templateName: 'pccomponentfolder',
                    title: 'title',
                    items: [
                        {
                            templateName: 'pctext',
                            text: '<p>text1</p>',
                        },
                    ],
                };

                initComponent();

                expect(q('h3.pc-h')).toHaveText('title');

                expect(q('vn-pc-text div p')).toHaveText('text1');
            });
        });

        describe('pc container', () => {
            beforeEach(() => {
                component = pc2.PCContainerComponent;
            });

            it('should render container with child items', () => {
                content = {
                    templateName: 'pccontainer',
                    class: 'wrapper',
                    items: [
                        {
                            templateName: 'pctext',
                            text: '<p>text1</p>',
                        },
                        {
                            templateName: 'pcimage',
                            image: {
                                src: 'images/image.png',
                                width: 50,
                            },
                        },
                    ],
                };

                initComponent();

                expect(q('vn-pc-container')).toHaveClass('pc-component');
                expect(q('vn-pc-container')).toHaveClass('pc-container');
                expect(q('vn-pc-container')).toHaveClass('wrapper');

                expect(q('vn-pc-text div p')).toHaveText('text1');
                expect(q('vn-pc-image img')).toHaveAttr('src', 'images/image.png');
            });

            it('should render container with title', () => {
                content = {
                    templateName: 'pccontainer',
                    title: 'title',
                    items: [
                        {
                            templateName: 'pctext',
                            text: '<p>text1</p>',
                        },
                    ],
                };

                initComponent();

                expect(q('h3.pc-h')).toHaveText('title');

                expect(q('vn-pc-text div p')).toHaveText('text1');
            });
        });

        describe('pc regional component', () => {
            beforeEach(() => {
                component = pc2.PCRegionalComponent;
            });

            it('should render child item', () => {
                content = {
                    templateName: 'pcregionalcomponent',
                    class: 'wrapper',
                    item: {
                        templateName: 'pctext',
                        text: '<p>text1</p>',
                    },
                };

                initComponent();

                expect(q('vn-pc-regional-component')).toHaveClass('pc-component');
                expect(q('vn-pc-regional-component')).toHaveClass('pc-regional');
                expect(q('vn-pc-regional-component')).toHaveClass('wrapper');

                expect(q('vn-pc-text div p')).toHaveText('text1');
            });

            it('should render regional component with title', () => {
                content = {
                    templateName: 'pcregionalcomponent',
                    title: 'title',
                    item: {
                        templateName: 'pctext',
                        text: '<p>text1</p>',
                    },
                };

                initComponent();

                expect(q('h3.pc-h')).toHaveText('title');

                expect(q('vn-pc-text div p')).toHaveText('text1');
            });
        });

        describe('pc menu', () => {
            let urlServiceMock: UrlServiceMock;
            let navigationServiceMock: NavigationServiceMock;
            let menuActionsServiceMock: MenuActionsServiceMock;

            beforeEach(() => {
                component = pc2.PCMenuComponent;
                componentImports = [PCMenuItemComponent];

                TestBed.overrideComponent(PCMenuItemComponent, {
                    remove: {
                        imports: [IconCustomComponent],
                    },
                    add: {
                        imports: [MockComponent(IconCustomComponent)],
                    },
                });
                TestBed.overrideComponent(PCMenuItemComponent, {
                    remove: {
                        imports: [IconCustomComponent],
                    },
                    add: {
                        imports: [MockComponent(IconCustomComponent)],
                    },
                });
                menuActionsServiceMock = MockContext.useMock(MenuActionsServiceMock);
                navigationServiceMock = MockContext.useMock(NavigationServiceMock);
                urlServiceMock = MockContext.useMock(UrlServiceMock);

                navigationServiceMock.location.baseUrl.and.returnValue('base');
                navigationServiceMock.location.path.and.returnValue('path');

                urlServiceMock.parse.and.returnValue(new ParsedUrlMock());
            });

            it('should render menu with menu items', () => {
                content = {
                    templateName: 'pc menu',
                    class: 'wrapper',
                    menu: {
                        children: [
                            { text: 'c1', url: 'http://c1.com', class: 'c1cls', target: '_blank', parameters: {}, resources: {} },
                            { text: 'c2', url: 'http://c2.com', class: 'c2cls', parameters: {}, resources: {} },
                        ],
                    },
                };

                initComponent();

                expect(q('vn-pc-menu')).toHaveClass('pc-component');
                expect(q('vn-pc-menu')).toHaveClass('pc-menu');
                expect(q('vn-pc-menu')).toHaveClass('wrapper');

                expect(q('h3')).toBeNull();

                const item1 = q('vn-pc-menu div.pc-menu-items .pc-menu-item a.pc-menu-link.c1cls');
                expect(item1).toHaveText('c1');
                expect(item1).toHaveAttr('href', 'http://c1.com');
                expect(item1).toHaveAttr('target', '_blank');
                expect(item1).not.toHaveClass('active');

                const item2 = q('vn-pc-menu div.pc-menu-items .pc-menu-item a.pc-menu-link.c2cls');
                expect(item2).toHaveText('c2');
                expect(item2).toHaveAttr('href', 'http://c2.com');
                expect(item1).not.toHaveClass('active');
            });

            it('should render menu with title', () => {
                content = {
                    templateName: 'pc menu',
                    title: 'title',
                    menu: {
                        children: [{ text: 'c1', parameters: {}, resources: {} }],
                    },
                };

                initComponent();

                expect(q('h3.pc-h')).toHaveText('title');
            });

            it('should render menu with title link', () => {
                content = {
                    templateName: 'pc menu',
                    title: 'title',
                    titleLink: {
                        url: 'urlMatch',
                        text: 'unused text',
                        attributes: {
                            class: 'cls',
                        },
                    },
                };

                initComponent();

                const titleLink = q('h3.pc-h a.pc-h-a');

                expect(titleLink).toHaveText('title');
                expect(titleLink).toHaveClass('cls');
                expect(titleLink).toHaveAttr('href', 'urlMatch');
            });

            it('should call menu actions service when link is clicked', () => {
                content = {
                    templateName: 'pc menu',
                    name: 'menu1',
                    menu: {
                        children: [{ text: 'c1', url: 'http://c1.com', class: 'c1cls', parameters: {}, resources: {} }],
                    },
                };

                initComponent();

                const item1 = q('vn-pc-menu div.pc-menu-items .pc-menu-item')!;
                const event = new Event('click');
                item1.dispatchEvent(event);

                //expect(menuActionsServiceMock.processClick).toHaveBeenCalledWith(event, content.menu.children[0], 'PageMatrix_menu1', false);
            });

            it('should render menu with multiple levels menu items', () => {
                content = {
                    templateName: 'pc menu',
                    class: 'wrapper',
                    menu: {
                        children: [
                            {
                                text: 'c1',
                                url: 'http://c1.com',
                                class: 'r',
                                children: [
                                    {
                                        text: 'sub1',
                                        class: 's1',
                                        children: [
                                            { text: 'subsub1', class: 'ss1', parameters: {}, resources: {} },
                                            { text: 'subsub2', class: 'ss2', parameters: {}, resources: {} },
                                        ],
                                        parameters: {},
                                        resources: {},
                                    },
                                ],
                                parameters: {},
                                resources: {},
                            },
                        ],
                        parameters: {},
                        resources: {},
                    },
                };

                initComponent();

                const item1 = q('vn-pc-menu div.pc-menu-items .pc-menu-item a.pc-menu-link.r');
                expect(item1).toHaveText('c1');
                expect(item1).toHaveAttr('href', 'http://c1.com');

                const subitem1 = q('vn-pc-menu div.pc-menu-items .pc-menu-submenu.pc-menu-level-1 .pc-menu-item a.pc-menu-link.s1');
                expect(subitem1).toHaveText('sub1');

                const subsubitem1 = q(
                    'vn-pc-menu div.pc-menu-items .pc-menu-submenu.pc-menu-level-1 .pc-menu-submenu.pc-menu-level-2 .pc-menu-item a.pc-menu-link.ss1',
                );
                expect(subsubitem1).toHaveText('subsub1');

                const subsubitem2 = q(
                    'vn-pc-menu div.pc-menu-items .pc-menu-submenu.pc-menu-level-1 .pc-menu-submenu.pc-menu-level-2 .pc-menu-item a.pc-menu-link.ss2',
                );
                expect(subsubitem2).toHaveText('subsub2');
            });

            it('should should set active item based on url and expand parent and the item, but not the children', () => {
                const activeUrlMock = new ParsedUrlMock();
                activeUrlMock.baseUrl.and.returnValue('base');
                activeUrlMock.path.and.returnValue('path');
                urlServiceMock.parse.withArgs('aurl').and.returnValue(activeUrlMock);

                content = {
                    templateName: 'pc menu',
                    class: 'wrapper',
                    name: 'menu1',
                    menu: {
                        children: [
                            {
                                text: 'c1',
                                url: 'http://c1.com',
                                class: 'r',
                                children: [
                                    {
                                        name: 'sub1n',
                                        text: 'sub1',
                                        class: 's1',
                                        url: 'aurl',
                                        children: [
                                            { text: 'subsub0', class: 'ss0', parameters: {}, resources: {} },
                                            {
                                                text: 'subsub1',
                                                class: 'ss1',
                                                children: [{ text: 'subsubsub1', class: 'sss1', parameters: {}, resources: {} }],
                                                parameters: {},
                                                resources: {},
                                            },
                                            { text: 'subsub2', class: 'ss2', parameters: {}, resources: {} },
                                        ],
                                        parameters: {},
                                        resources: {},
                                    },
                                ],
                                parameters: {},
                                resources: {},
                            },
                        ],
                    },
                };

                initComponent();

                expect(menuItemsServiceMock.setActive).toHaveBeenCalledWith('PageMatrix_menu1', 'sub1n');

                expect(q('vn-pc-menu div.pc-menu-items .pc-menu-level-1')).not.toHaveClass('collapsed');
                expect(q('vn-pc-menu div.pc-menu-items .pc-menu-level-2')).not.toHaveClass('collapsed');
                expect(q('vn-pc-menu div.pc-menu-items .pc-menu-level-3')).toHaveClass('collapsed');
            });

            it('should get the first non empty child on click', () => {
                content = {
                    templateName: 'pc menu',
                    class: 'wrapper',
                    name: 'menu1',
                    menu: {
                        children: [
                            {
                                text: 'c1',
                                class: 'r',
                                children: [
                                    {
                                        text: 'sub1',
                                        class: 's1',
                                        children: [
                                            {
                                                text: 'subsub1',
                                                url: 'url',
                                                class: 'ss1',
                                                children: [{ text: 'subsubsub1', class: 'sss1', parameters: {}, resources: {} }],
                                                parameters: {},
                                                resources: {},
                                            },
                                            { text: 'subsub2', class: 'ss2', parameters: {}, resources: {} },
                                        ],
                                        parameters: {},
                                        resources: {},
                                    },
                                ],
                                parameters: {},
                                resources: {},
                            },
                        ],
                    },
                };

                initComponent();

                const event = new MouseEvent('click');
                q('.r')!.dispatchEvent(event);

                expect(menuActionsServiceMock.processClick).toHaveBeenCalledWith(
                    event,
                    jasmine.objectContaining({ text: 'subsub1' }),
                    'PageMatrix_menu1',
                );
            });
        });

        describe('page tags', () => {
            beforeEach(() => {
                component = pc2.PM1ColPageComponent;
            });

            it('should add metatags and title to the dom', () => {
                content = {
                    templateName: 'pm1colpage',
                    content: [],
                    pageTitle: 'pm-title',
                    pageDescription: 'pm-desc',
                    pageMetaTags: {
                        'pm-meta': 'pm-meta-content',
                    },
                };

                initComponent();
                metaTagsServiceMock.whenReady.next();

                expect(metaTagsServiceMock.setPageTags).toHaveBeenCalledWith('pm-title', {
                    'description': 'pm-desc',
                    'pm-meta': 'pm-meta-content',
                });

                fixture.destroy();
                metaTagsServiceMock.whenReady.next();

                expect(metaTagsServiceMock.clearPageTags).toHaveBeenCalled();
            });
        });

        describe('html class', () => {
            beforeEach(() => {
                component = pc2.PM1ColPageComponent;
            });

            it('should set html css class', () => {
                content = {
                    templateName: 'pm1colpage',
                    content: [],
                    parameters: {
                        htmlClass: 'html-class',
                    },
                };

                initComponent();

                expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith('html-class', true);

                fixture.destroy();

                expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith('html-class', false);
            });
        });

        describe('pm 1 col page', () => {
            beforeEach(() => {
                component = pc2.PM1ColPageComponent;
            });

            it('should render page and content', () => {
                content = {
                    templateName: 'pm1colpage',
                    pageClass: 'wrapper',
                    pageId: 'pageid',
                    content: [
                        {
                            templateName: 'pctext',
                            text: '<p>text1</p>',
                        },
                        {
                            templateName: 'pcimage',
                            image: {
                                src: 'images/image.png',
                                width: 50,
                            },
                        },
                    ],
                };

                initComponent();

                expect(q('vn-pm-1col-page')).toHaveClass('pm-page');
                expect(q('vn-pm-1col-page')).toHaveClass('pm-1col');
                expect(q('vn-pm-1col-page')).toHaveClass('pm-simple-layout');
                expect(q('vn-pm-1col-page')).toHaveClass('wrapper');
                expect(q('vn-pm-1col-page')).toHaveAttr('id', 'pageid');

                expect(q('vn-pc-text div p')).toHaveText('text1');
                expect(q('vn-pc-image img')).toHaveAttr('src', 'images/image.png');
            });
        });

        describe('pc carousel', () => {
            beforeEach(() => {
                component = pc2.PCCarouselComponent;

                MockContext.useMock(NavigationServiceMock);
            });

            it('should render carousel with child items', () => {
                content = {
                    templateName: 'pccarousel',
                    class: 'carousel-spacing-x',
                    items: [
                        {
                            templateName: 'pctext',
                            text: '<p>text1</p>',
                        },
                        {
                            templateName: 'pcimage',
                            image: {
                                src: 'images/image.png',
                                width: 50,
                            },
                        },
                    ],
                };

                initComponent();

                const pccarousel = q('vn-pc-carousel');
                expect(pccarousel).toHaveClass('pc-component');
                expect(pccarousel).toHaveClass('pc-carousel');
                expect(pccarousel).toHaveClass('carousel-spacing-x');

                expect(q('vn-swiper vn-pc-text')).toBeTruthy();
                expect(q('vn-swiper vn-pc-image')).toBeTruthy();
            });
        });

        describe('pc scrollmenu', () => {
            beforeEach(() => {
                component = pc2.PCScrollMenuComponent;
                componentImports = [NavScrollDirective];
            });

            it('should render container with child items', () => {
                content = {
                    templateName: 'pcscrollmenu',
                    class: 'wrapper',
                    items: [
                        {
                            templateName: 'pctext',
                            title: 'title',
                            text: '<p>text</p>',
                        },
                        {
                            templateName: 'pcimage',
                            image: {
                                src: 'images/image.png',
                                width: 50,
                            },
                        },
                    ],
                    menuItems: [
                        {
                            templateName: 'pctext',
                            title: 'title',
                            text: '<p>text</p>',
                        },
                    ],
                };

                initComponent();

                expect(q('vn-pc-scrollmenu')).toHaveClass('pc-component');
                expect(q('vn-pc-scrollmenu')).toHaveClass('pc-scrollmenu');
                expect(q('vn-pc-scrollmenu')).toHaveClass('wrapper');

                expect(q('.pc-navscroll-menu__item .pc-navscroll-menu__item-text')).toHaveText('title');

                expect(q('vn-pc-text div p')).toHaveText('text');
                expect(q('vn-pc-image img')).toHaveAttr('src', 'images/image.png');
            });
        });
    });
});
