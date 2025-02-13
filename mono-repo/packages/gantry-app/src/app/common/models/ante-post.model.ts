import { HorseRacingContent } from '../../horse-racing/models/horseracing-content.model';
import { SportBookEventStructured, SportBookMarketStructured, SportBookSelection } from './data-feed/sport-bet-models';
import { PaginationContent } from './pagination/pagination.models';

export class AntePostResult extends PaginationContent {
    event: SportBookEventStructured;
    market: SportBookMarketStructured;
    marketEachWay: string;
    selections: Array<SportBookSelection>;
    racingContent: HorseRacingContent;
    isOutrightResults: boolean = false;
    outRightTitle: string | null | undefined;
}
