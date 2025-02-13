import { TitleCaseExceptPipePipe } from './title-case-except-pipe.pipe';

describe('TitleCaseExceptPipePipe', () => {
    let pipe: TitleCaseExceptPipePipe;

    beforeEach(() => {
        pipe = new TitleCaseExceptPipePipe();
    });

    it('should create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return "ODI Match" if we pass "odi match"', () => {
        const expectedStr = pipe.transform('odi match', 'odi');
        expect(expectedStr).toEqual('ODI Match');
    });

    it('should return "KO / TKO / Technical Decision or DQ" if we pass "ko / tko / technical decision or dq"', () => {
        const expectedStr = pipe.transform('ko / tko / technical decision or dq', 'ko,tko,dq');
        expect(expectedStr).toEqual('KO / TKO / Technical Decision or DQ');
    });

    it('should return "ICC Trophy" if we pass "icc trophy"', () => {
        const expectedStr = pipe.transform('icc trophy', 'icc');
        expect(expectedStr).toEqual('ICC Trophy');
    });
});
