import { StringHelper } from '../helpers/string.helper';
import { EventDatetimeChangeformatPipe } from './event-datetime.changeformat.pipe';

describe('EventDatetimeChangeformatPipe', () => {
  it('create an instance', () => {
    const pipe = new EventDatetimeChangeformatPipe();
    expect(pipe).toBeTruthy();
  });

  it('convert utc time to bst time in am', () => {
    let eventStartTime = new Date("2022-05-19T08:12:00Z");
    expect(StringHelper.getBtcTime(eventStartTime)).toBe("09:12");
  });

  it('convert utc time to bst time in pm', () => {
    let eventStartTime = new Date("2022-05-19T18:12:00Z");
    expect(StringHelper.getBtcTime(eventStartTime)).toBe("7:12");
  });

  it('convert utc time to bst time in am', () => {
    let eventStartTime = new Date("2022-05-19T23:00:00Z");
    expect(StringHelper.getBtcTime(eventStartTime)).toBe("12:00");
  });
});
