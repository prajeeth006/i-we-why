import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { IconsModel } from '../../../icons/src/icons-model';
import { IconSetConfigMock } from '../../../icons/test/icons.mocks';
import { FlagsService } from '../flags.service';

describe('FlagsService', () => {
    let service: FlagsService;
    let availableFlags: IconsModel[];
    let configMock: IconSetConfigMock;

    beforeEach(() => {
        configMock = MockContext.useMock(IconSetConfigMock);
        TestBed.configureTestingModule({
            providers: [MockContext.providers, FlagsService],
        });

        configMock.iconItems = [
            { iconName: 'en-flag' } as IconsModel,
            { iconName: 'pt-flag', imageUrl: 'http://imageUrl' } as IconsModel,
            { iconName: 'theme-icon' } as IconsModel,
        ];
        service = TestBed.inject(FlagsService);
        service.available.subscribe((s) => (availableFlags = s));
        configMock.whenReady.next();
    });
    describe('available', () => {
        it('should return all available flags', () => {
            expect(availableFlags).toEqual([
                { iconName: 'en-flag' } as IconsModel,
                { iconName: 'pt-flag', imageUrl: 'http://imageUrl' } as IconsModel,
            ]);
        });
    });
    describe('find', () => {
        it('should find flag image url', () => {
            service.find('pt').subscribe((flag) => expect(flag).toBe('http://imageUrl'));
        });
    });
});
