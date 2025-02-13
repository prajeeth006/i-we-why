import { ResultingContent } from "src/app/common/models/data-feed/meeting-results.model";
import { SportBookEventStructured, SportBookMarketStructured, SportBookSelection } from "src/app/common/models/data-feed/sport-bet-models";

export class EpsTempResult {
    newItem: SportBookEventStructured | SportBookMarketStructured | SportBookSelection | ResultingContent;
    result: EpsResult = new EpsResult();
}

export class EpsResult {
    events: Map<number, SportBookEPSEventStructured> = new Map<number, SportBookEPSEventStructured>();
}

export class SportBookEPSEventStructured extends SportBookEventStructured {
    //markets: Map<number, SportBookMarketStructured> = new Map<number, SportBookMarketStructured>();
    resultingContent: ResultingContent;
}