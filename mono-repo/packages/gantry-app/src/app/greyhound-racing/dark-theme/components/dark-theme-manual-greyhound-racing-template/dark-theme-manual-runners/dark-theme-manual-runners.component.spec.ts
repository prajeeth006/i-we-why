import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { GantryCommonModule } from '../../../../../common/gantry-common.module';
import { DarkThemeManualRunnersComponent } from './dark-theme-manual-runners.component';

describe('DarkThemeManualRunnersComponent', () => {
    let component: DarkThemeManualRunnersComponent;
    let fixture: ComponentFixture<DarkThemeManualRunnersComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [GantryCommonModule, RouterTestingModule],
            declarations: [DarkThemeManualRunnersComponent],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        fixture = TestBed.createComponent(DarkThemeManualRunnersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
