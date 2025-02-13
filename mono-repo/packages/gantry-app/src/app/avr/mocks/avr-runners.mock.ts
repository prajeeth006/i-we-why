import { ResultDetails } from '../models/avr-template.model';

export class AVRRunners {
    /**
     *
     * @param count number of Runners to generate
     * @returns ResultDetails[]
     */
    generateRunnersList = (count: number): ResultDetails[] => {
        const resultList: ResultDetails[] = [];

        for (let i = 1; i <= count; i++) {
            const result: ResultDetails = {
                runnerNumber: i.toString(),
                runnerName: `Runner${i}`,
                price: (i * 10).toString(),
                isFavourite: i === 1,
                imageSourceUrl: `https://silks-stg.coral.co.uk/VR/images/AVR/horses/${i}.png`,
                position: '',
                favourite: '',
            };

            resultList.push(result);
        }

        return resultList;
    };
}
