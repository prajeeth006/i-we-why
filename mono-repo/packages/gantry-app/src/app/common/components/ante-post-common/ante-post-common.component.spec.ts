import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntePostCommonComponent } from './ante-post-common.component';

describe('AntePostCommonComponent', () => {
    let component: AntePostCommonComponent;
    let fixture: ComponentFixture<AntePostCommonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [],
            declarations: [AntePostCommonComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AntePostCommonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
