import { FixedDecimalPipe } from './fixed-decimal.pipe';

describe('FixedDecimalPipe', () => {
  const fixedDecimalPipe = new FixedDecimalPipe();
  it('create an instance', () => {
    const pipe = new FixedDecimalPipe();
    expect(pipe).toBeTruthy();
  });

  it('to check tote value', () => {
    let toteValue = "32.56789677";
    expect(fixedDecimalPipe.transform(toteValue?.trim())).toBe("32.56");
  });

});
