import { SportContentParameters } from "src/app/common/models/sport-content/sport-content-parameters.model";

export class TennisDataContent extends SportContentParameters{
    contentParameters :  {
        [attr: string]: string;
    };
}