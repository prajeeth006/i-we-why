
export class AvrContent {
    contentParameters: {
        [attr: string]: string;
    };
}

export class AvrPageConfiguration {
    dogPreambleTime: number
    dogCountdownToOffTime: number
    dogVideoTime: number
    dogResultTime: number
    dogDelayTime: number
    horsePreambleTime: number
    horseCountdownToOffTime: number
    horseVideoTime: number
    offTime: number;
    horseResultTime: number
    horseDelayTime: number
    motorPreambleTime: number
    motorCountdownToOffTime: number
    motorVideoTime: number
    motorResultTime: number
    motorDelayTime: number
}