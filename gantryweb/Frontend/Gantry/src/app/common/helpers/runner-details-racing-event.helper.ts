import { GreyhoundMeetingRunnerDetails } from "src/app/greyhound-racing/models/greyhound-racing-meeting-results.model";
import { Positions } from "src/app/greyhound-racing/models/greyhound-racing.enum";
import { PlaceDividend } from "../models/data-feed/meeting-results.model";
import { RunnerType, ToteTags } from "../models/racing-tags.model";

export class RunnerDetailsRacingEvent {
    static setRunnerDetails(runnerType?: string, runnerCount?: number, eachWay?: string, forecast?: string, tricast?: string, runnerList?: any) {
        if (!!runnerType) {
            let eachWayList = this.setEachWayDetails(eachWay);
            let eachWayFraction = eachWayList[0];
            let eachWayPlaces = eachWayList[1];
            let eachWayLastPlace = eachWayList[2];
            if (runnerType?.toUpperCase() == RunnerType.Horse || runnerType?.toUpperCase() == RunnerType.Motor) {
                runnerList = this.setRunnerDetailsForHorseRace(runnerCount, eachWayFraction, eachWayPlaces, eachWayLastPlace, forecast, tricast, runnerList);
            }
            else if (runnerType?.toUpperCase() == RunnerType.Dog) {
                runnerList = this.setRunnerDetailsForDogRace(runnerCount, eachWayFraction, eachWayPlaces, eachWayLastPlace, forecast, tricast, runnerList);
            }
        }
        return runnerList;
    }


    // New Result Logic implementation for both Horse and Greyhounds
    static setRunnerDetailsBasedOnSortedTricast(runnerType?: string, eachWay?: string, runnerList?: any, sortedTricast?: any) {
        if (!!runnerType) {
            if (runnerType?.toUpperCase() == RunnerType.Horse || runnerType?.toUpperCase() == RunnerType.Motor) {
                runnerList = runnerList?.sort((a: any, b: any) => Number(a.position) - Number(b.position) || Number(a.horseRunnerNumber) - Number(b.horseRunnerNumber));
            }
            else if (runnerType?.toUpperCase() == RunnerType.Dog) {
                runnerList = runnerList?.sort((a: any, b: any) => Number(a.position) - Number(b.position) || Number(a.runnerNumber) - Number(b.runnerNumber));
            }
            let eachWayList = this.setEachWayDetails(eachWay);
            let eachWayFraction = eachWayList[0];
            let eachWayPlaces = eachWayList[1];
            let eachWayLastPlace = eachWayList[2];
            runnerList = this.setRunnerDetailsForHorseAndDog(runnerType, eachWayFraction, eachWayPlaces, eachWayLastPlace, runnerList, sortedTricast);
        }
        return runnerList;
    }


    private static setRunnerDetailsForHorseAndDog(runnerType?: string, eachWayFraction?: string, eachWayPlaces?: string, eachWayLastPlace?: string, runnerList?: any, sortedTricast?: any) {
        var results =[];
        try{
            var pos1Count = runnerList?.filter((x: any) => x.position == "1")?.length;
            var pos2Count = runnerList?.filter((x: any) => x.position == "2")?.length;
            var pos3Count = runnerList?.filter((x: any) => x.position == "3")?.length;
            var pos4Count = runnerList?.filter((x: any) => x.position == "4")?.length;
            if(!sortedTricast || sortedTricast == 0){
                if(eachWayPlaces == "1"){
                    if(eachWayFraction == "1/1"){
                        if(pos1Count == 1 && pos2Count == 1){                                               //Senario - A
                            results = runnerList.filter((x: any) =>  x.position <= 2);
                            this.setForecastForPosition(results, 2);
                        } else if(pos1Count >= 2){                                                          //Senario - B
                            results = runnerList.filter((x: any) =>  x.position <= 1);
                        } else if(pos1Count == 1 && pos2Count >= 2){                                        //Senario - C
                            results = runnerList.filter((x: any) =>  x.position <= 2);
                            this.setForecastForPosition(results, 2);
                        } else {
                            results = runnerList.filter((x: any) =>  x.position == 1);                      //Alwayas should show the first position
                        }
                    }
                    else {
                        console.log('Nothing else to do with this case');
                    }
                }
                else if(eachWayPlaces == "1-2"){
                    if(pos1Count == 1 && pos2Count == 1){                                                   //Senario - D
                        results = runnerList.filter((x: any) =>  x.position <= 2);
                    } else if(pos1Count >= 2){                                                              //Senario - E
                        results = runnerList.filter((x: any) =>  x.position <= 1);
                    } else if(pos1Count == 1 && pos2Count >= 2){                                            //Senario - F
                        results = runnerList.filter((x: any) =>  x.position <= 2);
                    } else {
                        results = runnerList.filter((x: any) =>  x.position == 1);                          //Alwayas should show the first position
                    }
                }
                else if(eachWayPlaces == "1-2-3"){
                    if(pos1Count == 1 && pos2Count == 1 && pos3Count == 1){                                 //Senario - M
                        results = runnerList.filter((x: any) =>  x.position <= 3);
                    } else {                                                                                //Senario - O
                        results = runnerList.filter((x: any) =>  x.position <= 3);
                    }
                }
                else if(eachWayPlaces == "1-2-3-4"){
                    if(pos1Count == 1 && pos2Count == 1 && pos3Count == 1 && pos4Count == 1){               //Senario - Q
                        results = runnerList.filter((x: any) =>  x.position <= 4);
                    } else {                                                                                //Senario - S
                        results = runnerList.filter((x: any) =>  x.position <= 4);
                    }
                }
                else {
                    results = runnerList.filter((x: any) =>  x.position <= eachWayLastPlace);               //Senario - U and Senario - W
                }

            } else {

                if(eachWayPlaces == "1"){
                    console.log('Nothing else to do with this case');
                }
                else if(eachWayPlaces == "1-2"){
                    if(pos1Count == 1 && pos2Count == 1 && pos3Count == 1){                                 //Senario - G
                        results = runnerList.filter((x: any) =>  x.position <= 3);
                        this.setTricastForPosition(results, 3);
                    } else if(pos1Count == 2 && pos3Count == 1){                                            //Senario - H
                        results = runnerList.filter((x: any) =>  x.position == "1" || x.position == "3");
                        this.setTricastForPosition(results, 3);
                    } else if(pos1Count == 2 && pos3Count >= 2){                                            //Senario - I
                        results = runnerList.filter((x: any) =>  x.position == "1" || x.position == "3");
                        this.setTricastForPosition(results, 3);
                    } else if(pos1Count >= 3){                                                              //Senario - J
                        results = runnerList.filter((x: any) =>  x.position <= 1);
                    } else if(pos1Count == 1 && pos2Count >= 2){                                            //Senario - K
                        results = runnerList.filter((x: any) =>  x.position <= 2);
                    } else if(pos1Count == 1 && pos2Count == 1 && pos3Count >= 2){                          //Senario - L
                        results = runnerList.filter((x: any) =>  x.position <= 3);
                        this.setTricastForPosition(results, 3);
                    } else {
                        results = runnerList.filter((x: any) =>  x.position <= 2);                          //Alwayas should show the first position
                    }
                }
                else if(eachWayPlaces == "1-2-3"){
                    if(pos1Count == 1 && pos2Count == 1 && pos3Count == 1){                                 //Senario - N
                        results = runnerList.filter((x: any) =>  x.position <= 3);
                    } else {                                                                                //Senario - P
                        results = runnerList.filter((x: any) =>  x.position <= 3);
                    }
                }
                else if(eachWayPlaces == "1-2-3-4"){
                    if(pos1Count == 1 && pos2Count == 1 && pos3Count == 1 && pos4Count == 1){               //Senario - R
                        results = runnerList.filter((x: any) =>  x.position <= 4);
                    } else {                                                                                //Senario - T
                        results = runnerList.filter((x: any) =>  x.position <= 4);
                    }
                }
                else {
                    results = runnerList.filter((x: any) =>  x.position <= eachWayLastPlace);               //Senario - V and Senario - X
                }

            }

            if (runnerType?.toUpperCase() == RunnerType.Horse || runnerType?.toUpperCase() == RunnerType.Motor) {
                results = results?.sort((a: any, b: any) => (a.position ? -1 : 1) - (b.position ? -1 : 1) || Number(a.position) - Number(b.position) || Number(a.horseRunnerNumber) - Number(b.horseRunnerNumber));
            }
            else if (runnerType?.toUpperCase() == RunnerType.Dog) {
                results = results?.sort((a: any, b: any) => (a.position ? -1 : 1) - (b.position ? -1 : 1) || Number(a.position) - Number(b.position) || Number(a.runnerNumber) - Number(b.runnerNumber));
            }

        } catch(e){
            console.log(e);
        }

        return results;
    }
    private static setForecastForPosition(runnerList?: any, position?: number){
        runnerList.forEach((runner: any) => {
            if (runner.position == position) {
                runner.price = ToteTags.forecast;
                runner.horseOdds = ToteTags.forecast;
            }
        });
    }

    private static setTricastForPosition(runnerList?: any, position?: number){
        runnerList.forEach((runner: any) => {
            if (runner.position == position) {
                runner.price = ToteTags.tricast;
                runner.horseOdds = ToteTags.tricast;
            }
        });
    }



    private static setRunnerDetailsForHorseRace(runnerCount?: number, eachWayFraction?: string, eachWayPlaces?: string, eachWayLastPlace?: string, forecast?: string, tricast?: string, runnerList?: any) {
        if (runnerCount == 2) {
            if ((!eachWayFraction || eachWayFraction == "1/1") && !!runnerList) {
                runnerList = this.setRunnerList(1, runnerList);
            }
        }
        else if (runnerCount == 3 || runnerCount == 4) {
            if ((!eachWayFraction || eachWayFraction == "1/1") && !!runnerList) {
                runnerList = this.setRunnerList(2, runnerList);
                runnerList.forEach((runner: any) => {
                    if (runner.position == 2) {
                        runner.price = ToteTags.forecast;
                        runner.horseOdds = ToteTags.forecast;
                    }
                });
            }
        }
        else if (runnerCount == 5 || runnerCount == 6 || runnerCount == 7) {
            if ((!!eachWayPlaces && eachWayPlaces == "1-2") && !!runnerList) {
                runnerList = this.setRunnerList(tricast ? 3 : 2, runnerList);
                runnerList.forEach((runner: any) => {
                    if (runner.position == 3) {
                        runner.price = ToteTags.tricast;
                        runner.horseOdds = ToteTags.tricast;
                    }
                });
            }
        }
        else if (runnerCount >= 8) {
            if (!!eachWayLastPlace && Number(eachWayLastPlace) >= 3) {
                runnerList = this.setRunnerList(Number(eachWayLastPlace), runnerList);
            }
        }
        return runnerList;
    }

    private static setRunnerDetailsForDogRace(runnerCount?: number, eachWayFraction?: string, eachWayPlaces?: string, eachWayLastPlace?: string, forecast?: string, tricast?: string, runnerList?: any) {
        let isDeadHeat: boolean = false;
        if (runnerCount == 2) {
            if ((!eachWayFraction || eachWayFraction == "1/1") && !!runnerList) {
                isDeadHeat = this.setDeadHeat(runnerList, isDeadHeat);
                if (isDeadHeat) {
                    //If deadheat runners coming then prepare sorting based on runners
                    this.prepareSortingDeadHeat(runnerList);
                }
                runnerList = this.setRunnerList(1, runnerList);
            }
        }
        else if (runnerCount == 3 || runnerCount == 4) {
            if ((!eachWayFraction || eachWayFraction == "1/1") && !!runnerList) {
                runnerList = this.setRunnerList(2, runnerList);
                isDeadHeat = this.setDeadHeat(runnerList, isDeadHeat);
                if (isDeadHeat) {
                    //If deadheat runners coming then prepare sorting based on runners
                    this.prepareSortingDeadHeat(runnerList);
                    runnerList = this.setRunnerList(2, runnerList);
                }
                runnerList.forEach((runner: any) => {
                    if (runner.position == 2) {
                        runner.price = ToteTags.forecast;
                    }
                });
            }
        }
        else if (runnerCount == 5) {
            if ((!!eachWayPlaces && eachWayPlaces == "1-2") && !!runnerList) {
                isDeadHeat = this.setDeadHeat(runnerList, isDeadHeat);
                if (isDeadHeat) {
                    //If deadheat runners coming then prepare sorting based on runners
                    this.prepareSortingDeadHeat(runnerList);
                }
                runnerList = this.setRunnerList(2, runnerList);
            }
        }
        else if (runnerCount == 6 || runnerCount == 7) {
            if ((!!eachWayPlaces && eachWayPlaces == "1-2") && !!runnerList) {
                runnerList = this.setRunnerList(3, runnerList);
                isDeadHeat = this.setDeadHeat(runnerList, isDeadHeat);
                if (isDeadHeat) {
                    //If deadheat runners coming then prepare sorting based on runners
                    this.prepareSortingDeadHeat(runnerList);
                    runnerList = this.setRunnerList(3, runnerList);
                }
                runnerList.forEach((runner: any) => {
                    if (runner.position == 3) {
                        runner.price = ToteTags.tricast;
                    }
                });
            }
        }
        else if (runnerCount >= 8) {
            if (!!eachWayLastPlace && Number(eachWayLastPlace) >= 3) {
                isDeadHeat = this.setDeadHeat(runnerList, isDeadHeat);
                if (isDeadHeat) {
                    //If deadheat runners coming then prepare sorting based on runners
                    this.prepareSortingDeadHeat(runnerList);
                }
                runnerList = this.setRunnerList(Number(eachWayLastPlace), runnerList);
            }
        }
        return runnerList;
    }

    private static setEachWayDetails(eachWay?: string) {
        let eachWayList: Array<string> = [];
        let eachWayFraction = "";
        let eachWayPlaces = "";
        let eachWayLastPlace = "";
        if (!!eachWay) {
            let terms = eachWay?.split(' ');
            if (!!terms[1]) {
                eachWayFraction = terms[1];
            }
            eachWayPlaces = terms[2];
            let places = eachWayPlaces?.split('-');
            if (!!places) eachWayLastPlace = (places[places.length - 1]).toString();
        }
        !!eachWayFraction ? eachWayList.push(eachWayFraction) : eachWayList.push("");
        !!eachWayPlaces ? eachWayList.push(eachWayPlaces) : eachWayList.push("");
        !!eachWayLastPlace ? eachWayList.push(eachWayLastPlace) : eachWayList.push("");
        return eachWayList;
    }

    private static setRunnerList(runnerListPosition?: number, runnerList?: any) {
        let tempList = [];
        for (let i = 0; i < runnerList?.length; i++) {
            if (!!runnerList[i]?.position) {
                if (runnerList[i]?.position <= runnerListPosition) {
                    tempList.push(runnerList[i]);
                }
            }
        }

        tempList?.sort((a, b) =>
            (a.position ? -1 : 1) -
            (b.position ? -1 : 1) ||
            (Number(a.position) - Number(b.position))
        );

        return tempList;
    }

    private static setDeadHeat(runnerList: GreyhoundMeetingRunnerDetails[], isDeadHeat: boolean): boolean {
        const findRunnerPositions = runnerList
            .map((checkPosition, i) => {
                return runnerList?.find((runner, index) => {
                    if (i !== index && runner?.position === checkPosition?.position) {
                        return checkPosition
                    }
                })
            });
        findRunnerPositions?.forEach(runnerPosition => {
            if (runnerPosition?.position == Positions.One || runnerPosition?.position == Positions.Two || runnerPosition?.position == Positions.Three) {
                runnerPosition.isDeadHeat = true;
                isDeadHeat = true;
            }
        });
        return isDeadHeat;
    }

    private static prepareSortingDeadHeat(runnerList: GreyhoundMeetingRunnerDetails[]) {
        runnerList?.sort((a: any, b: any) =>
            (a.runnerNumber ? -1 : 1) -
            (b.runnerNumber ? -1 : 1) ||
            (Number(a.runnerNumber) - Number(b.runnerNumber))
        );
    }

    static setPlaceDividends(placeDividends: PlaceDividend[]) {
        if (!!placeDividends) {
            placeDividends.sort((dividend1, dividend2) => {
                return this.sortPlaceDividends(dividend1.position, dividend2.position) || this.sortPlaceDividends(dividend1.runnerNumber, dividend2.runnerNumber)
            });
        }
        return placeDividends;
    }

    static sortPlaceDividends(dividend1: any, dividend2: any): number {
        return dividend1 === dividend2 ? 0 : dividend1 < dividend2 ? -1 : 1;
    };
}