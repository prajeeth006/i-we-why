import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { ActivatedRouteMock } from '../../../core/test/activated-route.mock';
import { HtmlNodeMock } from '../../../core/test/browser/html-node.mock';
import { Renderer2Mock } from '../../../core/test/renderer2.mock';
import { RouterMock } from '../../../core/test/router.mock';
import { NavigationLayoutCashierComponent } from '../src/navigation-layout-cashier.component';

describe('NavigationLayoutCashierComponent', () => {
    let fixture: ComponentFixture<NavigationLayoutCashierComponent>;
    let component: NavigationLayoutCashierComponent;
    let activatedRouteMock: ActivatedRouteMock;
    let htmlNodeMock: HtmlNodeMock;

    beforeEach(() => {
        MockContext.useMock(Renderer2Mock);
        activatedRouteMock = MockContext.useMock(ActivatedRouteMock);
        MockContext.useMock(RouterMock);
        htmlNodeMock = MockContext.useMock(HtmlNodeMock);

        TestBed.overrideComponent(NavigationLayoutCashierComponent, {
            set: {
                imports: [],
                schemas: [NO_ERRORS_SCHEMA],
                providers: [MockContext.providers],
            },
        });

        activatedRouteMock.snapshot.params['page'] = 'cashier';
    });

    function initComponent() {
        fixture = TestBed.createComponent(NavigationLayoutCashierComponent);
        component = fixture.componentInstance;
    }

    it('should init successfully', () => {
        initComponent();
        component.ngOnInit();
        expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith('has-cashier-iframe', true);
        expect(component.page).toBe('cashier');
    });

    it('should destroy successfully', () => {
        initComponent();
        component.ngOnDestroy();
        expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith('has-cashier-iframe', false);
    });

    it('should hide splash screen', () => {
        initComponent();
        component.hideLoadingIndicator();
        expect(component.showLoadingIndicator).toBeFalse();
    });

    it('should update page property on route params change', () => {
        initComponent();
        component.ngOnInit();
        expect(component.page).toBe('cashier');
        activatedRouteMock.params.next({ page: 'test' });
        expect(component.page).toBe('test');
    });
});
