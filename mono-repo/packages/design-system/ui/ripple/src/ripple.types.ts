export type DsRippleAnimation = {
    enterDuration: number;
    exitDuration: number;
};

export type DsRippleOptions = {
    disabled: boolean;
    centered: boolean;
    unbound: boolean;
    radius: number;
    animation: DsRippleAnimation;
};

export type DsRippleOptionsOptional = Partial<DsRippleOptions & { forcedDisabled: boolean }>;
