import { GreyhoundMeetingRunnerDetails } from '../../../app/greyhound-racing/models/greyhound-racing-meeting-results.model';

export class RunnerDetails1 {
    greyhoundRunnerList: Array<GreyhoundMeetingRunnerDetails> = [
        {
            position: '1',
            runnerNumber: '1',
            favourite: '',
            price: '1/4',
            imgSrc: undefined,
            isDeadHeat: false,
            eventId: 4145790,
        },
        {
            position: '2',
            runnerNumber: '2',
            favourite: '',
            price: '1/5',
            imgSrc: undefined,
            isDeadHeat: false,
            eventId: 4145790,
        },
        {
            position: '3',
            runnerNumber: '3',
            favourite: '',
            price: '1/6',
            imgSrc: undefined,
            isDeadHeat: false,
            eventId: 4145790,
        },
    ];

    SenarioA: Array<GreyhoundMeetingRunnerDetails> = [
        { position: '1', runnerNumber: '1', price: '3/7', favourite: null, isDeadHeat: true, imgSrc: '' },
        { position: '1', runnerNumber: '2', price: '5/7', favourite: null, isDeadHeat: true, imgSrc: '' },
        { position: '3', runnerNumber: '3', price: '6/7', favourite: null, isDeadHeat: false, imgSrc: '' },
        { position: '4', runnerNumber: '4', price: '7/71', favourite: null, isDeadHeat: false, imgSrc: '' },
    ];

    SenarioC: Array<GreyhoundMeetingRunnerDetails> = [
        { position: '1', runnerNumber: '1', price: '3/7', favourite: null, isDeadHeat: false, imgSrc: '' },
        { position: '2', runnerNumber: '2', price: 'FC', favourite: null, isDeadHeat: true, imgSrc: '' },
        { position: '2', runnerNumber: '3', price: '6/7', favourite: null, isDeadHeat: true, imgSrc: '' },
        { position: '4', runnerNumber: '4', price: '7/71', favourite: null, isDeadHeat: false, imgSrc: '' },
    ];

    SenarioE: Array<GreyhoundMeetingRunnerDetails> = [
        { position: '1', runnerNumber: '1', price: '1/11', favourite: null, isDeadHeat: true, imgSrc: '' },
        { position: '1', runnerNumber: '2', price: '2/11', favourite: null, isDeadHeat: true, imgSrc: '' },
        { position: '3', runnerNumber: '3', price: '6/7', favourite: null, isDeadHeat: false, imgSrc: '' },
        { position: '4', runnerNumber: '4', price: '7/71', favourite: null, isDeadHeat: false, imgSrc: '' },
    ];

    SenarioF: Array<GreyhoundMeetingRunnerDetails> = [
        { position: '1', runnerNumber: '1', price: '1/11', favourite: null, isDeadHeat: false, imgSrc: '' },
        { position: '2', runnerNumber: '2', price: '2/11', favourite: null, isDeadHeat: true, imgSrc: '' },
        { position: '2', runnerNumber: '3', price: '6/7', favourite: null, isDeadHeat: true, imgSrc: '' },
        { position: '4', runnerNumber: '4', price: '7/71', favourite: null, isDeadHeat: false, imgSrc: '' },
    ];

    SenarioH: Array<GreyhoundMeetingRunnerDetails> = [
        { position: '1', runnerNumber: '1', price: '1/11', favourite: null, isDeadHeat: true, imgSrc: '' },
        { position: '1', runnerNumber: '2', price: '2/11', favourite: null, isDeadHeat: true, imgSrc: '' },
        { position: '3', runnerNumber: '3', price: '6/7', favourite: null, isDeadHeat: false, imgSrc: '' },
        { position: '4', runnerNumber: '4', price: '7/71', favourite: null, isDeadHeat: false, imgSrc: '' },
    ];

    SenarioK: Array<GreyhoundMeetingRunnerDetails> = [
        { position: '1', runnerNumber: '1', price: '1/11', favourite: null, isDeadHeat: false, imgSrc: '' },
        { position: '2', runnerNumber: '2', price: '2/11', favourite: null, isDeadHeat: true, imgSrc: '' },
        { position: '2', runnerNumber: '3', price: '6/7', favourite: null, isDeadHeat: true, imgSrc: '' },
        { position: '4', runnerNumber: '4', price: '7/71', favourite: null, isDeadHeat: false, imgSrc: '' },
    ];

    SenarioL: Array<GreyhoundMeetingRunnerDetails> = [
        { position: '1', runnerNumber: '1', price: '1/11', favourite: null, isDeadHeat: false, imgSrc: '' },
        { position: '2', runnerNumber: '2', price: '3/11', favourite: null, isDeadHeat: false, imgSrc: '' },
        { position: '3', runnerNumber: '3', price: 'TC', favourite: null, isDeadHeat: true, imgSrc: '' },
        { position: '3', runnerNumber: '4', price: 'TC', favourite: null, isDeadHeat: true, imgSrc: '' },
    ];
    SenarioO: Array<GreyhoundMeetingRunnerDetails> = [
        { position: '1', runnerNumber: '1', price: '1/11', favourite: null, isDeadHeat: false, imgSrc: '' },
        { position: '2', runnerNumber: '2', price: '3/11', favourite: null, isDeadHeat: false, imgSrc: '' },
        { position: '3', runnerNumber: '3', price: 'TC', favourite: null, isDeadHeat: true, imgSrc: '' },
        { position: '3', runnerNumber: '4', price: 'TC', favourite: null, isDeadHeat: true, imgSrc: '' },
    ];
    SenarioP: Array<GreyhoundMeetingRunnerDetails> = [
        { position: '1', runnerNumber: '1', price: '1/11', favourite: null, isDeadHeat: false, imgSrc: '' },
        { position: '2', runnerNumber: '2', price: '3/11', favourite: null, isDeadHeat: true, imgSrc: '' },
        { position: '2', runnerNumber: '3', price: '4/11', favourite: null, isDeadHeat: true, imgSrc: '' },
        { position: '4', runnerNumber: '4', price: '5/11', favourite: null, isDeadHeat: false, imgSrc: '' },
    ];
}
