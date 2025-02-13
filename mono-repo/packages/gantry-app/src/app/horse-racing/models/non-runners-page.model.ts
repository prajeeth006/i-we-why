import { NonRunnersList } from './data-feed/non-runners.model';
import { HorseRacingContent } from './horseracing-content.model';

export class NonRunnersPageResult {
    category: string;
    nonRunnersEvents: Array<NonRunnersList>;
    horseRacingContent: HorseRacingContent;
}
