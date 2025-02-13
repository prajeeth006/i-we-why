import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DarkThemeTrapChallengeComponent } from './dark-theme-trap-challenge.component';

describe('DarkThemeTrapChallengeComponent', () => {
    let component: DarkThemeTrapChallengeComponent;
    let fixture: ComponentFixture<DarkThemeTrapChallengeComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DarkThemeTrapChallengeComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [RouterTestingModule],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        fixture = TestBed.createComponent(DarkThemeTrapChallengeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
