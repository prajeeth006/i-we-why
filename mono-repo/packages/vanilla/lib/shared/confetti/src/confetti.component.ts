import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild, ViewEncapsulation, inject } from '@angular/core';

import { WINDOW, WebWorkerService, WorkerType } from '@frontend/vanilla/core';
import { Options, create } from 'canvas-confetti';

@Component({
    selector: 'vn-confetti',
    template: '<canvas id="canvas-confetti" #canvasConfetti></canvas>',
    styleUrls: ['confetti.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
})
export class ConfettiComponent implements AfterViewInit, OnDestroy {
    @Input() confettiOptions?: Options = {};
    @ViewChild('canvasConfetti') canvasConfetti: ElementRef<HTMLCanvasElement>;

    private webWorkerService = inject(WebWorkerService);
    readonly #window = inject(WINDOW);

    ngAfterViewInit() {
        this.canvasConfetti.nativeElement.width = this.#window.innerWidth;
        this.canvasConfetti.nativeElement.height = this.#window.innerHeight;

        create(this.canvasConfetti.nativeElement)({
            particleCount: 60,
            angle: 90,
            scalar: 1.9,
            spread: 60,
            origin: { x: 0.5, y: 0.5 },
            colors: ['#B0812D', '#F0E5BE', '#C09A4C', '#E6D391', '#F7F2DE', 'CC9432'],
            gravity: 3,
            startVelocity: 50,
            ticks: 100,
            ...this.confettiOptions,
        });

        this.webWorkerService.createWorker(WorkerType.ConfettiTimeout, { timeout: 1500 }, () => {
            if (this.canvasConfetti) {
                this.canvasConfetti.nativeElement.parentNode?.removeChild(this.canvasConfetti.nativeElement);
            }

            this.webWorkerService.removeWorker(WorkerType.ConfettiTimeout);
        });
    }

    ngOnDestroy() {
        this.webWorkerService.removeWorker(WorkerType.ConfettiTimeout);
    }
}
