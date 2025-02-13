import { InjectionToken } from '@angular/core';

import KeyboardOptions from 'simple-keyboard';

/**
 * @experimental
 */
export interface WrappedKeyboardOptions extends KeyboardOptions {}

/**
 * @experimental
 */
export const VIRTUAL_KEYBOARD_OPTIONS_PROVIDER = new InjectionToken<VirtualKeyboardOptionsProvider[]>('vn-virtual-keyboard-options-provider');

/**
 * @experimental
 */
export interface VirtualKeyboardOptionsProvider {
    id: string;
    get(): WrappedKeyboardOptions;
}
