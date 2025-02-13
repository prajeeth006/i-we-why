import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSegment } from '@angular/router';

import { ClientConfigProductName } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { ActivatedRouteMock } from '../../../core/test/activated-route.mock';
import { MockDslPipe } from '../../../core/test/browser/dsl.pipe.mock';
import { ContentServiceMock } from '../../../core/test/content/content.mock';
import { PageViewDataServiceMock } from '../../../core/test/tracking/page-view-data.mock';
import { PublicPageLoaderComponent } from '../src/public-page-loader.component';

describe('PublicPageLoaderComponent', () => {
    let fixture: ComponentFixture<PublicPageLoaderComponent>;
    let activatedRouteMock: ActivatedRouteMock;
    let contentServiceMock: ContentServiceMock;
    let pageViewDataServiceMock: PageViewDataServiceMock;

    beforeEach(() => {
        activatedRouteMock = MockContext.useMock(ActivatedRouteMock);
        contentServiceMock = MockContext.useMock(ContentServiceMock);
        pageViewDataServiceMock = MockContext.useMock(PageViewDataServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
            declarations: [MockDslPipe],
            schemas: [NO_ERRORS_SCHEMA],
        });

        activatedRouteMock.snapshot.data.publicPageRoot = 'root/';
        activatedRouteMock.snapshot.data.product = ClientConfigProductName.SPORTS;

        fixture = TestBed.createComponent(PublicPageLoaderComponent);
        fixture.detectChanges();
    });

    it('should contain empty markup while loading', () => {
        expect(fixture.componentInstance.content).toBeUndefined();

        activatedRouteMock.url.next([new UrlSegment('path', {})]);
    });

    it('should load public page data', () => {
        activatedRouteMock.url.next([new UrlSegment('some', {}), new UrlSegment('publicpage', {})]);
        expect(contentServiceMock.getJson).toHaveBeenCalledWith('root/some/publicpage', {
            filterOnClient: true,
            product: ClientConfigProductName.SPORTS,
        });

        const content = { templateName: 'xx' };

        contentServiceMock.getJson.completeWith(content);

        expect(fixture.componentInstance.content).toBe(content);
        expect(pageViewDataServiceMock.setDataForNavigation).toHaveBeenCalledWith(activatedRouteMock.snapshot, {});
    });

    it('should load not-found', () => {
        activatedRouteMock.url.next([new UrlSegment('path', {})]);

        contentServiceMock.getJson.error();

        expect(contentServiceMock.getJson).toHaveBeenCalledWith('App-v1.0/partials/notfound', {
            product: ClientConfigProductName.SF,
            filterOnClient: true,
        });

        const notFoundContent = { not: 'FOUND' };

        contentServiceMock.getJson.completeWith(notFoundContent, 1);
        contentServiceMock.getJson.complete();

        expect(fixture.componentInstance.content).toBe(notFoundContent);
        expect(pageViewDataServiceMock.setDataForNavigation).toHaveBeenCalledWith(activatedRouteMock.snapshot, {
            'page.name': 'Errorpage - Not Found',
        });
    });
});
