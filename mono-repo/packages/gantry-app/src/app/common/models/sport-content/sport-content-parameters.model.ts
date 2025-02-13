import { ContentImage } from '../content-image.model';

export class SportContentParameters {
    contentParameters?: {
        [attr: string]: string;
    };
    boxingImage?: ContentImage | null | undefined;
    cricketWhiteImage?: ContentImage | null | undefined;
    cricketRedImage?: ContentImage | null | undefined;
    dartsImage?: ContentImage | null | undefined;
    footballImage?: ContentImage | null | undefined;
    formulaRacingImage?: ContentImage | null | undefined;
    golfImage?: ContentImage | null | undefined;
    nflImage?: ContentImage | null | undefined;
    rugbyLeagueImage?: ContentImage | null | undefined;
    rugbyUnionImage?: ContentImage | null | undefined;
    snookerImage?: ContentImage | null | undefined;
    tennisImage?: ContentImage | null | undefined;
    horseRacingImage?: ContentImage | null | undefined;
    greyHoundRacingImage?: ContentImage | null | undefined;
    specialsImage?: ContentImage | null | undefined;
    politicsImage?: ContentImage | null | undefined;
    olympicsImage?: ContentImage | null | undefined;
    cyclingImage?: ContentImage | null | undefined;
    entertainmentImage?: ContentImage | null | undefined;
}
