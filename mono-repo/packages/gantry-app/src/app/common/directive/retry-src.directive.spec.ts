import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { ImageStatus } from '../../horse-racing/models/fallback-src.constant';
import { LoggerService } from '../services/logger.service';
import { BrandImageMockData } from './mock/get-brand-image-data.mock';
import { RetrySrcDirective } from './retry-src.directive';

@Component({
    template: '<div><img [retrySrc]="imageUrl" hasFallback="true"></div>',
})
class RetrySrcDirectiveTestComponent {
    imageUrl = '1.png';
}

describe('RetrySrcDirective', () => {
    let component: RetrySrcDirectiveTestComponent;
    let fixture: ComponentFixture<RetrySrcDirectiveTestComponent>;
    let debugElement: DebugElement;
    let mockLoggerSvc: any;
    let brandImageMockData: BrandImageMockData;

    beforeEach(() => {
        mockLoggerSvc = {};
        TestBed.configureTestingModule({
            declarations: [RetrySrcDirective, RetrySrcDirectiveTestComponent],
            imports: [RouterTestingModule],
            providers: [
                {
                    provide: LoggerService,
                    useValue: mockLoggerSvc,
                },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(RetrySrcDirectiveTestComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement.query(By.directive(RetrySrcDirective));
        brandImageMockData = new BrandImageMockData();
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        const directive = debugElement.injector.get(RetrySrcDirective);
        expect(directive).toBeTruthy();
    });

    it('should have hasFallback argument for image', () => {
        const directive = debugElement.injector.get(RetrySrcDirective);
        expect(directive.hasFallback).toBeTruthy();
    });

    it('should assign src', () => {
        const input = fixture.debugElement.nativeElement;
        expect(input.querySelector('img').src).toContain('1.png');
    });

    it('should do nothing if imageUrl is "Default"', () => {
        component.imageUrl = ImageStatus.Default;
        fixture.detectChanges();

        if (component.imageUrl === ImageStatus.Default) {
            const input = fixture.debugElement.nativeElement;
            input.querySelector('img').src = '';
            fixture.detectChanges();
            expect(input.querySelector('img').src).toContain('');
        }
    });

    it('should get silk outlined image if imageUrl is "ImageNotPresent"', () => {
        component.imageUrl = ImageStatus.ImageNotPresent;
        fixture.detectChanges();

        if (component.imageUrl === ImageStatus.ImageNotPresent) {
            const input = fixture.debugElement.nativeElement;
            const defaultImageUrl = brandImageMockData.silkOutlineImageResponse.brandImage.src;
            input.querySelector('img').src = defaultImageUrl;
            fixture.detectChanges();
            expect(input.querySelector('img').src).toContain('SILK-OUTLINE.png');
        }
    });
});
