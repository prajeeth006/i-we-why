import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SwipeDirection, ToastrComponent } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';
import { ToastrModule } from 'ngx-toastr';

import { ToastPackageMock } from '../ngx-toastr.mock';

describe('ToastrComponent', () => {
    let component: ToastrComponent;
    let fixture: ComponentFixture<ToastrComponent>;

    beforeEach(() => {
        MockContext.useMock(ToastPackageMock);
        TestBed.configureTestingModule({
            providers: [MockContext.providers],
            imports: [BrowserAnimationsModule, ToastrModule.forRoot(), ToastrComponent],
            schemas: [NO_ERRORS_SCHEMA],
        });

        fixture = TestBed.createComponent(ToastrComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe('onSwipeRight', () => {
        it('should swiped right and remove toastr', fakeAsync(() => {
            spyOn(component, 'remove');

            component.onSwipe(SwipeDirection.Right);

            expect(component.state).toEqual({ value: 'removed', params: { easeTime: 300, easing: 'ease-in' } });

            tick(350);

            expect(component.remove).toHaveBeenCalled();
        }));
    });
});
