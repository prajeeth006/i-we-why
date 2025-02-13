import { VacantCheckTransformPipe } from './vacant-check-transform.pipe';

describe('MarketPriceTransformPipe', () => {
    it('create an instance', () => {
        const pipe = new VacantCheckTransformPipe();
        expect(pipe).toBeTruthy();
    });
});
