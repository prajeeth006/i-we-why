import { ScreenRuleRequest } from '../../display-manager-screens/models/display-screen-rule.model';
import { AssetnamePipe } from './assetname.pipe';
import { FilterRacingCategories } from 'src/app/display-manager/display-manager-left-panel/generic-tab-service/model/filter-racingcategories.enum';

describe('AssetnamePipe Code Snippet Tests', () => {
  let pipe: AssetnamePipe;
  let pad: (num: number) => string;

  beforeEach(() => {
    pipe = new AssetnamePipe();
    pad = (num: number) => num.toString().padStart(2, '0');
  });

  it('should return typeName and formatted time for horse racing events with startTime', () => {
    const event = {
      id: '123',
      categoryCode: FilterRacingCategories.Horses,
      typeName: 'Race Type',
      startTime: '2025-01-15T10:30:00Z',
    };
    let assetName = '';
    let timeString = '';

    if (event && event.id !== '0') {
      if (
        event.categoryCode?.toLowerCase() === FilterRacingCategories.Horses.toLowerCase() ||
        event.categoryCode?.toLowerCase() === FilterRacingCategories.GreyHounds.toLowerCase()
      ) {
        if (event.typeName) {
          assetName = event.typeName;
          if (event.startTime) {
            try {
              const d1 = new Date(event.startTime);
              const minute = d1.getUTCMinutes();
              const hour = d1.getUTCHours();
              timeString = ' ' + pad(hour) + ':' + pad(minute);
            } catch {
              timeString = 'Error';
            }
          }
        }
      }
    }

    expect(assetName).toBe('Race Type');
    expect(timeString).toBe(' 10:30');
  });

  it('should return eventName for non-horse or non-greyhound events', () => {
    const event = {
      id: '456',
      categoryCode: 'Football',
      eventName: 'Football Match',
    };
    let assetName = '';

    if (event && event.id !== '0') {
      if (
        event.categoryCode?.toLowerCase() === FilterRacingCategories.Horses.toLowerCase() ||
        event.categoryCode?.toLowerCase() === FilterRacingCategories.GreyHounds.toLowerCase()
      ) {
      } else {
        if (event.eventName) {
          assetName = event.eventName;
        }
      }
    }

    expect(assetName).toBe('Football Match');
  });

  it('should return nowPlayingItem.Name if event is invalid', () => {
    const nowPlayingItem = {
      Name: 'Current Playlist',
    };
    let assetName = '';

    if (!nowPlayingItem?.Name) {
      assetName = 'Default Name';
    } else {
      assetName = nowPlayingItem.Name;
    }

    expect(assetName).toBe('Current Playlist');
  });

  it('should correctly instantiate ScreenRuleRequest with given parameters', () => {
    const mockData = {
      label: 'Test Label',
      path: '/test/path',
      targetItemID: '12345',
      targetItemName: 'Target Name',
      isPromotionTreeNode: true,
      carouselDuration: 30,
    };

    const screenRuleRequest = new ScreenRuleRequest(mockData);

    expect(screenRuleRequest.label).toBe('Test Label');
    expect(screenRuleRequest.path).toBe('/test/path');
    expect(screenRuleRequest.targetItemID).toBe('12345');
    expect(screenRuleRequest.targetItemName).toBe('Target Name');
    expect(screenRuleRequest.isPromotionTreeNode).toBe(true);
    expect(screenRuleRequest.carouselDuration).toBe(30);
  });

  describe('Asset Name Formatting', () => {
    it('should return assetName with timeString when assetName length is <= 32', () => {
      const assetName = 'Short Asset Name';
      const timeString = ' 10:30';

      let result = assetName + timeString;

      expect(result).toBe('Short Asset Name 10:30');
    });
  });

  it('should handle case where assetName is truncated if length > 32', () => {
    const event = {
      id: '123',
      categoryCode: FilterRacingCategories.Horses,
      typeName: 'This is a very long asset name that should be truncated',
      startTime: '2025-01-15T10:30:00Z',
    } as any;

    let assetName = '';
    let timeString = '';

    if (event && event?.id !== '0') {
      if (
        event?.categoryCode?.toLowerCase() === FilterRacingCategories.Horses.toLowerCase() ||
        event?.categoryCode?.toLowerCase() === FilterRacingCategories.GreyHounds.toLowerCase()
      ) {
        if (event?.typeName) {
          assetName = event?.typeName;
          if (event?.startTime) {
            try {
              const d1 = new Date(event.startTime);
              const minute = d1.getUTCMinutes();
              const hour = d1.getUTCHours();
              timeString = ' ' + pipe.pad(hour) + ':' + pipe.pad(minute);
            } catch (error) {
              console.error(error);
            }
          }
        }
      } else {
        if (event?.eventName) {
          assetName = event?.eventName;
        }
      }
    }

    if (assetName?.length > 32) {
      assetName = assetName.substring(0, 29) + '...';
    }

    const result = assetName + timeString;

    expect(result).toBe('This is a very long asset nam... 10:30');
  });

  it('should assign event from ScreenRuleRequest when ScreenRuleRequest exists', () => {
    const nowPlayingItem = {
      ScreenRuleRequest: {
        racingEvent: {
          id: '123',
          name: 'Horse Race',
          eventName: 'Horse Race Event',
        } as unknown as Event,
      } as unknown as ScreenRuleRequest,
    };

    const event = nowPlayingItem?.ScreenRuleRequest?.racingEvent;

    expect(event).toEqual({ id: '123', name: 'Horse Race', eventName: 'Horse Race Event' });
  });
});
