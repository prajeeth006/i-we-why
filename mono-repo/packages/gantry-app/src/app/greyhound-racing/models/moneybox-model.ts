import { GreyhoundStaticContent } from './greyhound-racing-template.model';

export class MoneyBoxResult {
    greyhoundRacingContent: GreyhoundStaticContent;
    marketName: string | null | undefined;
    eventName: string | null | undefined;
    selections: Array<MoneyBoxSelection>;
    isCoral: boolean; // if true its coral even otherwise its ladbrokes
}

export class MoneyBoxSelection {
    trapImage: string;
    price: string;
    hideEntry?: boolean | null | undefined = false;
    trapNumber?: number;
}
