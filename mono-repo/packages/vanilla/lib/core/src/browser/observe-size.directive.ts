import { DestroyRef, Directive, ElementRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { map } from 'rxjs';

import { ResizeObserverService } from './resize-observer.service';

@Directive({ selector: '[vnObserveSize]', standalone: true })
export class ObserveSizeDirective implements OnInit {
    private readonly resizeObserver = inject(ResizeObserverService);
    private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    @Input() options?: ResizeObserverOptions;
    @Input() entryAccessor = (entry: ResizeObserverEntry) => ({
        width: entry.contentBoxSize[0]!.inlineSize,
        height: entry.contentBoxSize[0]!.blockSize,
    });
    @Output('vnObserveSize') resize = new EventEmitter<{ width: number; height: number }>();

    private readonly destroyRef = inject(DestroyRef);

    ngOnInit() {
        this.resizeObserver
            .observe(this.elementRef, this.options)
            .pipe(
                map((entry) => this.entryAccessor(entry)),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((rect) => this.resize.emit(rect));
    }
}
