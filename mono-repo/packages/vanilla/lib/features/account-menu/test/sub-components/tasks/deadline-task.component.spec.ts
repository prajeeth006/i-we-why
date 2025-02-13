import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { SwipeDirection } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { AccountMenuTaskStatus } from '@frontend/vanilla/shared/account-menu';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { MockContext } from 'moxxi';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';

import { DslServiceMock } from '../../../../../core/test/dsl/dsl.mock';
import { MenuActionsServiceMock } from '../../../../../core/test/menu-actions/menu-actions.mock';
import { KycStatusServiceMock } from '../../../../kyc/test/kyc.mocks';
import { DeadlineTaskComponent } from '../../../src/sub-components/tasks/deadline-task.component';
import { AccountMenuDataServiceMock, AccountMenuTasksServiceMock } from '../../account-menu-data.mock';
import { AccountMenuRouterMock } from '../../account-menu-router.mock';
import { AccountMenuTrackingServiceMock } from '../../account-menu-tracking.mock';
import { AccountMenuServiceMock } from '../../account-menu.mock';

describe('DeadlineTaskComponent', () => {
    let fixture: ComponentFixture<DeadlineTaskComponent>;
    let component: DeadlineTaskComponent;
    let accountMenuTasksServiceMock: AccountMenuTasksServiceMock;
    let dslServiceMock: DslServiceMock;
    let accountMenuDataServiceMock: AccountMenuDataServiceMock;

    beforeEach(() => {
        accountMenuTasksServiceMock = MockContext.useMock(AccountMenuTasksServiceMock);
        MockContext.useMock(KycStatusServiceMock);
        accountMenuDataServiceMock = MockContext.useMock(AccountMenuDataServiceMock);
        MockContext.useMock(AccountMenuServiceMock);
        MockContext.useMock(MenuActionsServiceMock);
        MockContext.useMock(AccountMenuRouterMock);
        MockContext.useMock(AccountMenuTrackingServiceMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);

        TestBed.overrideComponent(DeadlineTaskComponent, {
            set: {
                imports: [CommonModule, TrustAsHtmlPipe, MockComponent(IconCustomComponent)],
                providers: [MockContext.providers],
            },
        });

        fixture = TestBed.createComponent(DeadlineTaskComponent);
        component = fixture.componentInstance;
        component.item = <any>{
            name: 'name',
            parameters: {
                'dsl-countdown-formula': 'test',
                'countdown-threshold': 5,
            },
            resources: {},
            children: [{ name: 'item1' }, { name: 'item2' }],
        };
        accountMenuDataServiceMock.getItem.and.returnValue({
            resources: {
                by: 'testsss',
            },
        });

        fixture.detectChanges();
    });

    describe('swipe', () => {
        it('should hide', () => {
            accountMenuTasksServiceMock.isUrgent.and.returnValue(false);
            component.onSwipe(SwipeDirection.Left, <any>{ name: 'item1' });

            expect(accountMenuTasksServiceMock.hide).toHaveBeenCalledWith([<any>{ name: 'item1' }]);
        });

        it('should not hide when urgent', () => {
            accountMenuTasksServiceMock.isUrgent.and.returnValue(true);
            component.onSwipe(SwipeDirection.Left, <any>{ name: 'item1' });

            expect(accountMenuTasksServiceMock.hide).toHaveBeenCalledTimes(0);
        });
    });

    describe('ngOnInit', () => {
        it('should call refreshItem wit Urgent', fakeAsync(() => {
            const spy = spyOn(component, 'refreshItem');
            dslServiceMock.evaluateExpression.and.returnValue(of(3));
            component.ngOnInit();

            expect(dslServiceMock.evaluateExpression).toHaveBeenCalledWith('test');

            dslServiceMock.evaluateExpression.next();

            tick();

            expect(spy).toHaveBeenCalledWith(3, AccountMenuTaskStatus.URGENT, jasmine.stringMatching(/^testsss/g));
        }));

        it('should call refreshItem wit pending', fakeAsync(() => {
            const spy = spyOn(component, 'refreshItem');
            dslServiceMock.evaluateExpression.and.returnValue(of(7));
            component.ngOnInit();

            expect(dslServiceMock.evaluateExpression).toHaveBeenCalledWith('test');

            dslServiceMock.evaluateExpression.next();

            tick();

            expect(spy).toHaveBeenCalledWith(7, AccountMenuTaskStatus.PENDING, jasmine.stringMatching(/^testsss/g));
        }));

        it("should NOT change task's description if days and hours left are zero", fakeAsync(() => {
            const spy = spyOn(component, 'refreshItem');
            const time = new Date(0, 0, 0, 23);

            jasmine.clock().mockDate(time);
            dslServiceMock.evaluateExpression.and.returnValue(of(0));

            component.ngOnInit();

            dslServiceMock.evaluateExpression.next();
            tick();

            expect(spy).toHaveBeenCalledWith(0, AccountMenuTaskStatus.URGENT, undefined);
        }));
    });
});
