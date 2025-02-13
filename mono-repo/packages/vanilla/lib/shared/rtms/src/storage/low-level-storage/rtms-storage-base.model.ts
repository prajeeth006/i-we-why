import { Observable } from 'rxjs';

export abstract class RtmsLayerStorageBase {
    abstract get<T>(key: string): Observable<T>;
    abstract set<T>(key: string, value: T): void;
    abstract remove(key: string): void;
}
