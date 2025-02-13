import { MarketNameFormatPipe } from './market-name-format.pipe';
import { Constants } from 'src/app/display-manager/display-manager-right-panel/constants/constants'; // Adjust the path if necessary

describe('MarketNameFormatPipe', () => {
  let pipe: MarketNameFormatPipe;

  // Initialize the pipe before each test case
  beforeEach(() => {
    pipe = new MarketNameFormatPipe();
  });

  // Test for transforming "Win or Each Way" to "Win / Each Way"
  it('should transform "Win or Each Way" to "Win / Each Way"', () => {
    const result = pipe.transform(Constants.win_or_each_way);
    expect(result).toBe(Constants.win_slash_each_way);
  });

  // Test for handling "Betting without Peach Pass" to "Betting WO"
  it('should transform "Betting without Peach Pass" to "Betting WO"', () => {
    const result = pipe.transform(`Betting without ${Constants.betting_without}`);
    expect(result).toBe(Constants.betting_wo);
  });

  // Test for handling other market names that should remain unchanged
  it('should return the same value for market names that do not match the conditions', () => {
    const marketName = "Top 2 Finish";
    const result = pipe.transform(marketName);
    expect(result).toBe(marketName);
  });

  // Test for empty or undefined input
  it('should return empty string for empty input', () => {
    const result = pipe.transform('');
    expect(result).toBe('');
  });
});
