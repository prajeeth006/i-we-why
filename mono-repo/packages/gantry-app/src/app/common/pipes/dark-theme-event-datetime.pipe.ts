import { Pipe, PipeTransform } from '@angular/core';

interface DateTimeFormat {
    date: string;
    time: string;
}

@Pipe({
    name: 'darkThemeEventDatetime',
})
export class DarkThemeEventDatetimePipe implements PipeTransform {
    transform(value: Date | Date[]): DateTimeFormat {
        if (!value) return { date: '', time: '' };

        if (Array.isArray(value)) {
            // TODO: If this is no longer required need to refactor/remove this code block
            const startDate = new Date(value[0]);
            const endDate = new Date(value[1]);

            if (startDate.getMonth() === endDate.getMonth()) {
                return {
                    date: this.formatDate(startDate) + ' - ' + endDate.getDate() + ' ' + this.getAbbreviatedMonth(endDate),
                    time: this.formatTime(startDate),
                };
            } else {
                return {
                    date: this.formatDate(startDate) + ' - ' + this.formatDate(endDate),
                    time: '',
                };
            }
        } else {
            const eventDate = new Date(value);
            eventDate.setHours(0, 0, 0, 0); // Set to midnight
            const eventTime = new Date(value);
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0); // Set to midnight
            const diffInDays = Math.floor((eventDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
            if (diffInDays === 0) {
                return {
                    date: 'TODAY',
                    time: this.formatTime(eventTime),
                };
            } else if (diffInDays === 1) {
                return {
                    date: 'TOMORROW',
                    time: this.formatTime(eventTime),
                };
            } else if (diffInDays < 7) {
                return {
                    date: this.getAbbreviatedDay(eventTime),
                    time: this.formatTime(eventTime),
                };
            } else {
                return {
                    date: this.formatDate(eventDate),
                    time: this.formatTime(eventTime),
                };
            }
        }
    }

    private formatDate(date: Date): string {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Set to midnight
        const diffInDays = Math.floor((date.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));

        if (diffInDays >= 0 && diffInDays < 7) {
            // Within the same week, display only the date and abbreviated month
            return date.getDate() + ' ' + this.getAbbreviatedMonth(date);
        } else {
            // Otherwise, display the full date
            return date.getDate() + ' ' + this.getAbbreviatedMonth(date);
        }
    }

    public formatTime(date: Date): string {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

        if (minutes !== 0) {
            const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
            return `AT ${formattedHours}:${formattedMinutes}${ampm}`;
        } else {
            return `AT ${formattedHours}${ampm}`;
        }
    }

    public getAbbreviatedDay(date: Date): string {
        const options: Intl.DateTimeFormatOptions = { weekday: 'short' };
        return new Intl.DateTimeFormat('en-US', options).format(date).toUpperCase().substring(0, 3);
    }

    public getAbbreviatedMonth(date: Date): string {
        const options: Intl.DateTimeFormatOptions = { timeZone: 'Europe/London', month: 'short' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    }
}
