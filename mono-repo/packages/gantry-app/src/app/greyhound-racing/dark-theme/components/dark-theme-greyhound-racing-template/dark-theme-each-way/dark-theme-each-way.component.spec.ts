import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RacingConfigurationService } from '../../../../../common/services/racing-configuration/racing-configuration.service';
import { DarkThemeEachWayComponent } from './dark-theme-each-way.component';

describe('DarkThemeEachWayComponent', () => {
    let component: DarkThemeEachWayComponent;
    let fixture: ComponentFixture<DarkThemeEachWayComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DarkThemeEachWayComponent],
            imports: [],
            providers: [RacingConfigurationService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        fixture = TestBed.createComponent(DarkThemeEachWayComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
