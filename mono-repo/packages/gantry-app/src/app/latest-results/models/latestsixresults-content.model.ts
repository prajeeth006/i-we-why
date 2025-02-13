import { ContentImage } from '../../common/models/content-image.model';

export class LatestSixResultsContent {
    racingPostImage: ContentImage | null | undefined;
    contentParameters: {
        [attr: string]: string;
    };
    DarkThemeLatestResultImage: ContentImage | null | undefined;
}
