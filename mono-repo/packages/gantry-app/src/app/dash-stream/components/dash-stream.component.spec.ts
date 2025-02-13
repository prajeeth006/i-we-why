import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DashStreamComponent } from './dash-stream.component';

describe('DashStreamComponent', () => {
    let component: DashStreamComponent;
    let fixture: ComponentFixture<DashStreamComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DashStreamComponent],
            imports: [HttpClientTestingModule, RouterTestingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(DashStreamComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
