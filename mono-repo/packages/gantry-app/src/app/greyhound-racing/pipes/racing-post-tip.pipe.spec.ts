import { RacingPostTipPipe } from './racing-post-tip.pipe';

describe('RacingPostTipPipe', () => {
    let pipe: RacingPostTipPipe;

    beforeEach(() => {
        pipe = new RacingPostTipPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should transform array of strings to hyphen-separated string with napOrNb', () => {
        const result = pipe.transform(['1', '6', '2'], 'NAP');
        expect(result).toBe('1-6-2 NAP');
    });

    it('should transform array of strings to hyphen-separated string without napOrNb', () => {
        const result = pipe.transform(['1', '6', '2'], '');
        expect(result).toBe('1-6-2');
    });

    it('should transform single-element array to string with napOrNb', () => {
        const result = pipe.transform(['1'], 'NB');
        expect(result).toBe('1 NB');
    });

    it('should transform single-element array to string without napOrNb', () => {
        const result = pipe.transform(['1'], '');
        expect(result).toBe('1');
    });

    it('should handle null or undefined napOrNb gracefully', () => {
        const result = pipe.transform(['1', '6', '2'], null);
        expect(result).toBe('1-6-2');
    });
});
