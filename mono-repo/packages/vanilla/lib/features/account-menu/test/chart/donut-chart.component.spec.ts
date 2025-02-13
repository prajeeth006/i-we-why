import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DonutChartComponent, DonutChartSegmentInput } from '../../src/chart/donut-chart.component';

@Component({
    standalone: true,
    template: '<vn-donut-chart [segments]="segments" />',
})
export class TestHostComponent {
    segments: DonutChartSegmentInput[];
}

describe('DonutChartComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(() => {
        TestBed.overrideComponent(TestHostComponent, {
            set: {
                imports: [DonutChartComponent],
            },
        });

        fixture = TestBed.createComponent(TestHostComponent);
    });

    it('should render svg', () => {
        fixture.componentInstance.segments = [
            { percent: 20, class: 'c1' },
            { percent: 80, class: 'c2' },
        ];
        fixture.detectChanges();

        const element = fixture.debugElement.query(By.directive(DonutChartComponent)).nativeElement;

        const segments: SVGCircleElement[] = element.querySelectorAll('.vn-donut-segment');
        const s1 = segments[0];
        expect(s1).toHaveAttr('stroke-dasharray', '20 80');
        expect(s1).toHaveAttr('stroke-dashoffset', '25');
        expect(s1).toHaveClass('c1');
        const s2 = segments[1];
        expect(s2).toHaveAttr('stroke-dasharray', '80 20');
        expect(s2).toHaveAttr('stroke-dashoffset', '5');
        expect(s2).toHaveClass('c2');
    });
});
