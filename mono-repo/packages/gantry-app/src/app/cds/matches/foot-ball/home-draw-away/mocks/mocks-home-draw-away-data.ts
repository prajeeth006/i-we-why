import { GantryCommonContent } from '../../../../../common/models/gantry-commom-content.model';
import { HomeDrawAway } from '../models/home-draw-away-content.model';

export class Mock1 {
    staticContent: GantryCommonContent = {
        contentParameters: {
            Abandoned: 'ABANDONED',
            Away: 'AWAY',
            CoralPrice: 'EARLY PRICE',
            Draw: 'DRAW',
            EachWay: 'EACH-WAY',
            Eighteen: '18',
            EventTimeInfo: '{0}',
            Home: 'HOME',
            LiveShow: 'LIVE PRICE',
            Odds: 'ODDS',
            PhotoFinish: 'PHOTO FINISH',
            Places: 'PLACES',
            RaceOff: 'RACE OFF',
            SeventeenNumber: '17',
            StewardsEnquiry: 'STEWARDS ENQUIRY',
            Time: 'TIME',
            Today: 'TODAY',
            Tomorrow: 'TOMORROW',
            TwentyOneNumber: '21',
            VirtualRacing: 'VIRTUAL RACING',
            WeekendCoupon: 'FEATURED FOOTBALL',
            WinningDistanceMaxDistancePerRace: 'MAX DISTANCE PER RACES = JUMPS 30L (WALKOVER 12L) / FLAT 12L (WALKOVER 5L)',
            WinOnly: 'WIN ONLY',
            Withdrawn: 'WITHDRAWN',
        },
    };

    HomeDrawAwaySelectionResponse: HomeDrawAway[] = [
        {
            eventName: 'ALHAMA CF (WOMEN) VS ATLETICO MADRID (WOMEN)',
            eventTime: '',
            eventDateTime: new Date('2023-05-23T19:00:00Z'),
            awaySelection: {
                selectionName: 'ATLETICO MADRID (WOMEN)',
                price: '2/7',
            },
            drawSelection: {
                price: '4',
                selectionName: '',
            },
            homeSelection: {
                selectionName: 'ALHAMA CF (WOMEN)',
                price: '15/2',
            },
        },
        {
            eventName: 'ABC FC RN VS TOMBENSE FC MG',
            eventTime: '',
            eventDateTime: new Date('2022-11-29T15:00:00Z'),
            awaySelection: {
                selectionName: 'TOMBENSE FC MG',
                price: '2',
            },
            drawSelection: {
                price: '21/10',
                selectionName: '',
            },
            homeSelection: {
                selectionName: 'ABC FC RN',
                price: '23/20',
            },
        },

        {
            eventName: 'AL-FAISALY FC VS AL-AIN FC',
            eventTime: '',
            eventDateTime: new Date('2023-05-23T18:00:00Z'),
            homeSelection: {
                selectionName: 'AL-FAISALY FC',
                price: '19/20',
            },
            drawSelection: {
                price: '11/5',
                selectionName: '',
            },
            awaySelection: {
                selectionName: 'AL-AIN FC',
                price: '5/2',
            },
        },
    ];

    HomeDrawAwaySelectionExpected: HomeDrawAway[] = [
        {
            eventName: 'ABC FC RN VS TOMBENSE FC MG',
            eventTime: '',
            eventDateTime: new Date('2023-05-23T18:00:00Z'),
            awaySelection: {
                selectionName: 'TOMBENSE FC MG',
                price: '2',
            },
            drawSelection: {
                price: '21/10',

                selectionName: '',
            },
            homeSelection: {
                selectionName: 'ABC FC RN',
                price: '23/20',
            },
        },
        {
            eventName: 'AL-FAISALY FC VS AL-AIN FC',
            eventTime: '',
            eventDateTime: new Date('2023-05-23T18:00:00Z'),
            homeSelection: {
                selectionName: 'AL-FAISALY FC',
                price: '19/20',
            },
            drawSelection: {
                price: '11/5',
                selectionName: '',
            },
            awaySelection: {
                selectionName: 'AL-AIN FC',
                price: '5/2',
            },
        },
        {
            eventName: 'ALHAMA CF (WOMEN) VS ATLETICO MADRID (WOMEN)',
            eventTime: '',
            eventDateTime: new Date('2023-05-23T19:00:00Z'),
            awaySelection: {
                selectionName: 'ATLETICO MADRID (WOMEN)',
                price: '2/7',
            },
            drawSelection: {
                price: '4',
                selectionName: '',
            },
            homeSelection: {
                selectionName: 'ALHAMA CF (WOMEN)',
                price: '15/2',
            },
        },
    ];

    homeDrawAwayEvent: HomeDrawAway[] = [
        {
            eventName: 'FA EURO - NEW YORK MAGIC (WOMEN) VS MANHATTAN SC (WOMEN)',
            eventTime: '',
            eventDateTime: new Date('2023-06-07T00:30:00Z'),
            homeSelection: {
                selectionName: 'FA EURO - NEW YORK MAGIC (WOMEN)',
                price: '8/5',
            },
            awaySelection: {
                selectionName: 'MANHATTAN SC (WOMEN)',
                price: '23/20',
            },
            drawSelection: {
                price: '11/4',
                selectionName: '',
            },
        },
        {
            eventName: 'DEPORTIVO CAMIONEROS (RESERVES) VS CA ESTUDIANTES (RESERVES)',
            eventTime: '',
            eventDateTime: new Date('2023-06-07T13:00:00Z'),
            homeSelection: {
                selectionName: 'DEPORTIVO CAMIONEROS (RESERVES)',
                price: '5/4',
            },
            drawSelection: {
                price: '6/4',
                selectionName: '',
            },
            awaySelection: {
                selectionName: 'CA ESTUDIANTES (RESERVES)',
                price: '13/5',
            },
        },
        {
            eventName: 'KEDAH DARUL AMAN VS PERAK FC',
            eventTime: '',
            eventDateTime: new Date('2023-06-07T13:00:00Z'),
            awaySelection: {
                selectionName: 'PERAK FC',
                price: '50',
            },
            drawSelection: {
                price: '14',
                selectionName: '',
            },
            homeSelection: {
                selectionName: 'KEDAH DARUL AMAN',
                price: '1/40',
            },
        },
        {
            eventName: 'RIOSTRENSE EC RJ VS MESQUITA RJ',
            eventTime: '',
            eventDateTime: new Date('2023-06-07T13:00:00Z'),
            drawSelection: {
                price: '29/10',
                selectionName: '',
            },
            awaySelection: {
                selectionName: 'MESQUITA RJ',
                price: '1/2',
            },
            homeSelection: {
                selectionName: 'RIOSTRENSE EC RJ',
                price: '9/2',
            },
        },
        {
            eventName: 'CSM RESITA VS CSM DEVA',
            eventTime: '',
            eventDateTime: new Date('2023-06-07T14:30:00Z'),
            drawSelection: {
                price: '7/2',
                selectionName: '',
            },
            homeSelection: {
                selectionName: 'CSM RESITA',
                price: '2/5',
            },
            awaySelection: {
                selectionName: 'CSM DEVA',
                price: '19/4',
            },
        },
        {
            eventName: 'CHELGHOUM LAID (U21) VS ES SETIF (U21)',
            eventTime: '',
            eventDateTime: new Date('2023-06-07T15:00:00Z'),
            awaySelection: {
                selectionName: 'ES SETIF (U21)',
                price: '2/5',
            },
            homeSelection: {
                selectionName: 'CHELGHOUM LAID (U21)',
                price: '5',
            },
            drawSelection: {
                price: '16/5',
                selectionName: '',
            },
        },
        {
            eventName: 'CS CONSTANTINE (U21) VS RC ARBA (U21)',
            eventTime: '',
            eventDateTime: new Date('2023-06-07T15:00:00Z'),
            awaySelection: {
                selectionName: 'RC ARBA (U21)',
                price: '18',
            },
            drawSelection: {
                price: '9',
                selectionName: '',
            },
            homeSelection: {
                selectionName: 'CS CONSTANTINE (U21)',
                price: '1/12',
            },
        },
        {
            eventName: 'DEPORTES IQUIQUE (WOMEN) VS DEPORTES ANTOFAGASTA (WOMEN)',
            eventTime: '',
            eventDateTime: new Date('2023-06-07T15:00:00Z'),
            awaySelection: {
                selectionName: 'DEPORTES ANTOFAGASTA (WOMEN)',
                price: '1',
            },
            drawSelection: {
                price: '3',
                selectionName: '',
            },
            homeSelection: {
                selectionName: 'DEPORTES IQUIQUE (WOMEN)',
                price: '17/10',
            },
        },
    ];
}
