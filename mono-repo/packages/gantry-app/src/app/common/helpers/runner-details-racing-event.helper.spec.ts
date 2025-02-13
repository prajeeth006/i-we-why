import { RunnerDetails1 } from '../mocks/GH-runner-details.mock';
import { RunnerDetails } from '../mocks/runner-details.mock';
import { RunnerType } from '../models/racing-tags.model';
import { RunnerDetailsRacingEvent } from './runner-details-racing-event.helper';

describe('RunnerDetailsRacingEvent', () => {
    const runnerDetails = new RunnerDetails();
    const runnerDetails1 = new RunnerDetails1();
    it('should be created', () => {
        const runnerDetailsRacingEvent = new RunnerDetailsRacingEvent();
        expect(runnerDetailsRacingEvent).toBeTruthy();
    });

    it('Result logic Senario A', () => {
        const eachWay = 'EACH-WAY 1/1 1';
        const sortedTricast: string = null;
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(
            RunnerType.Horse,
            eachWay,
            runnerDetails.SenarioA,
            sortedTricast,
        );

        //Runners Count
        expect(result.length).toEqual(2);

        //Runner position
        expect(result[0].horseRunnerNumber).toEqual('6');
        expect(result[1].horseRunnerNumber).toEqual('4');

        //TC and FC and price
        expect(result[0].price).toEqual('6/7');
        expect(result[1].price).toEqual('FC');
    });

    it('GreyHound Meeting Result logic Senario A for Deadheat DH 1st (Win Only)', () => {
        const eachWay = 'EACH-WAY 1/1 1';
        const sortedTricast: string = null;
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Dog, eachWay, runnerDetails1.SenarioA, sortedTricast);

        //Runners Count
        expect(result.length).toEqual(2);

        // //when dead heat occurs the postions
        expect(result[0].position).toEqual('1');
        expect(result[1].position).toEqual('1');

        // runner number for deadHeat
        expect(result[0].runnerNumber).toEqual('1');
        expect(result[1].runnerNumber).toEqual('2');

        //TC and FC and price
        expect(result[0].price).toEqual('3/7');
        expect(result[1].price).toEqual('5/7');
    });

    it('Result logic Senario B', () => {
        const eachWay = 'EACH-WAY 1/1 1';
        const sortedTricast: string = null;
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(
            RunnerType.Horse,
            eachWay,
            runnerDetails.SenarioB,
            sortedTricast,
        );

        //Runners Count
        expect(result.length).toEqual(2);

        //Runner position
        expect(result[0].horseRunnerNumber).toEqual('1');
        expect(result[1].horseRunnerNumber).toEqual('6');

        //TC and FC and price
        expect(result[0].price).toEqual('1/7');
        expect(result[1].price).toEqual('6/7');
    });

    it('Result logic Senario C', () => {
        const eachWay = 'EACH-WAY 1/1 1';
        const sortedTricast: string = null;
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(
            RunnerType.Horse,
            eachWay,
            runnerDetails.SenarioC,
            sortedTricast,
        );

        //Runners Count
        expect(result.length).toEqual(3);

        //Runner position
        expect(result[0].horseRunnerNumber).toEqual('6');
        expect(result[1].horseRunnerNumber).toEqual('2');
        expect(result[2].horseRunnerNumber).toEqual('4');

        //TC and FC and price
        expect(result[0].price).toEqual('6/7');
        expect(result[1].price).toEqual('FC');
        expect(result[2].price).toEqual('FC');

        //TC and FC and price
        expect(result[1].favourite).toEqual('F');
    });

    it('GreyHound Meeting Result logic Senario c for Deadheat  DH 2nd (Win Only)', () => {
        const eachWay = 'EACH-WAY 1/1 1';
        const sortedTricast: string = null;
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Dog, eachWay, runnerDetails1.SenarioC, sortedTricast);

        //Runners Count
        expect(result.length).toEqual(3);

        // //when dead heat occurs the postions
        expect(result[1].position).toEqual('2');
        expect(result[2].position).toEqual('2');

        // runner number for deadHeat
        expect(result[1].runnerNumber).toEqual('2');
        expect(result[2].runnerNumber).toEqual('3');

        //TC and FC and price
        expect(result[1].price).toEqual('FC');
    });

    it('Result logic Senario D', () => {
        const eachWay = 'EACH-WAY 1/3 1-2';
        const sortedTricast: string = null;
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(
            RunnerType.Horse,
            eachWay,
            runnerDetails.SenarioD,
            sortedTricast,
        );

        //Runners Count
        expect(result.length).toEqual(2);

        //Runner position
        expect(result[0].horseRunnerNumber).toEqual('6');
        expect(result[1].horseRunnerNumber).toEqual('4');

        //TC and FC and price
        expect(result[0].price).toEqual('6/7');
        expect(result[1].price).toEqual('4/7');
    });

    it('Result logic Senario E', () => {
        const eachWay = 'EACH-WAY 1/3 1-2';
        const sortedTricast: string = null;
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(
            RunnerType.Horse,
            eachWay,
            runnerDetails.SenarioE,
            sortedTricast,
        );

        //Runners Count
        expect(result.length).toEqual(2);

        //Runner position
        expect(result[0].horseRunnerNumber).toEqual('2');
        expect(result[1].horseRunnerNumber).toEqual('6');

        //TC and FC and price
        expect(result[0].price).toEqual('2/7');
        expect(result[1].price).toEqual('6/7');
    });

    it('GreyHound Meeting Result logic Senario E for Deadheat DH 1st (2 places) - No Tricast 2+ DHs for 1st - No Tricast', () => {
        const eachWay = 'EACH-WAY 1/4 1-2';
        const sortedTricast: string = null;
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Dog, eachWay, runnerDetails1.SenarioE, sortedTricast);

        //Runners Count
        expect(result.length).toEqual(2);

        // //when dead heat occurs the postions
        expect(result[0].position).toEqual('1');
        expect(result[1].position).toEqual('1');

        // runner number for deadHeat
        expect(result[0].runnerNumber).toEqual('1');
        expect(result[1].runnerNumber).toEqual('2');

        //TC and FC and price
        expect(result[0].price).toEqual('1/11');
        expect(result[1].price).toEqual('2/11');
    });

    it('Result logic Senario F', () => {
        const eachWay = 'EACH-WAY 1/3 1-2';
        const sortedTricast: string = null;
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(
            RunnerType.Horse,
            eachWay,
            runnerDetails.SenarioF,
            sortedTricast,
        );

        //Runners Count
        expect(result.length).toEqual(3);

        //Runner position
        expect(result[0].horseRunnerNumber).toEqual('6');
        expect(result[1].horseRunnerNumber).toEqual('2');
        expect(result[2].horseRunnerNumber).toEqual('4');

        //TC and FC and price
        expect(result[0].price).toEqual('6/7');
        expect(result[1].price).toEqual('2/7');
        expect(result[2].price).toEqual('4/7');
    });

    it('GreyHound Meeting Result logic Senario F for Deadheat DH 2nd (2 places) - No Tricast 2+ DHs for 2nd - No Tricast', () => {
        const eachWay = 'EACH-WAY 1/4 1-2';
        const sortedTricast: string = null;
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Dog, eachWay, runnerDetails1.SenarioF, sortedTricast);

        //Runners Count
        expect(result.length).toEqual(3);

        // //when dead heat occurs the postions
        expect(result[1].position).toEqual('2');
        expect(result[2].position).toEqual('2');

        // runner number for deadHeat
        expect(result[1].runnerNumber).toEqual('2');
        expect(result[2].runnerNumber).toEqual('3');

        //TC and FC and price
        expect(result[1].price).toEqual('2/11');
        expect(result[2].price).toEqual('6/7');
    });

    it('Result logic Senario G', () => {
        const eachWay = 'EACH-WAY 1/3 1-2';
        const sortedTricast = {};
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(
            RunnerType.Horse,
            eachWay,
            runnerDetails.SenarioG,
            sortedTricast,
        );

        //Runners Count
        expect(result.length).toEqual(3);

        //Runner position
        expect(result[0].horseRunnerNumber).toEqual('6');
        expect(result[1].horseRunnerNumber).toEqual('4');
        expect(result[2].horseRunnerNumber).toEqual('2');

        //TC and FC and price
        expect(result[0].price).toEqual('6/7');
        expect(result[1].price).toEqual('4/7');
        expect(result[2].price).toEqual('TC');
    });

    it('Result logic Senario H', () => {
        const eachWay = 'EACH-WAY 1/3 1-2';
        const sortedTricast = {};
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(
            RunnerType.Horse,
            eachWay,
            runnerDetails.SenarioH,
            sortedTricast,
        );

        //Runners Count
        expect(result.length).toEqual(3);

        //Runner position
        expect(result[0].horseRunnerNumber).toEqual('4');
        expect(result[1].horseRunnerNumber).toEqual('6');
        expect(result[2].horseRunnerNumber).toEqual('2');

        //TC and FC and price
        expect(result[0].price).toEqual('4/7');
        expect(result[1].price).toEqual('6/7');
        expect(result[2].price).toEqual('TC');
    });
    it('GreyHound Meeting Result logic Senario H for Deadheat DH 1st (2 Places)', () => {
        const eachWay = 'EACH-WAY 1/4 1-2';
        const sortedTricast = {};
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Dog, eachWay, runnerDetails1.SenarioH, sortedTricast);

        //Runners Count
        expect(result.length).toEqual(3);

        // //when dead heat occurs the postions
        expect(result[0].position).toEqual('1');
        expect(result[1].position).toEqual('1');

        // runner number for deadHeat
        expect(result[0].runnerNumber).toEqual('1');
        expect(result[1].runnerNumber).toEqual('2');

        //TC and FC and price
        expect(result[0].price).toEqual('1/11');
        expect(result[1].price).toEqual('2/11');
    });

    it('Result logic Senario I', () => {
        const eachWay = 'EACH-WAY 1/3 1-2';
        const sortedTricast = {};
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(
            RunnerType.Horse,
            eachWay,
            runnerDetails.SenarioI,
            sortedTricast,
        );

        //Runners Count
        expect(result.length).toEqual(4);

        //Runner position
        expect(result[0].horseRunnerNumber).toEqual('4');
        expect(result[1].horseRunnerNumber).toEqual('6');
        expect(result[2].horseRunnerNumber).toEqual('1');
        expect(result[3].horseRunnerNumber).toEqual('2');

        //TC and FC and price
        expect(result[0].price).toEqual('4/7');
        expect(result[1].price).toEqual('6/7');
        expect(result[2].price).toEqual('TC');
        expect(result[3].price).toEqual('TC');
    });

    it('Result logic Senario J', () => {
        const eachWay = 'EACH-WAY 1/3 1-2';
        const sortedTricast = {};
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(
            RunnerType.Horse,
            eachWay,
            runnerDetails.SenarioJ,
            sortedTricast,
        );

        //Runners Count
        expect(result.length).toEqual(3);

        //Runner position
        expect(result[0].horseRunnerNumber).toEqual('2');
        expect(result[1].horseRunnerNumber).toEqual('4');
        expect(result[2].horseRunnerNumber).toEqual('6');

        //TC and FC and price
        expect(result[0].price).toEqual('2/7');
        expect(result[1].price).toEqual('4/7');
        expect(result[2].price).toEqual('6/7');
    });

    it('Result logic Senario K', () => {
        const eachWay = 'EACH-WAY 1/3 1-2';
        const sortedTricast = {};
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(
            RunnerType.Horse,
            eachWay,
            runnerDetails.SenarioK,
            sortedTricast,
        );

        //Runners Count
        expect(result.length).toEqual(3);

        //Runner position
        expect(result[0].horseRunnerNumber).toEqual('6');
        expect(result[1].horseRunnerNumber).toEqual('2');
        expect(result[2].horseRunnerNumber).toEqual('4');

        //TC and FC and price
        expect(result[0].price).toEqual('6/7');
        expect(result[1].price).toEqual('2/7');
        expect(result[2].price).toEqual('4/7');
    });

    it('GreyHound Meeting Result logic Senario k for Deadheat DH 2nd (2 Places) ', () => {
        const eachWay = 'EACH-WAY 1/4 1-2';
        const sortedTricast = {};
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Dog, eachWay, runnerDetails1.SenarioK, sortedTricast);

        //Runners Count
        expect(result.length).toEqual(3);

        // //when dead heat occurs the postions should same for 2nd position
        expect(result[1].position).toEqual('2');
        expect(result[2].position).toEqual('2');

        // runner number for deadHeat
        expect(result[1].runnerNumber).toEqual('2');
        expect(result[2].runnerNumber).toEqual('3');

        //TC and FC and price
        expect(result[1].price).toEqual('2/11');
        expect(result[2].price).toEqual('6/7');
    });

    it('Result logic Senario L', () => {
        const eachWay = 'EACH-WAY 1/3 1-2';
        const sortedTricast = {};
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(
            RunnerType.Horse,
            eachWay,
            runnerDetails.SenarioL,
            sortedTricast,
        );

        //Runners Count
        expect(result.length).toEqual(4);

        //Runner position
        expect(result[0].horseRunnerNumber).toEqual('6');
        expect(result[1].horseRunnerNumber).toEqual('4');
        expect(result[2].horseRunnerNumber).toEqual('1');
        expect(result[3].horseRunnerNumber).toEqual('2');

        //TC and FC and price
        expect(result[0].price).toEqual('6/7');
        expect(result[1].price).toEqual('4/7');
        expect(result[2].price).toEqual('TC');
        expect(result[3].price).toEqual('TC');
    });

    it('GreyHound Meeting Result logic Senario L for Deadheat DH 3rd (2 Places) ', () => {
        const eachWay = 'EACH-WAY 1/4 1-2';
        const sortedTricast = {};
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Dog, eachWay, runnerDetails1.SenarioL, sortedTricast);

        //Runners Count
        expect(result.length).toEqual(4);

        // //when dead heat occurs the postions should same for 3 positions
        expect(result[2].position).toEqual('3');
        expect(result[3].position).toEqual('3');

        // runner number for deadHeat
        expect(result[2].runnerNumber).toEqual('3');
        expect(result[3].runnerNumber).toEqual('4');
        //TC and FC and price
        expect(result[2].price).toEqual('TC');
        expect(result[3].price).toEqual('TC');
    });

    it('Result logic Senario M', () => {
        const eachWay = 'EACH-WAY 1/3 1-2-3';
        const sortedTricast = 0;
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(
            RunnerType.Horse,
            eachWay,
            runnerDetails.SenarioMN,
            sortedTricast,
        );

        //Runners Count
        expect(result.length).toEqual(3);

        //Runner position
        expect(result[0].horseRunnerNumber).toEqual('6');
        expect(result[1].horseRunnerNumber).toEqual('4');
        expect(result[2].horseRunnerNumber).toEqual('2');

        //TC and FC and price
        expect(result[0].price).toEqual('6/7');
        expect(result[1].price).toEqual('4/7');
        expect(result[2].price).toEqual('2/7');
    });

    it('Result logic Senario N', () => {
        const eachWay = 'EACH-WAY 1/3 1-2-3';
        const sortedTricast = {};
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(
            RunnerType.Horse,
            eachWay,
            runnerDetails.SenarioMN,
            sortedTricast,
        );

        //Runners Count
        expect(result.length).toEqual(3);

        //Runner position
        expect(result[0].horseRunnerNumber).toEqual('6');
        expect(result[1].horseRunnerNumber).toEqual('4');
        expect(result[2].horseRunnerNumber).toEqual('2');

        //TC and FC and price
        expect(result[0].price).toEqual('6/7');
        expect(result[1].price).toEqual('4/7');
        expect(result[2].price).toEqual('2/7');
    });

    it('Result logic Senario O', () => {
        const eachWay = 'EACH-WAY 1/3 1-2-3';
        const sortedTricast = 0;
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(
            RunnerType.Horse,
            eachWay,
            runnerDetails.SenarioOP,
            sortedTricast,
        );

        //Runners Count
        expect(result.length).toEqual(6);

        //Runner position
        expect(result[0].horseRunnerNumber).toEqual('6');
        expect(result[1].horseRunnerNumber).toEqual('2');
        expect(result[2].horseRunnerNumber).toEqual('4');
        expect(result[3].horseRunnerNumber).toEqual('1');
        expect(result[4].horseRunnerNumber).toEqual('3');
        expect(result[5].horseRunnerNumber).toEqual('5');

        //TC and FC and price
        expect(result[0].price).toEqual('6/7');
        expect(result[1].price).toEqual('2/7');
        expect(result[2].price).toEqual('4/7');
        expect(result[3].price).toEqual('1/7');
        expect(result[4].price).toEqual('3/7');
        expect(result[5].price).toEqual('5/7');
    });

    it('GreyHound Meeting Result logic Senario O for Deadheat Any Dead Heats (3 Places) - No Tricast', () => {
        const eachWay = 'EACH-WAY 1/4 1-2-3';
        const sortedTricast = {};
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Dog, eachWay, runnerDetails1.SenarioO, sortedTricast);

        //Runners Count
        expect(result.length).toEqual(4);

        // //when dead heat occurs the postions should same for any Dead heat 3 places
        expect(result[2].position).toEqual('3');
        expect(result[3].position).toEqual('3');

        // runner number for deadHeat
        expect(result[2].runnerNumber).toEqual('3');
        expect(result[3].runnerNumber).toEqual('4');
        //TC and FC and price
        expect(result[2].price).toEqual('TC');
        expect(result[3].price).toEqual('TC');
    });

    it('Result logic Senario P', () => {
        const eachWay = 'EACH-WAY 1/3 1-2-3';
        const sortedTricast = {};
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(
            RunnerType.Horse,
            eachWay,
            runnerDetails.SenarioOP,
            sortedTricast,
        );

        //Runners Count
        expect(result.length).toEqual(6);

        //Runner position
        expect(result[0].horseRunnerNumber).toEqual('6');
        expect(result[1].horseRunnerNumber).toEqual('2');
        expect(result[2].horseRunnerNumber).toEqual('4');
        expect(result[3].horseRunnerNumber).toEqual('1');
        expect(result[4].horseRunnerNumber).toEqual('3');
        expect(result[5].horseRunnerNumber).toEqual('5');

        //TC and FC and price
        expect(result[0].price).toEqual('6/7');
        expect(result[1].price).toEqual('2/7');
        expect(result[2].price).toEqual('4/7');
        expect(result[3].price).toEqual('1/7');
        expect(result[4].price).toEqual('3/7');
        expect(result[5].price).toEqual('5/7');
    });

    it('GreyHound Meeting Result logic Senario P for Deadheat Any Dead Heats (3 Places) -  Tricast', () => {
        const eachWay = 'EACH-WAY 1/4 1-2-3';
        const sortedTricast = {};
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Dog, eachWay, runnerDetails1.SenarioP, sortedTricast);

        //Runners Count
        expect(result.length).toEqual(3);

        // //when dead heat occurs the postions should same for any Dead heat 3 places
        expect(result[1].position).toEqual('2');
        expect(result[2].position).toEqual('2');

        // runner number for deadHeat
        expect(result[1].runnerNumber).toEqual('2');
        expect(result[2].runnerNumber).toEqual('3');
        //TC and FC and price
        expect(result[1].price).toEqual('3/11');
        expect(result[2].price).toEqual('4/11');
    });

    it('Result logic Senario Q', () => {
        const eachWay = 'EACH-WAY 1/3 1-2-3-4';
        const sortedTricast = 0;
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(
            RunnerType.Horse,
            eachWay,
            runnerDetails.SenarioQR,
            sortedTricast,
        );

        //Runners Count
        expect(result.length).toEqual(4);

        //Runner position
        expect(result[0].horseRunnerNumber).toEqual('6');
        expect(result[1].horseRunnerNumber).toEqual('4');
        expect(result[2].horseRunnerNumber).toEqual('2');
        expect(result[3].horseRunnerNumber).toEqual('1');

        //TC and FC and price
        expect(result[0].price).toEqual('6/7');
        expect(result[1].price).toEqual('4/7');
        expect(result[2].price).toEqual('2/7');
        expect(result[3].price).toEqual('1/7');
    });

    it('Result logic Senario R', () => {
        const eachWay = 'EACH-WAY 1/3 1-2-3-4';
        const sortedTricast = {};
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(
            RunnerType.Horse,
            eachWay,
            runnerDetails.SenarioQR,
            sortedTricast,
        );

        //Runners Count
        expect(result.length).toEqual(4);

        //Runner position
        expect(result[0].horseRunnerNumber).toEqual('6');
        expect(result[1].horseRunnerNumber).toEqual('4');
        expect(result[2].horseRunnerNumber).toEqual('2');
        expect(result[3].horseRunnerNumber).toEqual('1');

        //TC and FC and price
        expect(result[0].price).toEqual('6/7');
        expect(result[1].price).toEqual('4/7');
        expect(result[2].price).toEqual('2/7');
        expect(result[3].price).toEqual('1/7');
    });

    it('Result logic Senario S', () => {
        const eachWay = 'EACH-WAY 1/3 1-2-3-4';
        const sortedTricast: string = null;
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(
            RunnerType.Horse,
            eachWay,
            runnerDetails.SenarioST,
            sortedTricast,
        );

        //Runners Count
        expect(result.length).toEqual(10);

        //Runner position
        expect(result[0].horseRunnerNumber).toEqual('6');
        expect(result[1].horseRunnerNumber).toEqual('2');
        expect(result[2].horseRunnerNumber).toEqual('4');
        expect(result[3].horseRunnerNumber).toEqual('1');
        expect(result[4].horseRunnerNumber).toEqual('3');
        expect(result[5].horseRunnerNumber).toEqual('5');
        expect(result[6].horseRunnerNumber).toEqual('7');
        expect(result[7].horseRunnerNumber).toEqual('8');
        expect(result[8].horseRunnerNumber).toEqual('9');
        expect(result[9].horseRunnerNumber).toEqual('10');

        //TC and FC and price
        expect(result[0].price).toEqual('6/7');
        expect(result[1].price).toEqual('2/7');
        expect(result[2].price).toEqual('4/7');
        expect(result[3].price).toEqual('1/7');
        expect(result[4].price).toEqual('3/7');
        expect(result[5].price).toEqual('5/7');
        expect(result[6].price).toEqual('7/7');
        expect(result[7].price).toEqual('8/7');
        expect(result[8].price).toEqual('9/7');
        expect(result[9].price).toEqual('10/7');
    });

    it('Result logic Senario T', () => {
        const eachWay = 'EACH-WAY 1/3 1-2-3-4';
        const sortedTricast = {};
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(
            RunnerType.Horse,
            eachWay,
            runnerDetails.SenarioST,
            sortedTricast,
        );

        //Runners Count
        expect(result.length).toEqual(10);

        //Runner position
        expect(result[0].horseRunnerNumber).toEqual('6');
        expect(result[1].horseRunnerNumber).toEqual('2');
        expect(result[2].horseRunnerNumber).toEqual('4');
        expect(result[3].horseRunnerNumber).toEqual('1');
        expect(result[4].horseRunnerNumber).toEqual('3');
        expect(result[5].horseRunnerNumber).toEqual('5');
        expect(result[6].horseRunnerNumber).toEqual('7');
        expect(result[7].horseRunnerNumber).toEqual('8');
        expect(result[8].horseRunnerNumber).toEqual('9');
        expect(result[9].horseRunnerNumber).toEqual('10');

        //TC and FC and price
        expect(result[0].price).toEqual('6/7');
        expect(result[1].price).toEqual('2/7');
        expect(result[2].price).toEqual('4/7');
        expect(result[3].price).toEqual('1/7');
        expect(result[4].price).toEqual('3/7');
        expect(result[5].price).toEqual('5/7');
        expect(result[6].price).toEqual('7/7');
        expect(result[7].price).toEqual('8/7');
        expect(result[8].price).toEqual('9/7');
        expect(result[9].price).toEqual('10/7');
    });

    it('Result logic Senario U', () => {
        const eachWay = 'EACH-WAY 1/3 1-2-3-4-5';
        const sortedTricast = 0;
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(
            RunnerType.Horse,
            eachWay,
            runnerDetails.SenarioUV,
            sortedTricast,
        );

        //Runners Count
        expect(result.length).toEqual(5);

        //Runner position
        expect(result[0].horseRunnerNumber).toEqual('6');
        expect(result[1].horseRunnerNumber).toEqual('4');
        expect(result[2].horseRunnerNumber).toEqual('2');
        expect(result[3].horseRunnerNumber).toEqual('1');
        expect(result[4].horseRunnerNumber).toEqual('3');

        //TC and FC and price
        expect(result[0].price).toEqual('6/7');
        expect(result[1].price).toEqual('4/7');
        expect(result[2].price).toEqual('2/7');
        expect(result[3].price).toEqual('1/7');
        expect(result[4].price).toEqual('3/7');
    });

    it('Result logic Senario V', () => {
        const eachWay = 'EACH-WAY 1/3 1-2-3-4-5';
        const sortedTricast = {};
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(
            RunnerType.Horse,
            eachWay,
            runnerDetails.SenarioUV,
            sortedTricast,
        );

        //Runners Count
        expect(result.length).toEqual(5);

        //Runner position
        expect(result[0].horseRunnerNumber).toEqual('6');
        expect(result[1].horseRunnerNumber).toEqual('4');
        expect(result[2].horseRunnerNumber).toEqual('2');
        expect(result[3].horseRunnerNumber).toEqual('1');
        expect(result[4].horseRunnerNumber).toEqual('3');

        //TC and FC and price
        expect(result[0].price).toEqual('6/7');
        expect(result[1].price).toEqual('4/7');
        expect(result[2].price).toEqual('2/7');
        expect(result[3].price).toEqual('1/7');
        expect(result[4].price).toEqual('3/7');
    });

    it('Result logic Senario W', () => {
        const eachWay = 'EACH-WAY 1/3 1-2-3-4-5';
        const sortedTricast: string = null;
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(
            RunnerType.Horse,
            eachWay,
            runnerDetails.SenarioWX,
            sortedTricast,
        );

        //Runners Count
        expect(result.length).toEqual(11);

        //Runner position
        expect(result[0].horseRunnerNumber).toEqual('6');
        expect(result[1].horseRunnerNumber).toEqual('2');
        expect(result[2].horseRunnerNumber).toEqual('4');
        expect(result[3].horseRunnerNumber).toEqual('1');
        expect(result[4].horseRunnerNumber).toEqual('3');
        expect(result[5].horseRunnerNumber).toEqual('5');
        expect(result[6].horseRunnerNumber).toEqual('7');
        expect(result[7].horseRunnerNumber).toEqual('8');
        expect(result[8].horseRunnerNumber).toEqual('9');
        expect(result[9].horseRunnerNumber).toEqual('10');
        expect(result[10].horseRunnerNumber).toEqual('11');

        //TC and FC and price
        expect(result[0].price).toEqual('6/7');
        expect(result[1].price).toEqual('2/7');
        expect(result[2].price).toEqual('4/7');
        expect(result[3].price).toEqual('1/7');
        expect(result[4].price).toEqual('3/7');
        expect(result[5].price).toEqual('5/7');
        expect(result[6].price).toEqual('7/7');
        expect(result[7].price).toEqual('8/7');
        expect(result[8].price).toEqual('9/7');
        expect(result[9].price).toEqual('10/7');
        expect(result[10].price).toEqual('11/7');
    });

    it('Result logic Senario X', () => {
        const eachWay = 'EACH-WAY 1/3 1-2-3-4-5';
        const sortedTricast = {};
        const result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(
            RunnerType.Horse,
            eachWay,
            runnerDetails.SenarioWX,
            sortedTricast,
        );

        //Runners Count
        expect(result.length).toEqual(11);

        //Runner position
        expect(result[0].horseRunnerNumber).toEqual('6');
        expect(result[1].horseRunnerNumber).toEqual('2');
        expect(result[2].horseRunnerNumber).toEqual('4');
        expect(result[3].horseRunnerNumber).toEqual('1');
        expect(result[4].horseRunnerNumber).toEqual('3');
        expect(result[5].horseRunnerNumber).toEqual('5');
        expect(result[6].horseRunnerNumber).toEqual('7');
        expect(result[7].horseRunnerNumber).toEqual('8');
        expect(result[8].horseRunnerNumber).toEqual('9');
        expect(result[9].horseRunnerNumber).toEqual('10');
        expect(result[10].horseRunnerNumber).toEqual('11');

        //TC and FC and price
        expect(result[0].price).toEqual('6/7');
        expect(result[1].price).toEqual('2/7');
        expect(result[2].price).toEqual('4/7');
        expect(result[3].price).toEqual('1/7');
        expect(result[4].price).toEqual('3/7');
        expect(result[5].price).toEqual('5/7');
        expect(result[6].price).toEqual('7/7');
        expect(result[7].price).toEqual('8/7');
        expect(result[8].price).toEqual('9/7');
        expect(result[9].price).toEqual('10/7');
        expect(result[10].price).toEqual('11/7');
    });
});
