import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkThemeTopRunscorerComponent } from './dark-theme-top-runscorer.component';

describe('DarkThemeTopRunscorerComponent', () => {
    let component: DarkThemeTopRunscorerComponent;
    let fixture: ComponentFixture<DarkThemeTopRunscorerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DarkThemeTopRunscorerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DarkThemeTopRunscorerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
