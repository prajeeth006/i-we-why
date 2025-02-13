import { ContentImage } from '../../common/models/content-image.model';

export class HorseRacingContent {
    racingPostImage?: ContentImage | null | undefined;
    horseRacingImage?: ContentImage | null | undefined;
    greyHoundRacingImage?: ContentImage | null | undefined;
    darkThemeRacingPostImage?: ContentImage | null | undefined;
    contentParameters: {
        [attr: string]: string;
    };
    epsFooterLogoNewDesign?: ContentImage | null | undefined;
}
