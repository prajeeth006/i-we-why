import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { BehaviorSubject, Observable, fromEvent, map } from 'rxjs';

import { ResizeObserverService } from '../resize-observer.service';
import { WindowEvent } from '../window/window-ref.service';
import { WINDOW } from '../window/window.token';
import { DeviceConfig } from './device.client-config';

/**
 * @whatItDoes Provides information about current device
 *
 * @description
 *
 * Use to check device type and orientation.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class DeviceService {
    readonly #window = inject(WINDOW);

    readonly isMobileWidth = computed(() => this.windowRect().width < 768);
    readonly windowWidth = computed(() => this.windowRect().width);
    private readonly query = this.#window.matchMedia('(orientation: landscape)');
    private readonly orientationEvents = new BehaviorSubject<'landscape' | 'portrait'>(this.getOrientation());
    private propsCache = new Map<string, any>();
    private readonly _windowRect = signal({ width: 0, height: 0 });
    readonly windowRect = this._windowRect.asReadonly();
    readonly visualViewport = toSignal(
        fromEvent(this.#window.visualViewport!, 'resize').pipe(
            map(() => ({
                width: this.#window.visualViewport!.width,
                height: this.#window.visualViewport!.height,
            })),
        ),
        {
            initialValue: {
                width: this.#window.visualViewport!.width,
                height: this.#window.visualViewport!.height,
            },
        },
    );
    readonly visualViewportWidth = computed(() => this.visualViewport().width);
    readonly visualViewportHeight = computed(() => this.visualViewport().height);

    constructor(
        private deviceConfig: DeviceConfig,
        private resizeObserver: ResizeObserverService,
    ) {
        this.query.addEventListener(WindowEvent.Change, () => this.onOrientationChange());

        this.resizeObserver
            .observe(globalThis.document.documentElement)
            .pipe(takeUntilDestroyed())
            .subscribe(({ contentBoxSize }) =>
                this._windowRect.set({ width: contentBoxSize[0]?.inlineSize || 0, height: contentBoxSize[0]?.blockSize || 0 }),
            );
    }

    get deviceType(): string {
        if (!this.isMobile) {
            return 'desktop';
        }
        if (this.isTablet) {
            return 'tablet';
        }
        return 'phone';
    }

    get orientation(): Observable<'landscape' | 'portrait'> {
        return this.orientationEvents.asObservable();
    }

    get currentOrientation(): string {
        return this.orientationEvents.value;
    }

    get isAndroid(): boolean {
        return this.cache('isAndroid', () => this.deviceConfig.isAndroid);
    }

    get isiOS(): boolean {
        return this.cache('isiOS', () => this.deviceConfig.isIOS);
    }

    get isChrome(): boolean {
        return this.cache('isChrome', () => /Chrome/g.test(this.#window.navigator.userAgent));
    }

    get isNexus(): boolean {
        return this.cache('isNexus', () => /Nexus/g.test(this.#window.navigator.userAgent));
    }

    get isMobile(): boolean {
        return this.cache('isMobile', () => this.deviceConfig.isMobile);
    }

    get isMobilePhone(): boolean {
        return this.cache('isMobilePhone', () => this.deviceConfig.isMobilePhone);
    }

    get isTouch(): boolean {
        return this.cache('isTouch', () => this.deviceConfig.isTouch);
    }

    get isTablet(): boolean {
        return this.cache('isTablet', () => this.deviceConfig.isTablet);
    }

    get isRobot(): boolean {
        return this.cache('isRobot', () => this.deviceConfig.isRobot);
    }

    get cpuMaxFrequency(): string | undefined {
        return this.cache('cpuMaxFrequency', () => this.deviceConfig.cpuMaxFrequency);
    }

    get totalRam(): string | undefined {
        return this.cache('totalRam', () => this.deviceConfig.totalRam);
    }

    get cpuCores(): string | undefined {
        return this.cache('cpuCores', () => this.deviceConfig.cpuCores);
    }

    get model(): string | undefined {
        return this.cache('model', () => this.deviceConfig.model);
    }

    get osName(): string {
        return this.cache('oSName', () => this.deviceConfig.osName);
    }

    get osVersion(): string {
        return this.cache('oSVersion', () => this.deviceConfig.osVersion);
    }

    get vendor(): string {
        return this.cache('vendor', () => this.deviceConfig.vendor);
    }

    get displayWidth(): string | undefined {
        return this.cache('displayWidth', () => this.deviceConfig.displayWidth);
    }

    get displayHeight(): string | undefined {
        return this.cache('displayHeight', () => this.deviceConfig.displayHeight);
    }

    getCapability(key: string): string | undefined {
        return this.deviceConfig?.properties[key];
    }

    private onOrientationChange() {
        const newOrientation = this.getOrientation();
        if (newOrientation !== this.currentOrientation) {
            this.orientationEvents.next(newOrientation);
        }
    }

    private getOrientation(): 'landscape' | 'portrait' {
        return this.query.matches ? 'landscape' : 'portrait';
    }

    private cache<T>(key: string, fn: () => T): T {
        if (this.propsCache.has(key)) {
            return this.propsCache.get(key);
        }

        const value = fn();
        this.propsCache.set(key, value);

        return value;
    }
}
