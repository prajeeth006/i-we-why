import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';

/**
 * @stable
 */
export interface DonutChartSegmentInput {
    class?: string;
    percent: number;
}

interface DonutChartSegment {
    class?: string;
    dashArray: string;
    dashOffset: number;
}

/**
 * @whatItDoes Renders a donut chart with specified segments.
 *
 * @stable
 */
@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'vn-donut-chart',
    templateUrl: 'donut-chart.html',
    styleUrls: ['../../../../../../themepark/themes/whitelabel/components/donut-chart/styles.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DonutChartComponent implements OnChanges {
    @Input() segments: DonutChartSegmentInput[];

    svgSegments: DonutChartSegment[];

    ngOnChanges(changes: SimpleChanges) {
        if (changes.segments && this.segments) {
            let dashOffset = 25;

            this.svgSegments = this.segments.map((s: DonutChartSegmentInput) => {
                const segment: DonutChartSegment = {
                    dashArray: `${s.percent} ${100 - s.percent}`,
                    dashOffset,
                };

                if (s.class) {
                    segment.class = s.class;
                }

                dashOffset -= s.percent;

                return segment;
            });
        }
    }
}
