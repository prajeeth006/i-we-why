import { RunnerDetailsRacingEvent } from './runner-details-racing-event.helper';
import { RunnerDetails } from '../mocks/runner-details.mock'
import { RunnerType } from '../models/racing-tags.model';

describe('RunnerDetailsRacingEvent', () => {
  let runnerDetails = new RunnerDetails();
  it('should be created', () => {
    let runnerDetailsRacingEvent = new RunnerDetailsRacingEvent();
    expect(runnerDetailsRacingEvent).toBeTruthy();
  });

  it('to check setRunnerDetails in Greyhound Racing', () => {
    let runnerType = "DOG";
    let runnerCount = 7;
    let eachWay = "EACH-WAY 1/5 1-2";
    let forecast = "3.22";
    let tricast = "18.72 / 13.45";
    let result = RunnerDetailsRacingEvent.setRunnerDetails(runnerType, runnerCount, eachWay, forecast, tricast, runnerDetails.greyhoundRunnerList);

    expect(result).toEqual(runnerDetails.greyhoundRunnerList);
  });

  it('to check setRunnerDetails in Horse Racing', () => {
    let runnerType = "HORSE";
    let runnerCount = 6;
    let eachWay = "EACH-WAY 1/5 1-2";
    let forecast = "3.22";
    let tricast = "18.72";
    let result = RunnerDetailsRacingEvent.setRunnerDetails(runnerType, runnerCount, eachWay, forecast, tricast, runnerDetails.horseRunnerList);

    expect(result).toEqual(runnerDetails.horseRunnerList);
  });


  it('Result logic Senario A', () => {
    let eachWay = "EACH-WAY 1/1 1";
    let sortedTricast = null;
    let result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Horse, eachWay, runnerDetails.SenarioA, sortedTricast);

    //Runners Count
    expect(result.length).toEqual(2);

    //Runner position
    expect(result[0].horseRunnerNumber).toEqual('6');
    expect(result[1].horseRunnerNumber).toEqual('4');

    //TC and FC and price
    expect(result[0].price).toEqual('6/7');
    expect(result[1].price).toEqual('FC');
  });

  it('Result logic Senario B', () => {
    let eachWay = "EACH-WAY 1/1 1";
    let sortedTricast = null;
    let result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Horse, eachWay, runnerDetails.SenarioB, sortedTricast);

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
    let eachWay = "EACH-WAY 1/1 1";
    let sortedTricast = null;
    let result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Horse, eachWay, runnerDetails.SenarioC, sortedTricast);

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

  it('Result logic Senario D', () => {
    let eachWay = "EACH-WAY 1/3 1-2";
    let sortedTricast = null;
    let result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Horse, eachWay, runnerDetails.SenarioD, sortedTricast);

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
    let eachWay = "EACH-WAY 1/3 1-2";
    let sortedTricast = null;
    let result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Horse, eachWay, runnerDetails.SenarioE, sortedTricast);

    //Runners Count
    expect(result.length).toEqual(2);

    //Runner position
    expect(result[0].horseRunnerNumber).toEqual('2');
    expect(result[1].horseRunnerNumber).toEqual('6');

    //TC and FC and price
    expect(result[0].price).toEqual('2/7');
    expect(result[1].price).toEqual('6/7');
    

  });

  it('Result logic Senario F', () => {
    let eachWay = "EACH-WAY 1/3 1-2";
    let sortedTricast = null;
    let result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Horse, eachWay, runnerDetails.SenarioF, sortedTricast);

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

  it('Result logic Senario G', () => {
    let eachWay = "EACH-WAY 1/3 1-2";
    let sortedTricast = {};
    let result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Horse, eachWay, runnerDetails.SenarioG, sortedTricast);

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
    let eachWay = "EACH-WAY 1/3 1-2";
    let sortedTricast = {};
    let result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Horse, eachWay, runnerDetails.SenarioH, sortedTricast);

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

  it('Result logic Senario I', () => {
    let eachWay = "EACH-WAY 1/3 1-2";
    let sortedTricast = {};
    let result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Horse, eachWay, runnerDetails.SenarioI, sortedTricast);

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
    let eachWay = "EACH-WAY 1/3 1-2";
    let sortedTricast = {};
    let result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Horse, eachWay, runnerDetails.SenarioJ, sortedTricast);

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
    let eachWay = "EACH-WAY 1/3 1-2";
    let sortedTricast = {};
    let result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Horse, eachWay, runnerDetails.SenarioK, sortedTricast);

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
  
  it('Result logic Senario L', () => {
    let eachWay = "EACH-WAY 1/3 1-2";
    let sortedTricast = {};
    let result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Horse, eachWay, runnerDetails.SenarioL, sortedTricast);

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

  
  
  it('Result logic Senario M', () => {
    let eachWay = "EACH-WAY 1/3 1-2-3";
    let sortedTricast = 0;
    let result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Horse, eachWay, runnerDetails.SenarioMN, sortedTricast);

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
    let eachWay = "EACH-WAY 1/3 1-2-3";
    let sortedTricast = {};
    let result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Horse, eachWay, runnerDetails.SenarioMN, sortedTricast);

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
    let eachWay = "EACH-WAY 1/3 1-2-3";
    let sortedTricast = 0;
    let result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Horse, eachWay, runnerDetails.SenarioOP, sortedTricast);

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
  
  
  it('Result logic Senario P', () => {
    let eachWay = "EACH-WAY 1/3 1-2-3";
    let sortedTricast = {};
    let result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Horse, eachWay, runnerDetails.SenarioOP, sortedTricast);

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

  
  
  it('Result logic Senario Q', () => {
    let eachWay = "EACH-WAY 1/3 1-2-3-4";
    let sortedTricast = 0;
    let result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Horse, eachWay, runnerDetails.SenarioQR, sortedTricast);

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
    let eachWay = "EACH-WAY 1/3 1-2-3-4";
    let sortedTricast = {};
    let result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Horse, eachWay, runnerDetails.SenarioQR, sortedTricast);

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
    let eachWay = "EACH-WAY 1/3 1-2-3-4";
    let sortedTricast = null;
    let result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Horse, eachWay, runnerDetails.SenarioST, sortedTricast);

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
    let eachWay = "EACH-WAY 1/3 1-2-3-4";
    let sortedTricast = {};
    let result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Horse, eachWay, runnerDetails.SenarioST, sortedTricast);

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
    let eachWay = "EACH-WAY 1/3 1-2-3-4-5";
    let sortedTricast = 0;
    let result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Horse, eachWay, runnerDetails.SenarioUV, sortedTricast);

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
    let eachWay = "EACH-WAY 1/3 1-2-3-4-5";
    let sortedTricast = {};
    let result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Horse, eachWay, runnerDetails.SenarioUV, sortedTricast);

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
    let eachWay = "EACH-WAY 1/3 1-2-3-4-5";
    let sortedTricast = null;
    let result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Horse, eachWay, runnerDetails.SenarioWX, sortedTricast);

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
    let eachWay = "EACH-WAY 1/3 1-2-3-4-5";
    let sortedTricast = {};
    let result = RunnerDetailsRacingEvent.setRunnerDetailsBasedOnSortedTricast(RunnerType.Horse, eachWay, runnerDetails.SenarioWX, sortedTricast);

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
