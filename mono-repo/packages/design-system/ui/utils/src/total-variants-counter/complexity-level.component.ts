import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

interface ComplexityLevel {
    level: string;
    color: string;
    score: number;
    description: string;
}

@Component({
    selector: 'ds-complexity-rating',
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="complexity-container" [ngClass]="'color-' + complexity.level.toLowerCase()">
            <div class="level-info">
                <span class="level-label" [ngClass]="'color-' + complexity.level.toLowerCase()">
                    {{ complexity.level }}
                </span>
                <div class="level-segments">
                    <div class="level-segment" [class.active]="complexity.score >= 1" [ngClass]="{ 'color-segment': complexity.score >= 1 }"></div>
                    <div class="level-segment" [class.active]="complexity.score >= 2" [ngClass]="{ 'color-segment': complexity.score >= 2 }"></div>
                    <div class="level-segment" [class.active]="complexity.score >= 3" [ngClass]="{ 'color-segment': complexity.score >= 3 }"></div>
                </div>
                <span
                    class="variant-count"
                    [ngClass]="'color-' + complexity.level.toLowerCase()"
                    (mouseenter)="showPopover()"
                    (mouseleave)="hidePopover()">
                    {{ totalVariants }} variants
                    <span class="arrow" [class.rotate]="isPopoverVisible">▼</span>
                </span>
            </div>
            <p class="description">{{ complexity.description }}</p>

            <div class="variants-popover" [class.show]="isPopoverVisible">
                <div class="popover-content">
                    @if (variantOptions.length) {
                        <div class="section">
                            <div class="section-title">Variants ({{ variantOptions.length }})</div>
                            <div class="variants-grid">
                                @for (variant of variantOptions; track variant) {
                                    <div class="variant-tag" [ngClass]="'border-' + complexity.level.toLowerCase()">
                                        {{ variant }}
                                    </div>
                                }
                            </div>
                        </div>
                    }

                    @if (sizeOptions.length) {
                        <div class="section">
                            <div class="section-title">Sizes ({{ sizeOptions.length }})</div>
                            <div class="variants-grid">
                                @for (size of sizeOptions; track size) {
                                    <div class="variant-tag" [ngClass]="'border-' + complexity.level.toLowerCase()">
                                        {{ size }}
                                    </div>
                                }
                            </div>
                        </div>
                    }

                    @if (kindOptions.length) {
                        <div class="section">
                            <div class="section-title">Kind ({{ kindOptions.length }})</div>
                            <div class="variants-grid">
                                @for (kind of kindOptions; track kind) {
                                    <div class="variant-tag" [ngClass]="'border-' + complexity.level.toLowerCase()">
                                        {{ kind }}
                                    </div>
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    `,
    styleUrls: ['./complexity-rating.component.scss'],
})
export class DsComplexityRatingComponent {
    @Input() totalVariants = 0;
    @Input() variantOptions: string[] = [];
    @Input() sizeOptions: string[] = [];
    @Input() kindOptions: string[] = [];

    complexity!: ComplexityLevel;
    isPopoverVisible = false;

    ngOnInit() {
        this.complexity = this.getComplexityLevel(this.totalVariants);
    }

    showPopover() {
        this.isPopoverVisible = true;
    }

    hidePopover() {
        this.isPopoverVisible = false;
    }

    COMPLEXITY_CONFIG = {
        simple: {
            threshold: 10,
            level: 'Simple',
            color: '#10B981',
            score: 1,
            description: 'Basic component with minimal variant complexity.',
        },
        moderate: {
            threshold: 30,
            level: 'Moderate',
            color: '#3B82F6',
            score: 2,
            description: 'Component with good flexibility.',
        },
        complex: {
            level: 'Complex',
            color: '#F59E0B',
            score: 3,
            description: 'Highly flexible component with numerous configurations.',
        },
    } as const;

    getComplexityLevel(variants: number): ComplexityLevel {
        if (variants <= this.COMPLEXITY_CONFIG.simple.threshold) {
            return this.COMPLEXITY_CONFIG.simple;
        }

        if (variants <= this.COMPLEXITY_CONFIG.moderate.threshold) {
            return this.COMPLEXITY_CONFIG.moderate;
        }

        return this.COMPLEXITY_CONFIG.complex;
    }
}
