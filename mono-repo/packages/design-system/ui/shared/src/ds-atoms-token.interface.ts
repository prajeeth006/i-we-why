import { InjectionToken } from '@angular/core';

/**
 * Unique identifier used for retrieving instances of `DsAtoms` from Angular's dependency injection framework.
 */
export const DS_ATOMS = new InjectionToken<string>('ds-atoms');
