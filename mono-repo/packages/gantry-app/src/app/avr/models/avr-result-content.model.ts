import { ContentImage } from '../../common/models/content-image.model';

export class AvrContent {
    contentParameters: {
        [attr: string]: string;
    };
    brandLogo: ContentImage;
    racingVirtualImage: ContentImage;
}

export class AvrPageConfiguration {
    gantryAvrPageConfiguration: AvrTimeConfiguration;
    gantryAvrPageOverlay: AvrPageOverlayConfiguration;
}

export class AvrTimeConfiguration {
    dogPreambleTime: number;
    dogCountdownToOffTime: number;
    dogVideoTime: number;
    dogResultTime: number;
    dogDelayTime: number;
    horsePreambleTime: number;
    horseCountdownToOffTime: number;
    horseVideoTime: number;
    jumpHorseVideoTime: number;
    offTime: number;
    horseResultTime: number;
    jumpHorseResultTime: number;
    horseDelayTime: number;
    motorPreambleTime: number;
    motorCountdownToOffTime: number;
    motorVideoTime: number;
    motorResultTime: number;
    motorDelayTime: number;
}

export class AvrPageOverlayConfiguration {
    isOverlay: boolean;
}
