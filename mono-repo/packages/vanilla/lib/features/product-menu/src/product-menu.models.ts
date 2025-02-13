import { AnimateOverlayFrom } from '@frontend/vanilla/shared/overlay-factory';

export interface ProductMenuToggleEvent {
    open?: boolean;
    options?: ProductMenuToggleOptions;
}

export interface ProductMenuToggleOptions {
    initialTab?: string;
    animateFrom?: AnimateOverlayFrom;
    disableCloseAnimation?: boolean;
}
