import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { GantryCommonModule } from '../../../../../common/gantry-common.module';
import { ManualGreyhoundRacingTemplateService } from '../../services/manual-greyhound-racing-template.service';
import { ManualRunnersComponent } from './manual-runners.component';

describe('ManualRunnersComponent', () => {
    let component: ManualRunnersComponent;
    let fixture: ComponentFixture<ManualRunnersComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, GantryCommonModule],
            declarations: [ManualRunnersComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                MockContext.providers,
                ManualGreyhoundRacingTemplateService,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ManualRunnersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
