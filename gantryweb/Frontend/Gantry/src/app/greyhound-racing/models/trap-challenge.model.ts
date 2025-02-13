import { ContentImage } from "@frontend/vanilla/core";
import { PaginationContent } from "src/app/common/models/pagination/pagination.models";

export class TrapChallengeResult extends PaginationContent {
    categoryName: string | null | undefined;
    marketTitle: string | null | undefined;
    events: Array<TrapChallengeEvent>;
    gantryCommonContent: GreyhoundStaticContent;
}

export class TrapChallengeEvent {
    name: string | null | undefined;
    eventDateTime: Date | null | undefined;
    selections: Array<TrapChallengeEventSelection>;
}

export class TrapChallengeEventSelection {
    name: string | null | undefined;
    price: string | null | undefined;
    trapImage: string | null | undefined;
    runnerNumber: number | null | undefined;
    hidePrice?: boolean | null | undefined;
    hideEntry?: boolean = false;
}

export class GreyhoundStaticContent {
    contentParameters: {
        [attr: string]: string;
    };
    greyHoundImages: RunnerImages
}

export class RunnerImages {
    runnerImages: Array<ContentImage>
}