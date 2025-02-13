import 'zone.js';
import 'zone.js/testing';
import 'jasmine-expect';
import 'jasmine_dom_matchers';
import '@angular/localize/init';

import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

import { MockContext } from 'moxxi';

import { PageMock } from './core/test/browsercommon/page.mock';
import { ProductServiceMock } from './core/test/products/product.mock';

getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), { teardown: { destroyAfterEach: true } });

beforeAll(() => {
    MockContext.autoMock(PageMock);
    MockContext.autoMock(ProductServiceMock);
});
