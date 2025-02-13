import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { CryptoResourceService } from './crypto-resource.service';

/**
 * @description This service provides means to encrypt/decrypt data with the configured secret key for a given purpose.
 * See: {@link https://admin.dynacon.prod.env.works/services/198137/features/303108}
 *
 * @howToUse
 * ```
 * const encryptedData = await cryptoService.encrypt(data, purpose);
 * const decryptedData = await cryptoService.decrypt(encryptedData, purpose);
 * ```
 *
 * @experimental
 */
@Injectable({
    providedIn: 'root',
})
export class CryptoService {
    constructor(private cryptoResourceService: CryptoResourceService) {}

    /**
     * @param data Value to encrypt.
     * @param purpose Encryption identifier (e.g. `login`).
     * See: {@link https://admin.dynacon.prod.env.works/services/198137/features/303108/keys/303112/valuematrix}
     */
    encrypt(data: string, purpose: string): Observable<string> {
        return this.cryptoResourceService.encrypt(data, purpose);
    }

    /**
     * @param value Encrypted value.
     * @param purpose Decryption identifier (e.g. `login`).
     * See: {@link https://admin.dynacon.prod.env.works/services/198137/features/303108/keys/303112/valuematrix}
     */
    decrypt(value: string, purpose: string): Observable<string> {
        return this.cryptoResourceService.decrypt(value, purpose);
    }
}
