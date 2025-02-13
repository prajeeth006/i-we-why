import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { HtmlNodeMock } from '../../../core/test/browser/html-node.mock';
import { ProductServiceMock } from '../../../core/test/products/product.mock';
import { ProductActivatorService } from '../src/product-activator.service';
import { BootstrapperServiceMock } from './bootstrapper.mock';

describe('ProductServiceActivator', () => {
    let productActivatorService: ProductActivatorService;
    let productServiceMock: ProductServiceMock;
    let bootstrapperServiceMock: BootstrapperServiceMock;
    let htmlNodeMock: HtmlNodeMock;

    beforeEach(() => {
        productServiceMock = MockContext.useMock(ProductServiceMock);
        bootstrapperServiceMock = MockContext.useMock(BootstrapperServiceMock);
        htmlNodeMock = MockContext.useMock(HtmlNodeMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, ProductActivatorService],
        });

        productActivatorService = TestBed.inject(ProductActivatorService);

        productServiceMock.getMetadata.withArgs('sports').and.returnValue({
            isRegistered: true,
        });

        productServiceMock.getMetadata.withArgs('host').and.returnValue({
            isRegistered: true,
        });

        productServiceMock.getMetadata.withArgs('casino').and.returnValue({
            isRegistered: false,
        });
    });

    describe('activate()', () => {
        it('should run bootstrappers', fakeAsync(() => {
            runProductActivation(null, 'host', true);
            runProductActivation('host', 'sports', true);
        }));

        it('should run load only on first activation', fakeAsync(() => {
            runProductActivation(null, 'host', true);
            runProductActivation('host', 'sports', true);
            runProductActivation('sports', 'host', false);
        }));

        it('should throw an error if the product is not registered', fakeAsync(() => {
            const spy = jasmine.createSpy();

            // eslint-disable-next-line @typescript-eslint/use-unknown-in-catch-callback-variable
            productActivatorService.activate('casino').catch(spy);
            tick();

            expect(spy).toHaveBeenCalled();
        }));
    });

    function runProductActivation(from: string | null, to: string, firstLoad: boolean) {
        productServiceMock.current.name = from || 'host';
        productActivatorService.activate(to);

        if (from != null) {
            expect(bootstrapperServiceMock.runProductDeactivation).toHaveBeenCalledWith(from);
            bootstrapperServiceMock.runProductDeactivation.resolve();
            tick();
            expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith(`product-${from}`, false);
        }

        expect(productServiceMock.setActive).toHaveBeenCalledWith(to);
        expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith(`product-${to}`, true);
        if (firstLoad) {
            expect(bootstrapperServiceMock.runProductLoad).toHaveBeenCalledWith(to);
            bootstrapperServiceMock.runProductLoad.resolve();
            tick();
        } else {
            expect(bootstrapperServiceMock.runProductLoad).not.toHaveBeenCalled();
        }

        expect(bootstrapperServiceMock.runProductActivation).toHaveBeenCalledWith(to);
        bootstrapperServiceMock.runProductActivation.resolve();
        tick();

        resetCalls();
    }

    function resetCalls() {
        bootstrapperServiceMock.runProductLoad.calls.reset();
        bootstrapperServiceMock.runProductActivation.calls.reset();
        bootstrapperServiceMock.runProductDeactivation.calls.reset();
        productServiceMock.setActive.calls.reset();
    }
});
