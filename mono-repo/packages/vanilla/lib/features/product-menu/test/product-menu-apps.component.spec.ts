import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSection } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { MockDslPipe } from '../../../core/test/browser/dsl.pipe.mock';
import { ProductMenuAppsComponent } from '../src/product-menu-apps.component';
import { ProductMenuConfigMock, ProductMenuServiceMock } from './product-menu.mock';

describe('ProductMenuAppsComponent', () => {
    let fixture: ComponentFixture<ProductMenuAppsComponent>;

    beforeEach(() => {
        MockContext.useMock(ProductMenuServiceMock);
        MockContext.useMock(ProductMenuConfigMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
            declarations: [MockDslPipe],
            schemas: [NO_ERRORS_SCHEMA],
        });

        fixture = TestBed.createComponent(ProductMenuAppsComponent);

        fixture.detectChanges();
    });

    it('should set MenuSection', () => {
        expect(fixture.componentInstance.MenuSection).toBe(MenuSection);
    });
});
