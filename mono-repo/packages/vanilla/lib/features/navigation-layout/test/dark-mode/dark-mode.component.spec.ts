import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { CommonMessagesMock } from '../../../../core/src/client-config/test/common-messages.mock';
import { HtmlNodeMock } from '../../../../core/test/browser/html-node.mock';
import { AccountMenuDataServiceMock } from '../../../account-menu/test/account-menu-data.mock';
import { DarkModeComponent } from '../../src/dark-mode/dark-mode.component';
import { DarkModeServiceMock } from './dark-mode.mock';

describe('DarkModeComponent', () => {
    let fixture: ComponentFixture<DarkModeComponent>;
    let darkModeServiceMock: DarkModeServiceMock;
    let accountMenuDataServiceMock: AccountMenuDataServiceMock;
    let htmlNodeMock: HtmlNodeMock;

    beforeEach(() => {
        darkModeServiceMock = MockContext.useMock(DarkModeServiceMock);
        accountMenuDataServiceMock = MockContext.useMock(AccountMenuDataServiceMock);
        htmlNodeMock = MockContext.useMock(HtmlNodeMock);
        MockContext.useMock(CommonMessagesMock);

        TestBed.overrideComponent(DarkModeComponent, {
            set: {
                imports: [],
                providers: [MockContext.providers],
            },
        });

        fixture = TestBed.createComponent(DarkModeComponent);
    });

    describe('toggleDarkMode()', () => {
        it('should call service and emit output', () => {
            darkModeServiceMock.isEnabled = true;
            const spy = jasmine.createSpy();

            fixture.componentInstance.onChange.subscribe(spy);

            fixture.componentInstance.toggleDarkMode();

            expect(spy).toHaveBeenCalledWith(false);
            expect(darkModeServiceMock.toggle).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledBefore(darkModeServiceMock.toggle);
        });

        it('should call set class if account menu version 3', () => {
            accountMenuDataServiceMock.version = 3;
            fixture.componentInstance.ngOnInit();

            expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith('navigation-layout-page-card', true);
        });
    });
});
