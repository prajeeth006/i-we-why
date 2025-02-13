import { GantryCommonContent } from '../models/gantry-commom-content.model';
import { SportEventDateFormatPipe } from './sport-event-datetime-format.pipe';

describe('SportEventDateFormatPipe', () => {
    const sportEventDateFormatPipe = new SportEventDateFormatPipe();

    const gantryCommonContent: GantryCommonContent = {
        contentParameters: {
            Today: 'TODAY',
            Tomorrow: 'TOMORROW',
        },
    };
    const timeFormat: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        timeStyle: 'short',
    };
    it('should be created', () => {
        const pipe = new SportEventDateFormatPipe();
        expect(pipe).toBeTruthy();
    });

    it('to getting today date from eventdate', () => {
        const utcDateTime = new Date().toISOString();
        const eventStartTime = new Date(utcDateTime);
        const eventDate = `${gantryCommonContent?.contentParameters?.Today ?? ''} ${eventStartTime?.toLocaleString('en-us', {
            timeStyle: 'short',
        })}`;
        expect(sportEventDateFormatPipe.transform(eventStartTime, gantryCommonContent, timeFormat)).toBe(eventDate?.toUpperCase());
    });

    it('to getting tomorrow date from eventdate', () => {
        const utcDateTime = new Date().toISOString();
        const eventStartTime = new Date(utcDateTime);
        eventStartTime.setDate(eventStartTime.getDate() + 1);
        const todayDate: Date = new Date();
        if (
            eventStartTime?.getDate() - todayDate.getDate() == 0 &&
            eventStartTime?.getMonth() == todayDate.getMonth() &&
            eventStartTime?.getFullYear() == todayDate.getFullYear()
        ) {
            const eventDate =
                (gantryCommonContent?.contentParameters?.Today ?? '') + ' ' + eventStartTime?.toLocaleString('en-us', { timeStyle: 'short' });
            expect(sportEventDateFormatPipe.transform(eventStartTime, gantryCommonContent, timeFormat)).toBe(eventDate?.toUpperCase());
        } else if (
            eventStartTime?.getDate() - todayDate.getDate() == 1 &&
            eventStartTime?.getMonth() == todayDate.getMonth() &&
            eventStartTime?.getFullYear() == todayDate.getFullYear()
        ) {
            const eventDate =
                (gantryCommonContent?.contentParameters?.Tomorrow ?? '') + ' ' + eventStartTime?.toLocaleString('en-us', { timeStyle: 'short' });
            expect(sportEventDateFormatPipe.transform(eventStartTime, gantryCommonContent, timeFormat)).toBe(eventDate?.toUpperCase());
        } else {
            const eventDate =
                eventStartTime?.toLocaleString('en-us', { weekday: timeFormat.weekday }) +
                ' ' +
                eventStartTime?.toLocaleString('en-us', { timeStyle: timeFormat.timeStyle });
            expect(sportEventDateFormatPipe.transform(eventStartTime, gantryCommonContent, timeFormat)).toBe(eventDate?.toUpperCase());
        }
    });

    it('to getting future date from eventdate', () => {
        const eventStartTime = new Date('2022-12-30T23:00:00Z');
        const eventDate =
            eventStartTime?.toLocaleString('en-us', { weekday: timeFormat.weekday }) +
            ' ' +
            eventStartTime?.toLocaleString('en-us', { timeStyle: timeFormat.timeStyle });
        expect(sportEventDateFormatPipe.transform(eventStartTime, gantryCommonContent, timeFormat)).toBe(eventDate?.toUpperCase());
    });

    it('to getting short date from eventdate', () => {
        const eventStartTime = new Date('2022-06-04T15:00:00Z');
        const timeFormat: Intl.DateTimeFormatOptions = {
            weekday: 'short',
            timeStyle: 'short',
        };
        const eventDate = eventStartTime?.toLocaleString('en-us', { timeStyle: timeFormat.timeStyle });
        expect(sportEventDateFormatPipe.transform(eventStartTime, gantryCommonContent, timeFormat)).toBe(eventDate?.toUpperCase());
    });
});
