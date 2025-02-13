import { CUSTOM_ELEMENTS_SCHEMA, Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MenuContentItem, MenuDisplayMode, MenuItemCounter, WINDOW } from '@frontend/vanilla/core';
import { MenuItemComponent } from '@frontend/vanilla/features/menus';
import { AuthstateDirective } from '@frontend/vanilla/shared/auth';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { MockContext } from 'moxxi';
import { MockComponent } from 'ng-mocks';
import { firstValueFrom, of } from 'rxjs';

import { TimerServiceMock } from '../../../core/src/browser/timer.mock';
import { CommonMessagesMock } from '../../../core/src/client-config/test/common-messages.mock';
import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { CookieServiceMock } from '../../../core/test';
import { DeviceServiceMock } from '../../../core/test/browser/device.mock';
import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { LoggerMock } from '../../../core/test/languages/logger.mock';
import { MenuActionsServiceMock } from '../../../core/test/menu-actions/menu-actions.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { TooltipsConfigMock } from '../../../shared/tooltips/test/tooltips-content.mock';
import { MenuItemsServiceMock } from '../../account-menu/test/menu-items.mock';
import { IconCustomComponent } from '../../icons/src/icon-fast.component';
import { PopperContentComponent } from '../../popper/src/popper-content.component';

@Component({
    template: ` <vn-menu-item
        [item]="item"
        section="section"
        [linkClass]="linkClass"
        [textClass]="textClass"
        [displayMode]="displayMode"
        (onClick)="clickSpy()"
        [text]="text"
        [description]="description"
        [additionalIcon]="additionalIcon"
        [lazyLoadImage]="lazyLoadImage"
        [processClick]="processClick" />`,
})
class TestHostComponent {
    item: MenuContentItem;
    linkClass: string;
    clickSpy = jasmine.createSpy('test');
    displayMode: MenuDisplayMode;
    text: string;
    additionalIcon: string;
    lazyLoadImage: boolean;
    description: string;
    textClass: string;
    processClick: false | undefined;
}

describe('MenuItemComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let component: MenuItemComponent;
    let menuItemsServiceMock: MenuItemsServiceMock;
    let deviceServiceMock: DeviceServiceMock;
    let tooltipsConfigMock: TooltipsConfigMock;
    let cookieServiceMock: CookieServiceMock;
    let dslServiceMock: DslServiceMock;
    let item: MenuContentItem;
    let counter: MenuItemCounter;

    beforeEach(() => {
        menuItemsServiceMock = MockContext.useMock(MenuItemsServiceMock);
        MockContext.useMock(MenuActionsServiceMock);
        MockContext.useMock(TrackingServiceMock);
        MockContext.useMock(TimerServiceMock);
        deviceServiceMock = MockContext.useMock(DeviceServiceMock);
        tooltipsConfigMock = MockContext.useMock(TooltipsConfigMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);
        MockContext.useMock(CommonMessagesMock);
        MockContext.useMock(UserServiceMock);
        MockContext.useMock(LoggerMock);

        TestBed.configureTestingModule({
            imports: [AuthstateDirective, TrustAsHtmlPipe, MenuItemComponent],
            providers: [MockContext.providers],
            declarations: [TestHostComponent],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
        });

        TestBed.overrideComponent(MenuItemComponent, {
            remove: {
                imports: [IconCustomComponent],
            },
            add: {
                imports: [MockComponent(IconCustomComponent)],
            },
        });
        TestBed.overrideComponent(PopperContentComponent, {
            remove: {
                imports: [IconCustomComponent],
            },
            add: {
                imports: [MockComponent(IconCustomComponent)],
            },
        });

        item = { name: 'item', parameters: {}, resources: {} } as MenuContentItem;
        counter = {} as MenuItemCounter;

        menuItemsServiceMock.getCounter.and.returnValue(counter);
        menuItemsServiceMock.getDescription.and.returnValue(null);
        menuItemsServiceMock.getDescriptionCssClass.and.returnValue(null);

        TestBed.inject(WINDOW);
        fixture = TestBed.createComponent(TestHostComponent);
        fixture.componentInstance.item = item;
        component = fixture.debugElement.query(By.directive(MenuItemComponent)).componentInstance;
    });

    describe('init', () => {
        it('should setup link classes', () => {
            item.class = 'ic';
            fixture.componentInstance.linkClass = 'lc';
            fixture.componentInstance.displayMode = MenuDisplayMode.Svg;

            fixture.detectChanges();

            expect(component.linkClasses).toEqual({ ic: 'true', lc: 'true' });
        });

        it('should renderHtml', () => {
            item.parameters = { 'render-html': 'true' };

            fixture.detectChanges();

            expect(component.renderHtmlText).toBeTrue();
        });

        it('should show tooltip', fakeAsync(() => {
            item.parameters = { 'tooltip': 'test', 'tooltip-class': 'custom-class' };
            tooltipsConfigMock.onboardings.test = { text: 'test tooltip' };
            tooltipsConfigMock.isOnboardingTooltipsEnabled = true;

            fixture.detectChanges();
            tooltipsConfigMock.whenReady.next();
            tick(1000);

            expect(component.tooltipText).toBe('test tooltip');
            expect(component.tooltipClass).toBe('custom-class');
            expect(cookieServiceMock.put).toHaveBeenCalledWith('onbtt', ',test', jasmine.anything());

            cookieServiceMock.get.withArgs('euconsent').and.returnValue('a');
        }));

        it('should additionalIcon', () => {
            fixture.componentInstance.additionalIcon = 'tic';

            fixture.detectChanges();

            const icon = q('.additional-icon');
            expect(icon).toExist();
            expect(icon).toHaveClass('tic');
        });

        it('should not display icon if there is no class', () => {
            fixture.componentInstance.displayMode = MenuDisplayMode.Icon;
            item.class = 'icon-class';

            fixture.detectChanges();

            const icon = q('i');
            expect(icon).toExist();
            expect(icon).toHaveClass('icon-class');
        });

        it('should should apply link-class to link', () => {
            fixture.componentInstance.displayMode = MenuDisplayMode.Icon;
            item.class = 'icon-class';
            item.parameters = { 'link-class': 'linkc' };

            fixture.detectChanges();

            expect(q('i')).toHaveClass('icon-class');
            expect(q('a')).toHaveClass('linkc');
        });

        it('should display custom text', () => {
            item.text = 'txt';
            fixture.componentInstance.textClass = 'cc';
            fixture.componentInstance.text = 'custom';

            fixture.detectChanges();

            expect(q('span')).toHaveText('custom');
            expect(q('span')).toHaveClass('menu-item-txt');
            expect(q('span')).toHaveClass('cc');
        });

        it('should display description', () => {
            item.text = 'txt';
            item.resources['description'] = 'dtxt';

            fixture.detectChanges();

            expect(q('span.menu-item-sub')).toHaveText('dtxt');
        });

        it('should display custom description', () => {
            item.resources['description'] = 'dtxt';
            fixture.componentInstance.description = 'custom';

            fixture.detectChanges();

            expect(q('span.menu-item-sub')).toHaveText('custom');
        });

        it('should display html text', () => {
            item.text = '<p>hi</p>';
            item.parameters['render-html'] = 'true';
            fixture.componentInstance.textClass = 'cc';

            fixture.detectChanges();

            expect(q('span.menu-item-txt').innerHTML).toBe('<p>hi</p>');
            expect(q('span.menu-item-txt')).toHaveClass('cc');
        });

        it('should setup lazy load', () => {
            fixture.componentInstance.lazyLoadImage = true;

            fixture.detectChanges();

            expect(component.lazyLoad).toBeTrue();
        });

        it('should not setup lazy load for bots', () => {
            deviceServiceMock.isRobot = true;
            fixture.componentInstance.lazyLoadImage = true;

            fixture.detectChanges();

            expect(component.lazyLoad).toBeFalse();
        });
    });

    describe('click()', () => {
        it('should set alternative text on click and add disabled class', () => {
            item.parameters['disable-on-click'] = 'true';
            item.parameters['text-on-click'] = 'please wait';
            fixture.detectChanges();

            const event = new Event('click');
            q('a').dispatchEvent(event);
            fixture.detectChanges();

            expect(q('a')).toHaveClass('disabled');
            expect(q('span')).toHaveText('please wait');
        });
    });

    describe('isActive$', () => {
        it('should return true from evaluated DSL condition', fakeAsync(() => {
            item.parameters = { highlighted: 'DSL:' };
            menuItemsServiceMock.isActive.withArgs('section', 'item').and.returnValue(false);
            dslServiceMock.evaluateExpression.withArgs('DSL:').and.returnValue(of(true));

            fixture.detectChanges();

            expect(dslServiceMock.evaluateExpression).toHaveBeenCalledWith('DSL:');
            expectAsync(firstValueFrom(component.isActive$)).toBeResolvedTo(true);
        }));
    });

    describe('isActive', () => {
        it('should return true if item is active', () => {
            menuItemsServiceMock.isActive.withArgs('section', 'item').and.returnValue(true);

            fixture.detectChanges();

            expect(component.isActive).toBeTrue();
        });
    });

    describe('getDescription', () => {
        it('should return value', () => {
            menuItemsServiceMock.getDescription.withArgs('section', 'item').and.returnValue('desc');

            fixture.detectChanges();

            expect(component.itemDescription).toBe('desc');
        });
    });

    describe('getDescriptionCssClass', () => {
        it('should return value', () => {
            menuItemsServiceMock.getDescriptionCssClass.withArgs('section', 'item').and.returnValue('class');

            fixture.detectChanges();

            expect(component.descriptionCssClass).toBe('class');
        });
    });

    function q(selector: string): HTMLElement {
        return fixture.debugElement.query(By.directive(MenuItemComponent)).nativeElement.querySelector(selector);
    }
});
