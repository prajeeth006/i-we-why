import { FocusMonitor } from '@angular/cdk/a11y';
import { NgTemplateOutlet } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    ContentChildren,
    DestroyRef,
    ElementRef,
    EventEmitter,
    Injector,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    Output,
    QueryList,
    Renderer2,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    ViewChildren,
    ViewEncapsulation,
    booleanAttribute,
    computed,
    effect,
    inject,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { rxHostPressedListener } from '@frontend/ui/rx-host-listener';

import { SEGMENTED_CONTROL_OPTIONS_TOKEN } from './segmented-control.token';

@Component({
    selector: 'ds-segmented-option',
    template: ` <ng-content /> `,
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsSegmentedOption {
    @Input({ required: true }) name!: string;
    @Input() title = '';

    @ContentChild('dsTemplate') customTemplate?: TemplateRef<any>;

    selected = signal(false);
    @Output() selectOption = new EventEmitter<string>();
    private destroyRef = inject(DestroyRef);

    public focusVisible = signal(false);
    public focused = signal(false);
    public tabIndex = signal(-1);

    constructor() {
        rxHostPressedListener()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.selectOption.emit(this.name));
    }

    setTabIndex(index: number) {
        this.tabIndex.set(index);
    }

    setFocused(focused: boolean) {
        this.focused.set(focused);
    }

    setFocusVisible(visible: boolean) {
        this.focusVisible.set(visible);
    }
}

@Component({
    selector: 'ds-segmented-control',
    templateUrl: 'segmented-control.component.html',
    styleUrls: ['./segmented-control.component.scss'],
    host: {
        class: `ds-segmented-control`,
    },
    imports: [NgTemplateOutlet],
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsSegmentedControl implements AfterViewInit, OnChanges, OnDestroy {
    private controlOptions = inject(SEGMENTED_CONTROL_OPTIONS_TOKEN);
    private renderer = inject(Renderer2);
    private injector = inject(Injector);
    private ngZone = inject(NgZone);
    private _focusMonitor = inject(FocusMonitor);

    @Input({ transform: booleanAttribute }) fullWidth: boolean = this.controlOptions.fullWidth;
    @Input() roleType: 'radiogroup' | 'tablist' = 'tablist'; // Default is tablist
    @Input({ transform: booleanAttribute }) twoLineTruncation = false;
    @Input() activeOption = '';
    @Output() activeOptionChange = new EventEmitter<string>();
    @Input({ transform: booleanAttribute }) inverse = false;

    _activeOption = signal('');

    // TODO: convert to signal queries when we have Angular v17.3 in monorepo
    protected options = signal<DsSegmentedOption[]>([]);
    @ViewChildren('tabOption') tabLabels?: QueryList<ElementRef>;
    @ContentChildren(DsSegmentedOption) set optionList(options: QueryList<DsSegmentedOption>) {
        this.options.set(options?.toArray() || []);
        // when we update options, we want to make sure we still have a selection option
        this._activateSelectedOption();
    }

    @ViewChild('scContainer', { static: true }) scContainer!: ElementRef<HTMLDivElement>;

    protected isReady = signal(false);

    selectedOption = computed(() => this.options().find((x) => x.selected()) ?? undefined);

    ngOnChanges(changes: SimpleChanges) {
        if (changes['activeOption'] && changes['activeOption'].currentValue !== changes['activeOption'].previousValue) {
            this._activeOption.set(this.activeOption);
            this.selectOption(this.activeOption);
        }
    }

    ngAfterViewInit(): void {
        if (this.tabLabels) {
            this.tabLabels.forEach((option, index) => {
                this._focusMonitor.monitor(option.nativeElement, true).subscribe((focusOrigin) => {
                    if (focusOrigin === 'keyboard' || focusOrigin === 'program') {
                        this.options()?.[index]?.setFocusVisible(true);
                        this.options()?.[index]?.setFocused(true);
                    } else if (!focusOrigin && !(this.options()[index] === undefined)) {
                        this.options()?.[index]?.setFocusVisible(false);
                        this.options()?.[index]?.setFocused(false);
                    }
                });
            });
        }

        if (this.options()) {
            effect(
                () => {
                    const selectedOption = this.selectedOption();
                    if (selectedOption && this.isReady()) {
                        this._setHighlightWidthAndXPost(selectedOption);
                    }
                },
                { injector: this.injector },
            );
        }

        // we don't want to show the initial animation, but only the subsequent ones
        this.ngZone.runOutsideAngular(() => setTimeout(() => this.isReady.set(true)));
    }
    /**
     * The method which will update the `selected` signal in `ds-segment-option` based on the selected name.
     * @param name Name of the selected option
     * @param emit Whether the output should emit or not
     */

    ngOnDestroy() {
        if (this.tabLabels) {
            this.tabLabels.forEach((option) => this._focusMonitor.stopMonitoring(option));
        }
    }

    selectOption(name: string, event?: Event): void {
        if (name === undefined) {
            return;
        }
        if (event && this._activeOption() === name) {
            // Do nothing if the same option is clicked again
            return;
        }
        this.options().forEach((option) => {
            const isSelected = option.name === name;
            option.selected.set(isSelected);
            option.setTabIndex(isSelected ? 0 : -1);
            if (isSelected) {
                this._setHighlightWidthAndXPost(option);
            }
        });
        this._activeOption.set(name);
        this.activeOptionChange.emit(name);
    }

    /**
     * Synchronizes the options with the active option input.
     * If there is no active segment option, it will select the first one in the list.
     * @private
     */
    private _activateSelectedOption() {
        const selectedOption = this.selectedOption();
        // select the option based on name otherwise select the first one
        if (this.activeOption) {
            this.selectOption(this.activeOption);
        } else if (!selectedOption) {
            this._selectFirstOption();
        }
    }

    /**
     * Select first segment option. This is useful when the activeOption is not provided.
     * @private
     */
    private _selectFirstOption() {
        const options = this.options();
        if (options.length > 0) {
            const firstOption = options[0];
            if (firstOption !== undefined) {
                this.selectOption(firstOption.name);
                // Check if there are other options with the same name and select them too
                options
                    .filter((option) => option.name === firstOption.name && option !== firstOption)
                    .forEach((option) => this.selectOption(option.name));
                // Emit the active option change
                this.activeOptionChange.emit(firstOption.name);
            }
        }
    }

    /**
     * Will get the active segment position in order to show the indicator on the background.
     * @private
     */
    private _setHighlightWidthAndXPost(option: DsSegmentedOption) {
        const el = this.scContainer.nativeElement.querySelector(`#ds-segment-item-${option.name}`);
        if (el) {
            const { offsetWidth, offsetLeft } = el as HTMLDivElement;
            // We update the DOM directly, so we don't have to go through Angular Change Detection
            this.renderer.setProperty(
                this.scContainer.nativeElement,
                'style',
                `--ds-sc-highlight-width: ${offsetWidth}px; --ds-sc-highlight-x-pos: ${offsetLeft}px`,
            );
        }
    }

    onKeydown(event: KeyboardEvent) {
        const { key } = event;
        const options = this.options();
        const currentIndex = options.findIndex((option) => option.focused());
        let newIndex: number | undefined;

        if (key === 'ArrowRight') {
            newIndex = (currentIndex + 1) % options.length;
        } else if (key === 'ArrowLeft') {
            newIndex = (currentIndex - 1 + options.length) % options.length;
        } else if ((key === ' ' || key === 'Enter') && currentIndex !== -1 && options[currentIndex]) {
            this.selectOption(options[currentIndex].name, event);
        }

        if (newIndex !== undefined) {
            event.preventDefault();
            const newOption = options[newIndex];
            if (newOption) {
                this.focusOption(newOption, newIndex);
            }
        }
    }

    focusOption(option: DsSegmentedOption, index: number) {
        const focusOption = this.tabLabels?.get(index);
        if (focusOption) {
            this.options().forEach((opt) => {
                opt.setFocused(false);
                opt.setFocusVisible(false);
            });
            option.setFocused(true);
            option.setFocusVisible(true);
            this._focusMonitor.focusVia(focusOption.nativeElement, 'keyboard');
        }
    }
}
