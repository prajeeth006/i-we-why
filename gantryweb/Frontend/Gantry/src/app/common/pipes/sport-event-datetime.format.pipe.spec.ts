import { GantryCommonContent } from '../models/gantry-commom-content.model';
import { SportEventDateFormatPipe } from './sport-event-datetime-format.pipe'

describe('SportEventDateFormatPipe', () => {
  const sportEventDateFormatPipe = new SportEventDateFormatPipe();


  const gantryCommonContent: GantryCommonContent = {
    "contentParameters": {
      "Today": "TODAY",
      "Tomorrow": "TOMORROW"
    }
  };
  const timeFormat: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    timeStyle: 'short'
  }
  it('should be created', () => {
    const pipe = new SportEventDateFormatPipe();
    expect(pipe).toBeTruthy();
  });

  it('to getting today date from eventdate', () => {
    let utcDateTime = new Date().toISOString();
    let eventStartTime = new Date(utcDateTime);
    let eventDate = `${gantryCommonContent?.contentParameters?.Today} ${eventStartTime?.toLocaleString('en-us', { timeStyle: 'short' })}`;
    expect(sportEventDateFormatPipe.transform(eventStartTime, gantryCommonContent, timeFormat)).toBe(eventDate?.toUpperCase());
  });

  it('to getting tomorrow date from eventdate', () => {
    let utcDateTime = new Date().toISOString();
    let eventStartTime = new Date(utcDateTime);
    eventStartTime.setDate(eventStartTime.getDate() + 1);
    let todayDate: Date = new Date();
    if (eventStartTime?.getDate() - todayDate.getDate() == 0 && eventStartTime?.getMonth() == todayDate.getMonth() && eventStartTime?.getFullYear() == todayDate.getFullYear()) {
      let eventDate = gantryCommonContent?.contentParameters?.Today + " " + eventStartTime?.toLocaleString('en-us', { timeStyle: 'short' })
      expect(sportEventDateFormatPipe.transform(eventStartTime, gantryCommonContent, timeFormat)).toBe(eventDate?.toUpperCase());
    }
    else if (eventStartTime?.getDate() - todayDate.getDate() == 1 && eventStartTime?.getMonth() == todayDate.getMonth() && eventStartTime?.getFullYear() == todayDate.getFullYear()) {
      let eventDate = gantryCommonContent?.contentParameters?.Tomorrow + " " + eventStartTime?.toLocaleString('en-us', { timeStyle: 'short' })
      expect(sportEventDateFormatPipe.transform(eventStartTime, gantryCommonContent, timeFormat)).toBe(eventDate?.toUpperCase());
    }
    else {
      let eventDate = eventStartTime?.toLocaleString('en-us', { weekday: timeFormat.weekday }) + " " + eventStartTime?.toLocaleString('en-us', { timeStyle: timeFormat.timeStyle })
      expect(sportEventDateFormatPipe.transform(eventStartTime, gantryCommonContent, timeFormat)).toBe(eventDate?.toUpperCase());
    }
  });

  it('to getting future date from eventdate', () => {
    let eventStartTime = new Date("2022-12-30T23:00:00Z");
    let eventDate = eventStartTime?.toLocaleString('en-us', { weekday: timeFormat.weekday }) + " " + eventStartTime?.toLocaleString('en-us', { timeStyle: timeFormat.timeStyle })
    expect(sportEventDateFormatPipe.transform(eventStartTime, gantryCommonContent, timeFormat)).toBe(eventDate?.toUpperCase());
  });

  it('to getting short date from eventdate', () => {
    let eventStartTime = new Date("2022-06-04T15:00:00Z");
    const timeFormat: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      timeStyle: 'short'
    }
    let eventDate = eventStartTime?.toLocaleString('en-us', { timeStyle: timeFormat.timeStyle })
    expect(sportEventDateFormatPipe.transform(eventStartTime, gantryCommonContent, timeFormat)).toBe(eventDate?.toUpperCase());
  });

});
