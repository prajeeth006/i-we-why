import { EventDatetimePipe } from './event-datetime.pipe';

describe('EventDatetimePipe', () => {
    it('create an instance', () => {
        const pipe = new EventDatetimePipe();
        expect(pipe).toBeTruthy();
    });
});
