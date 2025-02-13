import { BehaviorSubject, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

/** @experimental */
export class LazyServiceProviderBase {
    private loaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    private _isReady: boolean;
    get isReady(): any {
        return this._isReady;
    }

    private _inner: any;
    get inner(): any {
        if (!this._inner) {
            throw new Error('Trying to access lazy provider member before they are initialized. Subscribe to whenReady to fix this issue.');
        }
        return this._inner;
    }
    /** Indicates when service provider is available for usage. */
    get whenReady(): Observable<void> {
        return this.loaded.pipe(
            first((ready) => ready),
            map(() => {}),
        );
    }

    /** Sets the desired provider. Only for vanilla internal usage. */
    set(provider: any) {
        this._inner = provider;
        this._isReady = true;
        this.loaded.next(true);
    }
}
