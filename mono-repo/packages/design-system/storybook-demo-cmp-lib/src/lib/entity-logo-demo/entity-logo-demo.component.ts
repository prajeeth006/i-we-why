import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export enum DsEntityLogoDemoVariant {
    WithBackground = 'with-background',
    WithoutBackground = 'without-background',
}

export enum DsEntityLogoDemoSize {
    XSmall = 'x-small',
    Small = 'small',
    Medium = 'medium',
    Large = 'large',
}
@Component({
    selector: 'ds-entity-logo-demo',
    standalone: true,
    template: ` <ng-content /> `,
    styleUrl: './entity-logo-demo.component.scss',
    host: { '[class]': 'hostClass' },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsEntityLogoDemo {
    @Input() size: DsEntityLogoDemoSize = DsEntityLogoDemoSize.Medium;
    @Input() variant: DsEntityLogoDemoVariant = DsEntityLogoDemoVariant.WithoutBackground;

    get hostClass() {
        return `shared ${this.variant} ${this.size}`;
    }
}
