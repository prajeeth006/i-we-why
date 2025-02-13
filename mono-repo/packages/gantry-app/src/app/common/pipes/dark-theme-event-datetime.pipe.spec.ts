import { TestBed } from '@angular/core/testing';

import { DarkThemeEventDatetimePipe } from './dark-theme-event-datetime.pipe';

describe('DarkThemeEventDatetimePipe', () => {
    let pipe: DarkThemeEventDatetimePipe;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DarkThemeEventDatetimePipe],
        });
        pipe = TestBed.inject(DarkThemeEventDatetimePipe);
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return empty date and time when value is null', () => {
        const result = pipe.transform(null);
        expect(result).toEqual({ date: '', time: '' });
    });

    it('should format a single date correctly', () => {
        const date = new Date();
        const time = pipe.formatTime(new Date());
        const result = pipe.transform(date);
        expect(result).toEqual({ date: 'TODAY', time: time });
    });

    it('should format date and time for an event happening today', () => {
        const today = new Date();
        today.setHours(14, 30); // 2:30 PM
        const result = pipe.transform(today);

        expect(result).toEqual({ date: 'TODAY', time: 'AT 2:30PM' });
    });

    it('should format date and time for an event happening tomorrow', () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0); // 10:00 AM

        const result = pipe.transform(tomorrow);

        expect(result).toEqual({ date: 'TOMORROW', time: 'AT 10AM' });
    });

    it('should format date and time for an event happening within the same week', () => {
        const eventDate = new Date();
        eventDate.setDate(eventDate.getDate() + 3); // 3 days later
        eventDate.setHours(9, 15); // 9:15 AM

        const result = pipe.transform(eventDate);

        expect(result.date).toBe('' + pipe.getAbbreviatedDay(eventDate)); // e.g., "FRI"
        expect(result.time).toBe('AT 9:15AM');
    });

    it('should format date and time for an event happening more than a week away', () => {
        const eventDate = new Date();
        eventDate.setDate(eventDate.getDate() + 10); // 10 days later
        eventDate.setHours(18, 45); // 6:45 PM

        const result = pipe.transform(eventDate);

        expect(result.date).toBe(`${eventDate.getDate()} ${pipe.getAbbreviatedMonth(eventDate)}`); // e.g., "13 Oct"
        expect(result.time).toBe('AT 6:45PM');
    });

    it('should return empty strings for invalid input', () => {
        const result = pipe.transform(null);

        expect(result).toEqual({ date: '', time: '' });
    });

    it('should format time with minutes if they are not zero', () => {
        const date = new Date();
        date.setHours(16, 5); // 4:05 PM

        const time = pipe.formatTime(date);

        expect(time).toBe('AT 4:05PM');
    });

    it('should format time without minutes if they are zero', () => {
        const date = new Date();
        date.setHours(16, 0); // 4:00 PM

        const time = pipe.formatTime(date);

        expect(time).toBe('AT 4PM');
    });
});
