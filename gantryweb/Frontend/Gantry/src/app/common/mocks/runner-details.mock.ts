import { GreyhoundMeetingRunnerDetails } from "src/app/greyhound-racing/models/greyhound-racing-meeting-results.model";
import { HorseRacingResultDetails } from "src/app/horse-racing/models/horse-racing-meeting-results.model";

export class RunnerDetails {
    greyhoundRunnerList: Array<GreyhoundMeetingRunnerDetails> = [
        {
            position: "1",
            runnerNumber: "1",
            favourite: undefined,
            price: "1/4",
            imgSrc: undefined,
            isDeadHeat: false,
            eventId: 4145790
        },
        {
            position: "2",
            runnerNumber: "2",
            favourite: undefined,
            price: "1/5",
            imgSrc: undefined,
            isDeadHeat: false,
            eventId: 4145790
        },
        {
            position: "3",
            runnerNumber: "3",
            favourite: undefined,
            price: "1/6",
            imgSrc: undefined,
            isDeadHeat: false,
            eventId: 4145790
        }
    ]
    horseRunnerList: Array<HorseRacingResultDetails> = [
        {
            horseRunnerNumber: "1",
            horseName: "THE GRATER",
            horseOdds: undefined,
            position: "1",
            isDeadHeat: false,
            favourite: "F",
            price: "2/4",
            jockeySilkImage:"",
            isFavourite:true

        },
        {
            horseRunnerNumber: "4",
            horseName: "MIXED METHOD",
            horseOdds: undefined,
            position: "2",
            isDeadHeat: false,
            favourite: "F",
            price: "2/5",
            jockeySilkImage:"",
            isFavourite:true
        },
        {
            horseRunnerNumber: "5",
            horseName: "CHANCERY ROAD",
            horseOdds: undefined,
            position: "3",
            isDeadHeat: false,
            favourite: "F",
            price: "2/6",
            jockeySilkImage:"",
            isFavourite:true
        }
    
    ]
    SenarioA: Array<HorseRacingResultDetails> = [
        { horseRunnerNumber: "5", horseName: "Runner5", horseOdds: undefined, position: "6", isDeadHeat: false, favourite: null, price: "5/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "3", horseName: "Runner3", horseOdds: undefined, position: "5", isDeadHeat: false, favourite: null, price: "3/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "1", horseName: "Runner1", horseOdds: undefined, position: "4", isDeadHeat: false, favourite: "2F2c", price: "1/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "2", horseName: "Runner2", horseOdds: undefined, position: "3", isDeadHeat: false, favourite: "F", price: "2/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "4", horseName: "Runner4", horseOdds: undefined, position: "2", isDeadHeat: false, favourite: null, price: "4/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "6", horseName: "Runner6", horseOdds: undefined, position: "1", isDeadHeat: false, favourite: null, price: "6/7", jockeySilkImage:"", isFavourite:false },
    ]
    SenarioB: Array<HorseRacingResultDetails> = [
        { horseRunnerNumber: "5", horseName: "Runner5", horseOdds: undefined, position: "6", isDeadHeat: false, favourite: "2F2c", price: "5/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "3", horseName: "Runner3", horseOdds: undefined, position: "5", isDeadHeat: false, favourite: null, price: "3/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "1", horseName: "Runner1", horseOdds: undefined, position: "1", isDeadHeat: false, favourite: null, price: "1/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "2", horseName: "Runner2", horseOdds: undefined, position: "3", isDeadHeat: false, favourite: "F", price: "2/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "4", horseName: "Runner4", horseOdds: undefined, position: "2", isDeadHeat: false, favourite: null, price: "4/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "6", horseName: "Runner6", horseOdds: undefined, position: "1", isDeadHeat: false, favourite: null, price: "6/7", jockeySilkImage:"", isFavourite:false },
    ]
    SenarioC: Array<HorseRacingResultDetails> = [
        { horseRunnerNumber: "5", horseName: "Runner5", horseOdds: undefined, position: "6", isDeadHeat: false, favourite: "2F2c", price: "5/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "3", horseName: "Runner3", horseOdds: undefined, position: "5", isDeadHeat: false, favourite: null, price: "3/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "1", horseName: "Runner1", horseOdds: undefined, position: "4", isDeadHeat: false, favourite: null, price: "1/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "2", horseName: "Runner2", horseOdds: undefined, position: "2", isDeadHeat: false, favourite: "F", price: "2/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "4", horseName: "Runner4", horseOdds: undefined, position: "2", isDeadHeat: false, favourite: null, price: "4/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "6", horseName: "Runner6", horseOdds: undefined, position: "1", isDeadHeat: false, favourite: null, price: "6/7", jockeySilkImage:"", isFavourite:false },
    ]
    SenarioD: Array<HorseRacingResultDetails> = [
        { horseRunnerNumber: "5", horseName: "Runner5", horseOdds: undefined, position: "6", isDeadHeat: false, favourite: "2F2c", price: "5/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "3", horseName: "Runner3", horseOdds: undefined, position: "5", isDeadHeat: false, favourite: null, price: "3/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "1", horseName: "Runner1", horseOdds: undefined, position: "4", isDeadHeat: false, favourite: null, price: "1/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "2", horseName: "Runner2", horseOdds: undefined, position: "3", isDeadHeat: false, favourite: "F", price: "2/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "4", horseName: "Runner4", horseOdds: undefined, position: "2", isDeadHeat: false, favourite: null, price: "4/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "6", horseName: "Runner6", horseOdds: undefined, position: "1", isDeadHeat: false, favourite: null, price: "6/7", jockeySilkImage:"", isFavourite:false },
    ]
    SenarioE: Array<HorseRacingResultDetails> = [
        { horseRunnerNumber: "5", horseName: "Runner5", horseOdds: undefined, position: "6", isDeadHeat: false, favourite: "2F2c", price: "5/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "3", horseName: "Runner3", horseOdds: undefined, position: "5", isDeadHeat: false, favourite: null, price: "3/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "1", horseName: "Runner1", horseOdds: undefined, position: "4", isDeadHeat: false, favourite: null, price: "1/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "2", horseName: "Runner2", horseOdds: undefined, position: "1", isDeadHeat: false, favourite: "F", price: "2/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "4", horseName: "Runner4", horseOdds: undefined, position: "2", isDeadHeat: false, favourite: null, price: "4/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "6", horseName: "Runner6", horseOdds: undefined, position: "1", isDeadHeat: false, favourite: null, price: "6/7", jockeySilkImage:"", isFavourite:false },
    ]
    SenarioF: Array<HorseRacingResultDetails> = [
        { horseRunnerNumber: "5", horseName: "Runner5", horseOdds: undefined, position: "6", isDeadHeat: false, favourite: "2F2c", price: "5/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "3", horseName: "Runner3", horseOdds: undefined, position: "5", isDeadHeat: false, favourite: null, price: "3/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "1", horseName: "Runner1", horseOdds: undefined, position: "3", isDeadHeat: false, favourite: null, price: "1/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "2", horseName: "Runner2", horseOdds: undefined, position: "2", isDeadHeat: false, favourite: "F", price: "2/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "4", horseName: "Runner4", horseOdds: undefined, position: "2", isDeadHeat: false, favourite: null, price: "4/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "6", horseName: "Runner6", horseOdds: undefined, position: "1", isDeadHeat: false, favourite: null, price: "6/7", jockeySilkImage:"", isFavourite:false },
    ]
    SenarioG: Array<HorseRacingResultDetails> = [
        { horseRunnerNumber: "5", horseName: "Runner5", horseOdds: undefined, position: "6", isDeadHeat: false, favourite: "2F2c", price: "5/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "3", horseName: "Runner3", horseOdds: undefined, position: "5", isDeadHeat: false, favourite: null, price: "3/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "1", horseName: "Runner1", horseOdds: undefined, position: "4", isDeadHeat: false, favourite: null, price: "1/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "2", horseName: "Runner2", horseOdds: undefined, position: "3", isDeadHeat: false, favourite: "F", price: "2/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "4", horseName: "Runner4", horseOdds: undefined, position: "2", isDeadHeat: false, favourite: null, price: "4/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "6", horseName: "Runner6", horseOdds: undefined, position: "1", isDeadHeat: false, favourite: null, price: "6/7", jockeySilkImage:"", isFavourite:false },
    ]
    SenarioH: Array<HorseRacingResultDetails> = [
        { horseRunnerNumber: "5", horseName: "Runner5", horseOdds: undefined, position: "6", isDeadHeat: false, favourite: "2F2c", price: "5/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "3", horseName: "Runner3", horseOdds: undefined, position: "4", isDeadHeat: false, favourite: null, price: "3/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "1", horseName: "Runner1", horseOdds: undefined, position: "2", isDeadHeat: false, favourite: null, price: "1/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "2", horseName: "Runner2", horseOdds: undefined, position: "3", isDeadHeat: false, favourite: "F", price: "2/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "4", horseName: "Runner4", horseOdds: undefined, position: "1", isDeadHeat: false, favourite: null, price: "4/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "6", horseName: "Runner6", horseOdds: undefined, position: "1", isDeadHeat: false, favourite: null, price: "6/7", jockeySilkImage:"", isFavourite:false },
    ]
    SenarioI: Array<HorseRacingResultDetails> = [
        { horseRunnerNumber: "5", horseName: "Runner5", horseOdds: undefined, position: "6", isDeadHeat: false, favourite: "2F2c", price: "5/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "3", horseName: "Runner3", horseOdds: undefined, position: "2", isDeadHeat: false, favourite: null, price: "3/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "1", horseName: "Runner1", horseOdds: undefined, position: "3", isDeadHeat: false, favourite: null, price: "1/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "2", horseName: "Runner2", horseOdds: undefined, position: "3", isDeadHeat: false, favourite: "F", price: "2/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "4", horseName: "Runner4", horseOdds: undefined, position: "1", isDeadHeat: false, favourite: null, price: "4/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "6", horseName: "Runner6", horseOdds: undefined, position: "1", isDeadHeat: false, favourite: null, price: "6/7", jockeySilkImage:"", isFavourite:false },
    ]
    SenarioJ: Array<HorseRacingResultDetails> = [
        { horseRunnerNumber: "5", horseName: "Runner5", horseOdds: undefined, position: "6", isDeadHeat: false, favourite: "2F2c", price: "5/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "3", horseName: "Runner3", horseOdds: undefined, position: "2", isDeadHeat: false, favourite: null, price: "3/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "1", horseName: "Runner1", horseOdds: undefined, position: "3", isDeadHeat: false, favourite: null, price: "1/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "2", horseName: "Runner2", horseOdds: undefined, position: "1", isDeadHeat: false, favourite: "F", price: "2/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "4", horseName: "Runner4", horseOdds: undefined, position: "1", isDeadHeat: false, favourite: null, price: "4/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "6", horseName: "Runner6", horseOdds: undefined, position: "1", isDeadHeat: false, favourite: null, price: "6/7", jockeySilkImage:"", isFavourite:false },
    ]
    SenarioK: Array<HorseRacingResultDetails> = [
        { horseRunnerNumber: "5", horseName: "Runner5", horseOdds: undefined, position: "6", isDeadHeat: false, favourite: "2F2c", price: "5/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "3", horseName: "Runner3", horseOdds: undefined, position: "4", isDeadHeat: false, favourite: null, price: "3/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "1", horseName: "Runner1", horseOdds: undefined, position: "3", isDeadHeat: false, favourite: null, price: "1/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "2", horseName: "Runner2", horseOdds: undefined, position: "2", isDeadHeat: false, favourite: "F", price: "2/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "4", horseName: "Runner4", horseOdds: undefined, position: "2", isDeadHeat: false, favourite: null, price: "4/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "6", horseName: "Runner6", horseOdds: undefined, position: "1", isDeadHeat: false, favourite: null, price: "6/7", jockeySilkImage:"", isFavourite:false },
    ]
    SenarioL: Array<HorseRacingResultDetails> = [
        { horseRunnerNumber: "5", horseName: "Runner5", horseOdds: undefined, position: "6", isDeadHeat: false, favourite: "2F2c", price: "5/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "3", horseName: "Runner3", horseOdds: undefined, position: "4", isDeadHeat: false, favourite: null, price: "3/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "1", horseName: "Runner1", horseOdds: undefined, position: "3", isDeadHeat: false, favourite: null, price: "1/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "2", horseName: "Runner2", horseOdds: undefined, position: "3", isDeadHeat: false, favourite: "F", price: "2/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "4", horseName: "Runner4", horseOdds: undefined, position: "2", isDeadHeat: false, favourite: null, price: "4/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "6", horseName: "Runner6", horseOdds: undefined, position: "1", isDeadHeat: false, favourite: null, price: "6/7", jockeySilkImage:"", isFavourite:false },
    ]
    SenarioMN: Array<HorseRacingResultDetails> = [
        { horseRunnerNumber: "5", horseName: "Runner5", horseOdds: undefined, position: "6", isDeadHeat: false, favourite: "2F2c", price: "5/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "3", horseName: "Runner3", horseOdds: undefined, position: "5", isDeadHeat: false, favourite: null, price: "3/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "1", horseName: "Runner1", horseOdds: undefined, position: "4", isDeadHeat: false, favourite: null, price: "1/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "2", horseName: "Runner2", horseOdds: undefined, position: "3", isDeadHeat: false, favourite: "F", price: "2/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "4", horseName: "Runner4", horseOdds: undefined, position: "2", isDeadHeat: false, favourite: null, price: "4/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "6", horseName: "Runner6", horseOdds: undefined, position: "1", isDeadHeat: false, favourite: null, price: "6/7", jockeySilkImage:"", isFavourite:false },
    ]
    SenarioOP: Array<HorseRacingResultDetails> = [
        { horseRunnerNumber: "8", horseName: "Runner8", horseOdds: undefined, position: "5", isDeadHeat: false, favourite: "2F2c", price: "8/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "7", horseName: "Runner7", horseOdds: undefined, position: "4", isDeadHeat: false, favourite: "2F2c", price: "7/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "5", horseName: "Runner5", horseOdds: undefined, position: "3", isDeadHeat: false, favourite: "2F2c", price: "5/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "3", horseName: "Runner3", horseOdds: undefined, position: "3", isDeadHeat: false, favourite: null, price: "3/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "1", horseName: "Runner1", horseOdds: undefined, position: "3", isDeadHeat: false, favourite: null, price: "1/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "2", horseName: "Runner2", horseOdds: undefined, position: "2", isDeadHeat: false, favourite: "F", price: "2/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "4", horseName: "Runner4", horseOdds: undefined, position: "2", isDeadHeat: false, favourite: null, price: "4/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "6", horseName: "Runner6", horseOdds: undefined, position: "1", isDeadHeat: false, favourite: null, price: "6/7", jockeySilkImage:"", isFavourite:false },
    ]
    SenarioQR: Array<HorseRacingResultDetails> = [
        { horseRunnerNumber: "7", horseName: "Runner7", horseOdds: undefined, position: "7", isDeadHeat: false, favourite: "2F2c", price: "7/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "5", horseName: "Runner5", horseOdds: undefined, position: "6", isDeadHeat: false, favourite: "2F2c", price: "5/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "3", horseName: "Runner3", horseOdds: undefined, position: "5", isDeadHeat: false, favourite: null, price: "3/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "1", horseName: "Runner1", horseOdds: undefined, position: "4", isDeadHeat: false, favourite: null, price: "1/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "2", horseName: "Runner2", horseOdds: undefined, position: "3", isDeadHeat: false, favourite: "F", price: "2/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "4", horseName: "Runner4", horseOdds: undefined, position: "2", isDeadHeat: false, favourite: null, price: "4/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "6", horseName: "Runner6", horseOdds: undefined, position: "1", isDeadHeat: false, favourite: null, price: "6/7", jockeySilkImage:"", isFavourite:false },
    ]
    SenarioST: Array<HorseRacingResultDetails> = [
        { horseRunnerNumber: "11", horseName: "Runner11", horseOdds: undefined, position: "5", isDeadHeat: false, favourite: "2F2c", price: "11/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "10", horseName: "Runner10", horseOdds: undefined, position: "4", isDeadHeat: false, favourite: "2F2c", price: "10/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "9", horseName: "Runner9", horseOdds: undefined, position: "4", isDeadHeat: false, favourite: "2F2c", price: "9/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "8", horseName: "Runner8", horseOdds: undefined, position: "4", isDeadHeat: false, favourite: "2F2c", price: "8/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "7", horseName: "Runner7", horseOdds: undefined, position: "4", isDeadHeat: false, favourite: "2F2c", price: "7/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "5", horseName: "Runner5", horseOdds: undefined, position: "3", isDeadHeat: false, favourite: "2F2c", price: "5/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "3", horseName: "Runner3", horseOdds: undefined, position: "3", isDeadHeat: false, favourite: null, price: "3/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "1", horseName: "Runner1", horseOdds: undefined, position: "3", isDeadHeat: false, favourite: null, price: "1/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "2", horseName: "Runner2", horseOdds: undefined, position: "2", isDeadHeat: false, favourite: "F", price: "2/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "4", horseName: "Runner4", horseOdds: undefined, position: "2", isDeadHeat: false, favourite: null, price: "4/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "6", horseName: "Runner6", horseOdds: undefined, position: "1", isDeadHeat: false, favourite: null, price: "6/7", jockeySilkImage:"", isFavourite:false },
    ]
    SenarioUV: Array<HorseRacingResultDetails> = [
        { horseRunnerNumber: "6", horseName: "Runner6", horseOdds: undefined, position: "7", isDeadHeat: false, favourite: "2F2c", price: "7/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "5", horseName: "Runner5", horseOdds: undefined, position: "6", isDeadHeat: false, favourite: "2F2c", price: "5/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "3", horseName: "Runner3", horseOdds: undefined, position: "5", isDeadHeat: false, favourite: null, price: "3/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "1", horseName: "Runner1", horseOdds: undefined, position: "4", isDeadHeat: false, favourite: null, price: "1/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "2", horseName: "Runner2", horseOdds: undefined, position: "3", isDeadHeat: false, favourite: "F", price: "2/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "4", horseName: "Runner4", horseOdds: undefined, position: "2", isDeadHeat: false, favourite: null, price: "4/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "6", horseName: "Runner6", horseOdds: undefined, position: "1", isDeadHeat: false, favourite: null, price: "6/7", jockeySilkImage:"", isFavourite:false },
    ]
    SenarioWX: Array<HorseRacingResultDetails> = [
        { horseRunnerNumber: "12", horseName: "Runner12", horseOdds: undefined, position: "6", isDeadHeat: false, favourite: "2F2c", price: "12/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "11", horseName: "Runner11", horseOdds: undefined, position: "5", isDeadHeat: false, favourite: "2F2c", price: "11/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "10", horseName: "Runner10", horseOdds: undefined, position: "4", isDeadHeat: false, favourite: "2F2c", price: "10/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "9", horseName: "Runner9", horseOdds: undefined, position: "4", isDeadHeat: false, favourite: "2F2c", price: "9/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "8", horseName: "Runner6", horseOdds: undefined, position: "4", isDeadHeat: false, favourite: "2F2c", price: "8/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "7", horseName: "Runner7", horseOdds: undefined, position: "4", isDeadHeat: false, favourite: "2F2c", price: "7/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "5", horseName: "Runner5", horseOdds: undefined, position: "3", isDeadHeat: false, favourite: "2F2c", price: "5/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "3", horseName: "Runner3", horseOdds: undefined, position: "3", isDeadHeat: false, favourite: null, price: "3/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "1", horseName: "Runner1", horseOdds: undefined, position: "3", isDeadHeat: false, favourite: null, price: "1/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "2", horseName: "Runner2", horseOdds: undefined, position: "2", isDeadHeat: false, favourite: "F", price: "2/7", jockeySilkImage:"", isFavourite:true },
        { horseRunnerNumber: "4", horseName: "Runner4", horseOdds: undefined, position: "2", isDeadHeat: false, favourite: null, price: "4/7", jockeySilkImage:"", isFavourite:false },
        { horseRunnerNumber: "6", horseName: "Runner6", horseOdds: undefined, position: "1", isDeadHeat: false, favourite: null, price: "6/7", jockeySilkImage:"", isFavourite:false },
    ]

}