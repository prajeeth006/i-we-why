export class AntePostDrawResult {
    eventName: string | null | undefined;
    categoryName: string | null | undefined;
    typeName: string | null | undefined;
    selections: Array<AntePostDrawSelection>;
    winOrEachWayText: string | null | undefined;
}

export class AntePostDrawSelection {
    name: string;
    trapImage: string;
    price: string;
    hidePrice: boolean;
    hideEntry?: boolean = false;
}