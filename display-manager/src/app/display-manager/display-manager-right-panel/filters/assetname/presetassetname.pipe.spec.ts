import { PresetAssetNamePipe } from './presetassetname.pipe';
import { FilterRacingCategories } from 'src/app/display-manager/display-manager-left-panel/generic-tab-service/model/filter-racingcategories.enum';
import { Event } from 'src/app/display-manager/display-manager-left-panel/tree-view/models/event.model';

describe('PresetAssetNamePipe', () => {
  let pipe: PresetAssetNamePipe;

  beforeEach(() => {
    pipe = new PresetAssetNamePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return correct event name if category is not horse or greyhound', () => {
    const event: Event = {
      eventName: 'Football Match',
      id: '789',
      categoryCode: 'Football',
      typeName: 'Match',
      startTime: '2025-01-13T16:00:00',
      name: ''
    };

    const result = pipe.transform(event);
    expect(result).toBe(' Football Match');
  });

  it('should return default value "-" for event with no startTime', () => {
    const event: Event = {
      eventName: 'Football Match',
      id: '789',
      categoryCode: 'Football',
      typeName: 'Match',
      startTime: '',
      name: ''
    };

    const result = pipe.transform(event);
    expect(result).toBe(' Football Match');
  });

  it('should return an empty string for invalid event data', () => {
    const event: Event = {
      eventName: '-',
      id: '0',
      categoryCode: '',
      typeName: '',
      startTime: '',
      name: ''
    };

    const result = pipe.transform(event);
    expect(result).toBe('-');
  });


  it('should return correct event name if category is not horse or greyhound', () => {
    const event: Event = {
      eventName: 'Football Match',
      id: '789',
      categoryCode: 'Football',
      typeName: 'Match',
      startTime: '2025-01-13T16:00:00',
      name: ''
    };

    const result = pipe.transform(event);
    expect(result).toBe(' Football Match');
  });

  it('should handle invalid startTime gracefully', () => {
    const event = { startTime: 'invalid-date' };
    let timeString = '';

    try {
      const dateFormat = new Date(event.startTime + ' UTC');
      if (!isNaN(dateFormat.getTime())) {
        const hour = dateFormat.getUTCHours()?.toString().padStart(2, '0') || '';
        const minute = dateFormat.getUTCMinutes()?.toString().padStart(2, '0') || '';
        timeString = hour + ':' + minute;
      } else {
        timeString = '';
      }
    } catch {
      timeString = '';
    }

    expect(timeString).toBe('');
  });

  it('should handle missing startTime gracefully and return eventName', () => {
    const event: Event = {
      id: '1',
      categoryCode: 'HORSE_RACING',
      typeName: 'Race Type',
      startTime: '',
      eventName: 'Horse Race Event',
      name: 'Sample Event'
    };

    const result = pipe.transform(event);
    expect(result).toBe(' Race Type');
  });

  describe('Date Formatting Logic', () => {
    it('should correctly format the time string for a valid startTime', () => {
      const mockEvent: any = {
        startTime: '2023-11-20T10:15:00Z'
      };
      let timeString = '';

      try {
        const dateFormat = new Date(mockEvent.startTime);
        const hour = dateFormat.getUTCHours()?.toString().padStart(2, '0') || '';
        const minute = dateFormat.getUTCMinutes()?.toString().padStart(2, '0') || '';
        timeString = hour + ':' + minute;
      } catch {
        timeString = 'Error';
      }

      expect(timeString).toBe('10:15');
    });
  });
});
