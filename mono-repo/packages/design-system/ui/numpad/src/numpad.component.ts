import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, TemplateRef, ViewEncapsulation, booleanAttribute, contentChild, input, output } from '@angular/core';

@Component({
    selector: 'ds-numpad',
    imports: [NgTemplateOutlet],
    template: `
        <div class="ds-numpad-grid">
            <button class="ds-numpad-btn" (click)="onTap('1')">1</button>
            <button class="ds-numpad-btn" (click)="onTap('2')">2</button>
            <button class="ds-numpad-btn" (click)="onTap('3')">3</button>
            <button class="ds-numpad-btn" data-testid="ds-numpad-remove" (click)="onRemove()" [attr.aria-label]="removeScreenReaderText()">
                <ng-container *ngTemplateOutlet="deleteSlot() || defaultDelete" />
            </button>

            <button class="ds-numpad-btn" (click)="onTap('4')">4</button>
            <button class="ds-numpad-btn" (click)="onTap('5')">5</button>
            <button class="ds-numpad-btn" (click)="onTap('6')">6</button>
            <button class="ds-numpad-btn ds-numpad-ok" (click)="onOk()">
                {{ okText() }}
            </button>

            <button class="ds-numpad-btn" (click)="onTap('7')">7</button>
            <button class="ds-numpad-btn" (click)="onTap('8')">8</button>
            <button class="ds-numpad-btn" (click)="onTap('9')">9</button>

            <button class="ds-numpad-btn ds-numpad-zero" (click)="onTap('0')">0</button>
            <button class="ds-numpad-btn" data-testid="ds-numpad-separator" (click)="onTap(numberSeparator())">
                {{ numberSeparator() }}
            </button>
        </div>

        <ng-template #defaultDelete>
            <svg
                class="ds-numpad-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                focusable="false"
                aria-hidden="true">
                <path
                    d="M7.45346 6.25304C7.24975 6.04629 7.24975 5.7111 7.45346 5.50434C7.65727 5.29758 7.9876 5.29758 8.19132 5.50434L9.91304 7.25134L11.6347 5.50434C11.8384 5.29758 12.1687 5.29758 12.3725 5.50434C12.5763 5.71105 12.5763 6.04629 12.3725 6.25304L10.6508 8L12.3725 9.747C12.5763 9.95371 12.5763 10.2889 12.3725 10.4957C12.1687 10.7024 11.8384 10.7024 11.6347 10.4957L9.91304 8.74871L8.19132 10.4957C7.9876 10.7024 7.65727 10.7024 7.45355 10.4957C7.24975 10.2889 7.24975 9.95371 7.45355 9.74696L9.17519 8.00004L7.45346 6.25304Z"
                    fill="currentColor" />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M5.3018 2.62023L0 8L5.3018 13.3798C5.69319 13.7769 6.22401 14 6.77751 14H13.913C15.0656 14 16 13.0519 16 11.8824V4.11765C16 2.9481 15.0656 2 13.913 2H6.77751C6.22401 2 5.69319 2.22313 5.3018 2.62023ZM13.913 13.0824H6.77751C6.46382 13.0824 6.16304 12.9559 5.94124 12.7309L1.27896 8L5.94124 3.26911C6.16304 3.04409 6.46382 2.91764 6.77751 2.91764H13.913C14.5662 2.91764 15.0956 3.45489 15.0956 4.11765V11.8824C15.0956 12.5451 14.5662 13.0824 13.913 13.0824Z"
                    fill="currentColor" />
            </svg>
        </ng-template>
    `,
    host: {
        'class': 'ds-numpad',
        '[class.ds-numpad-inverse]': 'inverse()',
    },
    styleUrl: 'numpad.component.scss',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsNumpad {
    inverse = input(false, { transform: booleanAttribute });

    numberSeparator = input.required<string>();
    okText = input.required<string>();

    removeScreenReaderText = input<string>('remove character');

    readonly tap = output<string>();
    readonly remove = output<true>();
    readonly ok = output<true>();

    deleteSlot = contentChild('dsNumpadDelete', { read: TemplateRef });

    onTap(key: string) {
        this.tap.emit(key);
    }

    onRemove() {
        this.remove.emit(true);
    }

    onOk() {
        this.ok.emit(true);
    }
}
