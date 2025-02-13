import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { ProductSwitchCoolOffResourceService } from '../src/product-switch-cool-off-resource.service';

describe('ProductSwitchCoolOffResourceService', () => {
    let service: ProductSwitchCoolOffResourceService;
    let apiServiceMock: SharedFeaturesApiServiceMock;

    beforeEach(() => {
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, ProductSwitchCoolOffResourceService],
        });

        service = TestBed.inject(ProductSwitchCoolOffResourceService);
    });

    it('setPlayerArea', () => {
        const spy = jasmine.createSpy();

        service.setPlayerArea('sports', 'old').subscribe(spy); // act

        expect(apiServiceMock.post).toHaveBeenCalledWith('productswitchcooloff/setplayerarea', { newArea: 'sports', oldArea: 'old' });
    });
});
