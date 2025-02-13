import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogComponent } from '../src/dialog.component';

describe('DialogComponent', () => {
    let fixture: ComponentFixture<DialogComponent>;
    let component: DialogComponent;

    beforeEach(() => {
        TestBed.overrideComponent(DialogComponent, {
            set: {
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(DialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe('close', () => {
        it('should emit event', () => {
            const spy = spyOn(component.onClose, 'next');

            component.close();

            expect(spy).toHaveBeenCalled();
        });
    });
});
