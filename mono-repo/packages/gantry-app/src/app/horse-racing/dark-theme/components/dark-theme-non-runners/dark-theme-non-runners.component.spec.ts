import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { EventFeedUrlService } from '../../../../common/services/event-feed-url.service';
import { NonRunnersResult } from '../../../models/data-feed/non-runners.model';
import { NonRunnersService } from '../../../services/data-feed/non-runners.service';
import { DarkThemeNonRunnersComponent } from './dark-theme-non-runners.component';

describe('DarkThemeNonRunnersComponent', () => {
    let component: DarkThemeNonRunnersComponent;
    let fixture: ComponentFixture<DarkThemeNonRunnersComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DarkThemeNonRunnersComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [RouterTestingModule],
            providers: [
                MockContext.providers,
                NonRunnersService,
                EventFeedUrlService,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        fixture = TestBed.createComponent(DarkThemeNonRunnersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("Page shouldn't broke because of unexpected DF data", () => {
        expect(component.prepareNonRunnersPageResult(new NonRunnersResult())).not.toBeUndefined();
    });
});
