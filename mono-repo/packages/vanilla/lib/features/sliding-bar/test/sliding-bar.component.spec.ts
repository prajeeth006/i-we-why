import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WINDOW } from '@frontend/vanilla/core';
import { SlidingBarComponent } from '@frontend/vanilla/features/sliding-bar';
import { MockContext } from 'moxxi';

import { DeviceServiceMock } from '../../../core/test/browser/device.mock';
import { MediaQueryServiceMock } from '../../../core/test/browser/media-query.service.mock';
import { Renderer2Mock } from '../../../core/test/renderer2.mock';
import { AnimationBuilderMock } from './animation-builder.mock';

describe('SlidingBarComponent', () => {
    let fixture: ComponentFixture<SlidingBarComponent>;
    let component: SlidingBarComponent;

    beforeEach(() => {
        MockContext.useMock(Renderer2Mock);
        MockContext.useMock(AnimationBuilderMock);
        MockContext.useMock(MediaQueryServiceMock);
        MockContext.useMock(DeviceServiceMock);

        TestBed.overrideComponent(SlidingBarComponent, {
            set: {
                schemas: [NO_ERRORS_SCHEMA],
                providers: [MockContext.providers],
                imports: [],
            },
        });
        TestBed.inject(WINDOW);
    });

    function initComponent() {
        fixture = TestBed.createComponent(SlidingBarComponent);
        component = fixture.componentInstance;
    }

    it('should create component successfully, properties and functions are defined', () => {
        initComponent();
        expect(component.ngOnInit).toBeDefined();
        expect(component.ngOnDestroy).toBeDefined();
        expect(component.ngAfterViewInit).toBeDefined();
        expect(component.next).toBeDefined();
        expect(component.prev).toBeDefined();
        expect(component.mobileView).toBeDefined();
    });
});
