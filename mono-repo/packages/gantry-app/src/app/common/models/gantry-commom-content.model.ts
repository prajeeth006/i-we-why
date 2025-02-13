import { ContentImage } from '../../common/models/content-image.model';
import { SportContentParameters } from './sport-content/sport-content-parameters.model';

export class GantryCommonContent extends SportContentParameters {}

export class VirtualRaceSilkRunnerImageContent {
    runnerImages: Array<ContentImage>;
}
