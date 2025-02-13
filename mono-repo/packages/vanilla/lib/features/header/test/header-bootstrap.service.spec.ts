import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MENU_COUNTERS_PROVIDER, MenuContentItem, SlotName } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';
import { of } from 'rxjs';

import { HtmlNodeMock } from '../../../core/test/browser/html-node.mock';
import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { DynamicLayoutServiceMock } from '../../../core/test/dynamic-layout/dynamic-layout.mock';
import { MenuActionsServiceMock } from '../../../core/test/menu-actions/menu-actions.mock';
import { MenuCounterProviderMock } from '../../../core/test/menus/menu-counters.mock';
import { BadgeConfigMock } from '../../../shared/badge/test/badge-config.mock';
import { AccountMenuOnboardingServiceMock } from '../../account-menu/test/account-menu-data.mock';
import { ContentMessagesServiceMock } from '../../content-messages/test/content-messages.mock';
import { HeaderBootstrapService } from '../src/header-bootstrap.service';
import { HEADER_COMPONENTS_MAP } from '../src/header-component-map';
import { HeaderMessagesComponent } from '../src/header-messages/header-messages.component';
import { HeaderComponent } from '../src/header.component';
import { HeaderConfigMock, HeaderSearchServiceMock, HeaderServiceMock } from './header.mock';

class Cmp {}

describe('HeaderBootstrapService', () => {
    let service: HeaderBootstrapService;
    let headerServiceMock: HeaderServiceMock;
    let dslServiceMock: DslServiceMock;
    let headerConfigMock: HeaderConfigMock;
    let dynamicLayoutServiceMock: DynamicLayoutServiceMock;
    let htmlNodeMock: HtmlNodeMock;
    let accountMenuOnboardingServiceMock: AccountMenuOnboardingServiceMock;
    let menuCounterProviderMock: MenuCounterProviderMock;

    beforeEach(() => {
        headerServiceMock = MockContext.useMock(HeaderServiceMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);
        headerConfigMock = MockContext.useMock(HeaderConfigMock);
        dynamicLayoutServiceMock = MockContext.useMock(DynamicLayoutServiceMock);
        htmlNodeMock = MockContext.useMock(HtmlNodeMock);
        accountMenuOnboardingServiceMock = MockContext.useMock(AccountMenuOnboardingServiceMock);
        menuCounterProviderMock = MockContext.createMock(MenuCounterProviderMock);
        MockContext.useMock(MenuActionsServiceMock);
        MockContext.useMock(HeaderSearchServiceMock);
        MockContext.useMock(BadgeConfigMock);
        MockContext.useMock(ContentMessagesServiceMock);

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                HeaderBootstrapService,
                { provide: MENU_COUNTERS_PROVIDER, useValue: menuCounterProviderMock, multi: true },
            ],
        });

        service = TestBed.inject(HeaderBootstrapService);
        headerConfigMock.isEnabledCondition = 'condition';
        headerConfigMock.disabledItems.disabled = 'disabled';
        headerConfigMock.elements.topSlotItems = [{ type: 'component1' } as MenuContentItem];
    });

    describe('run()', () => {
        it('should setup menu item templates', fakeAsync(() => {
            service.onFeatureInit();
            headerConfigMock.whenReady.next();
            tick();

            expect(dynamicLayoutServiceMock.setComponent).toHaveBeenCalledWith('header', HeaderComponent, null);
            expect(dynamicLayoutServiceMock.addComponent).toHaveBeenCalledWith('messages', HeaderMessagesComponent, null);

            for (const key of Object.keys(HEADER_COMPONENTS_MAP)) {
                expect(headerServiceMock.registerLazyCmp).toHaveBeenCalledWith(key, HEADER_COMPONENTS_MAP[key]);
            }

            expect(headerServiceMock.setHighlightedProduct).toHaveBeenCalled();
            expect(accountMenuOnboardingServiceMock.init).toHaveBeenCalled();
        }));

        it('should add header if enabled', fakeAsync(() => {
            dslServiceMock.evaluateExpression.withArgs('condition').and.returnValue(of(true));
            dslServiceMock.evaluateExpression.withArgs('disabled').and.returnValue(of(true));
            service.onFeatureInit();
            headerConfigMock.whenReady.next();
            tick();

            expect(dslServiceMock.evaluateExpression).toHaveBeenCalledWith('condition');
            expect(headerServiceMock.show).toHaveBeenCalledWith(['header_sections']);
            expect(htmlNodeMock.toggleVisibilityClass).toHaveBeenCalledWith('header', true);
        }));

        it('should remove header if not enabled', fakeAsync(() => {
            dslServiceMock.evaluateExpression.withArgs('condition').and.returnValue(of(false));
            dslServiceMock.evaluateExpression.withArgs('disabled').and.returnValue(of(true));
            service.onFeatureInit();
            headerConfigMock.whenReady.next();
            tick();

            expect(dslServiceMock.evaluateExpression).toHaveBeenCalledWith('condition');
            expect(headerServiceMock.hide).toHaveBeenCalled();
            expect(htmlNodeMock.toggleVisibilityClass).toHaveBeenCalledWith('header', false);
        }));

        it('should add items to header top items slot', fakeAsync(() => {
            dslServiceMock.evaluateContent.and.returnValue(of([{ type: 'component1' }]));
            headerServiceMock.getLazyComponent.and.returnValue(Promise.resolve(Cmp));
            service.onFeatureInit();
            headerConfigMock.whenReady.next();
            tick();

            expect(dynamicLayoutServiceMock.addComponent).toHaveBeenCalledWith(SlotName.HeaderTopItems, Cmp, null);
        }));
    });
});
