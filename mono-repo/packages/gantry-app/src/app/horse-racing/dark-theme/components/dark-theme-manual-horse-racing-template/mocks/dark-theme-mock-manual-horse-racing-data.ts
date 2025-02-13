import { BrandImageContent } from 'packages/gantry-app/src/app/common/components/error/models/error-content.model';

import { ManualHorseRacingRunners, ManualHorseRacingTemplateResult } from '../../../../models/horse-racing-manual-template.model';

export const MOCK_MANUAL_HORSE_RACING: ManualHorseRacingTemplateResult = {
    timehrs: '12',
    timemins: '02',
    category: 'Horseracing',
    meetingName: 'qwerty',
    race: '1',
    activerows: 6,
    raceoff: false,
    isEventResulted: true,
    eachway: '3 places 1/4 odds',
    run: '1',
    distance: '12',
    going: 'rer',
    ran: '12',
    forecast: '',
    tricast: '',
    win: '',
    place: '',
    exacta: '',
    trifecta: '',
    Runners: [
        {
            finished: 1,
            horseNumber: '1',
            horseName: 'rerdrdrdtrdlkjljljjpjojojhtftffd (RES)',
            jockeyName: 'rere',
            price_odds_sp: '10/11', // show price
            odds_sp: null, // ignore
            result_odds_sp: '10/11', // result price
            isStartPrice: false, // true show 'SP'
            isNonRunner: false, // NR
            isFavourite: true,
        },
        {
            finished: 2,
            horseNumber: '2',
            horseName: 'erer',
            jockeyName: 'erer',
            price_odds_sp: '11/3',
            result_odds_sp: '11/3',
            odds_sp: null,
            isStartPrice: false,
            isNonRunner: true,
            isFavourite: true,
        },
        {
            finished: 3,
            horseNumber: '3',
            horseName: 'rer',
            jockeyName: 'rer',
            price_odds_sp: '1',
            result_odds_sp: '1',
            odds_sp: null,
            isStartPrice: false,
            isNonRunner: false,
            isFavourite: false,
        },
        {
            finished: 4,
            horseNumber: '4',
            horseName: 'rer',
            jockeyName: 'erererer',
            price_odds_sp: '1',
            result_odds_sp: '1',
            odds_sp: null,
            isStartPrice: false,
            isNonRunner: false,
            isFavourite: true,
        },
        {
            finished: 5,
            horseNumber: '5',
            horseName: 'asdsf',
            jockeyName: 'fdsfdsf',
            price_odds_sp: '2',
            result_odds_sp: '2',
            odds_sp: null,
            isStartPrice: false,
            isNonRunner: false,
            isFavourite: false,
        },
        {
            finished: 6,
            horseNumber: '6',
            horseName: 'sfddsf',
            jockeyName: 'fsdfdsf',
            price_odds_sp: '4',
            result_odds_sp: '4',
            odds_sp: null,
            isStartPrice: false,
            isNonRunner: false,
            isFavourite: false,
        },
        {
            finished: 7,
            horseNumber: '7',
            horseName: 'sfddsf',
            jockeyName: 'fsdfdsf',
            price_odds_sp: '7/2',
            result_odds_sp: '7/2',
            odds_sp: null,
            isStartPrice: false,
            isNonRunner: false,
            isFavourite: false,
        },
        {
            finished: 8,
            horseNumber: '8',
            horseName: 'sfddsf',
            jockeyName: 'fsdfdsf',
            price_odds_sp: '2/11',
            result_odds_sp: '2/11',
            odds_sp: null,
            isStartPrice: false,
            isNonRunner: false,
            isFavourite: false,
        },
        {
            finished: 9,
            horseNumber: '9',
            horseName: 'sfddsf',
            jockeyName: 'fsdfdsf',
            price_odds_sp: '9',
            result_odds_sp: '9',
            odds_sp: null,
            isStartPrice: false,
            isNonRunner: false,
            isFavourite: false,
        },
        {
            finished: 10,
            horseNumber: '10',
            horseName: 'sfddsf',
            jockeyName: 'fsdfdsf',
            price_odds_sp: '2/5',
            result_odds_sp: '2/5',
            odds_sp: null,
            isStartPrice: false,
            isNonRunner: false,
            isFavourite: false,
        },
        {
            finished: 11,
            horseNumber: '11',
            horseName: 'sfddsf',
            jockeyName: 'fsdfdsf',
            price_odds_sp: '9/2',
            result_odds_sp: '9/2',
            odds_sp: null,
            isStartPrice: false,
            isNonRunner: false,
            isFavourite: false,
        },
        {
            finished: 12,
            horseNumber: '12',
            horseName: 'sfddsf',
            jockeyName: 'fsdfdsf',
            price_odds_sp: '2',
            result_odds_sp: '2',
            odds_sp: null,
            isStartPrice: false,
            isNonRunner: false,
            isFavourite: false,
        },
    ],
};

export const MOCK_BrandImage_Content: BrandImageContent = {
    brandImage: {
        src: 'testimage',
        alt: 'image',
        width: 10,
        height: 5,
    },
};

export class MockManualHorseRacingResponse {
    isAnyEventResulted: true;
    manualHorseRacingRunners: ManualHorseRacingRunners = {
        horseRacingContent: {
            racingPostImage: null,
            horseRacingImage: null,
            greyHoundRacingImage: null,
            darkThemeRacingPostImage: null,
            contentParameters: {
                attr: '8.5',
            },
            epsFooterLogoNewDesign: null,
        },
        eventTimePlusTypeName: '',
        categoryName: 'HORSE RACING',
        racingContent: {
            raceNo: 4,
            distance: '480m',
            going: '-20',
        },
        horseRacingEntries: [
            {
                horseNumber: '8',
                horseName: 'Glenview Beauty',
                jockeyName: 'Harry Reed',
                nonRunner: true,
                isStartPrice: true,
                currentPrice: 0,
                fractionPrice: '12/2',
                jockeySilkImage: 'Default',
                isReserved: true,
            },
            {
                horseNumber: '5',
                horseName: 'Sean Bowen',
                jockeyName: 'Fairy Gem',
                nonRunner: false,
                isStartPrice: true,
                currentPrice: 0,
                fractionPrice: '10/2',
                jockeySilkImage: 'Default',
                isReserved: true,
            },
        ],
        isRaceOff: true,
        runnerCount: '16',
        marketEachWayString: 'EACH-WAY: 1/4 ODDS, 2 PLACES',
        bettingFavouritePrice: 12,
        eventTime: '11:00',
        eventTitle: 'Horse Racing',
    };
}

export class MockManualHorseRunners {
    finished: 123;
    horseNumber: '2';
    horseName: 'Annie Wicks';
    jockeyName: 'Adam Wedge';
    price_odds_sp: '1/12';
    odds_sp: null;
    result_odds_sp: '9/2';
    isStartPrice: true;
    isNonRunner: true;
    isFavourite: true;
}
