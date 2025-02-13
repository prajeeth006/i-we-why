import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { LazyAssetsBootstrapService } from '../../src/assets-loading/lazy-assets-bootstrap.service';
import { ScriptsServiceMock } from '../../src/assets-loading/scripts.mock';
import { StylesServiceMock } from '../../src/assets-loading/test/styles.mock';
import { VanillaApiServiceMock } from '../../src/http/test/vanilla-api.mock';
import { MediaQueryServiceMock } from '../browser/media-query.service.mock';

describe('LazyAssetsBootstrapService', () => {
    let service: LazyAssetsBootstrapService;
    let stylesServiceMock: StylesServiceMock;
    let scriptsServiceMock: ScriptsServiceMock;
    let mediaObserverMock: MediaQueryServiceMock;
    let apiServiceMock: VanillaApiServiceMock;

    beforeEach(() => {
        stylesServiceMock = MockContext.useMock(StylesServiceMock);
        mediaObserverMock = MockContext.useMock(MediaQueryServiceMock);
        scriptsServiceMock = MockContext.useMock(ScriptsServiceMock);
        apiServiceMock = MockContext.useMock(VanillaApiServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, LazyAssetsBootstrapService],
        });

        mediaObserverMock.isActive.withArgs('xs').and.returnValue(false);
        mediaObserverMock.isActive.withArgs('md').and.returnValue(false);

        service = TestBed.inject(LazyAssetsBootstrapService);
    });

    function init() {
        service.onAppInit();
        const stylesheets = [
            { url: 'imp', lazyLoad: 'Important' },
            { url: 'imp2', lazyLoad: 'Important' },
            { url: 'sec', lazyLoad: 'Secondary' },
            { url: 'sec2', lazyLoad: 'Secondary' },
            { url: 'imp_media', lazyLoad: 'Important', media: 'xs' },
            { url: 'sec_media', lazyLoad: 'Secondary', media: 'md' },
            { url: 'native_app', lazyLoad: 'Custom', alias: 'native-app' },
            { url: 'native_app2', lazyLoad: 'Custom', alias: 'native-app' },
            { url: 'product_app', lazyLoad: 'Custom', alias: 'product-app' },
            { url: 'navigation', lazyLoad: 'Custom', alias: 'navigation' },
        ];

        const scripts = [
            { url: 'imp.js', lazyLoad: 'Important' },
            { url: 'imp2.js', lazyLoad: 'Important' },
            { url: 'sec.js', lazyLoad: 'Secondary' },
            { url: 'sec2.js', lazyLoad: 'Secondary' },
            { url: 'imp_media.js', lazyLoad: 'Important', media: 'xs' },
            { url: 'sec_media.js', lazyLoad: 'Secondary', media: 'md' },
            { url: 'native_app.js', lazyLoad: 'Custom', alias: 'native-app' },
            { url: 'native_app2.js', lazyLoad: 'Custom', alias: 'native-app' },
            { url: 'product_app.js', lazyLoad: 'Custom', alias: 'product-app' },
            { url: 'navigation.js', lazyLoad: 'Custom', alias: 'navigation' },
        ];
        apiServiceMock.get.completeWith({ scripts, stylesheets });
        tick();
    }

    describe('onAppInit()', () => {
        it('should load important styles', fakeAsync(() => {
            init();

            expect(stylesServiceMock.load).toHaveBeenCalledWith('imp');
            expect(stylesServiceMock.load).toHaveBeenCalledWith('imp2');
            expect(stylesServiceMock.load).not.toHaveBeenCalledWith('imp_media');
            expect(stylesServiceMock.load).not.toHaveBeenCalledWith('sec');
            expect(stylesServiceMock.load).not.toHaveBeenCalledWith('sec2');
            expect(stylesServiceMock.load).not.toHaveBeenCalledWith('sec_media');
        }));

        it('should load important scripts', fakeAsync(() => {
            init();

            expect(scriptsServiceMock.load).toHaveBeenCalledWith('imp.js');
            expect(scriptsServiceMock.load).toHaveBeenCalledWith('imp2.js');
            expect(scriptsServiceMock.load).not.toHaveBeenCalledWith('imp_media.js');
            expect(scriptsServiceMock.load).not.toHaveBeenCalledWith('sec.js');
            expect(scriptsServiceMock.load).not.toHaveBeenCalledWith('sec2.js');
            expect(scriptsServiceMock.load).not.toHaveBeenCalledWith('sec_media.js');
        }));

        it('should load important styles with media if it matches', fakeAsync(() => {
            mediaObserverMock.isActive.withArgs('xs').and.returnValue(true);

            init();

            expect(stylesServiceMock.load).toHaveBeenCalledWith('imp');
            expect(stylesServiceMock.load).toHaveBeenCalledWith('imp2');
            expect(stylesServiceMock.load).toHaveBeenCalledWith('imp_media');
            expect(stylesServiceMock.load).not.toHaveBeenCalledWith('sec');
            expect(stylesServiceMock.load).not.toHaveBeenCalledWith('sec2');
            expect(stylesServiceMock.load).not.toHaveBeenCalledWith('sec_media');
        }));

        it('should load important scripts with media if it matches', fakeAsync(() => {
            mediaObserverMock.isActive.withArgs('xs').and.returnValue(true);

            init();

            expect(scriptsServiceMock.load).toHaveBeenCalledWith('imp.js');
            expect(scriptsServiceMock.load).toHaveBeenCalledWith('imp2.js');
            expect(scriptsServiceMock.load).toHaveBeenCalledWith('imp_media.js');
            expect(scriptsServiceMock.load).not.toHaveBeenCalledWith('sec.js');
            expect(scriptsServiceMock.load).not.toHaveBeenCalledWith('sec2.js');
            expect(scriptsServiceMock.load).not.toHaveBeenCalledWith('sec_media.js');
        }));

        it('should secondary styles after important styles', fakeAsync(() => {
            init();

            stylesServiceMock.load.resolve();
            stylesServiceMock.load.resolve();
            tick();

            expect(stylesServiceMock.load).toHaveBeenCalledWith('sec');
            expect(stylesServiceMock.load).toHaveBeenCalledWith('sec2');
        }));

        it('should secondary scripts after important styles', fakeAsync(() => {
            init();

            scriptsServiceMock.load.resolve();
            scriptsServiceMock.load.resolve();
            tick();

            expect(scriptsServiceMock.load).toHaveBeenCalledWith('sec.js');
            expect(scriptsServiceMock.load).toHaveBeenCalledWith('sec2.js');
        }));

        it('should load secondary styles with media if it matches after important styles', fakeAsync(() => {
            mediaObserverMock.isActive.withArgs('md').and.returnValue(true);

            init();
            mediaObserverMock.observe.next(); // shouldn't load secondary styles yet

            expect(stylesServiceMock.load).not.toHaveBeenCalledWith('sec');
            expect(stylesServiceMock.load).not.toHaveBeenCalledWith('sec2');
            expect(stylesServiceMock.load).not.toHaveBeenCalledWith('sec_media');

            stylesServiceMock.load.resolve();
            stylesServiceMock.load.resolve();
            tick();

            expect(stylesServiceMock.load).toHaveBeenCalledWith('sec');
            expect(stylesServiceMock.load).toHaveBeenCalledWith('sec2');
            expect(stylesServiceMock.load).toHaveBeenCalledWith('sec_media');
        }));

        it('should load secondary scripts with media if it matches after important styles', fakeAsync(() => {
            mediaObserverMock.isActive.withArgs('md').and.returnValue(true);

            init();
            mediaObserverMock.observe.next(); // shouldn't load secondary styles yet

            expect(scriptsServiceMock.load).not.toHaveBeenCalledWith('sec.js');
            expect(scriptsServiceMock.load).not.toHaveBeenCalledWith('sec2.js');
            expect(scriptsServiceMock.load).not.toHaveBeenCalledWith('sec_media.js');

            scriptsServiceMock.load.resolve();
            scriptsServiceMock.load.resolve();
            tick();

            expect(scriptsServiceMock.load).toHaveBeenCalledWith('sec.js');
            expect(scriptsServiceMock.load).toHaveBeenCalledWith('sec2.js');
            expect(scriptsServiceMock.load).toHaveBeenCalledWith('sec_media.js');
        }));

        it('should load not yet loaded styles with media when it starts to match', fakeAsync(() => {
            init();

            stylesServiceMock.load.resolve();
            stylesServiceMock.load.resolve();
            tick();

            stylesServiceMock.load.calls.reset();

            mediaObserverMock.isActive.withArgs('md').and.returnValue(true);
            mediaObserverMock.observe.next();

            expect(stylesServiceMock.load).toHaveBeenCalledWith('sec_media');
            expect(stylesServiceMock.load).toHaveBeenCalledTimes(1);
            stylesServiceMock.load.calls.reset();

            mediaObserverMock.isActive.withArgs('xs').and.returnValue(true);
            mediaObserverMock.observe.next();

            expect(stylesServiceMock.load).toHaveBeenCalledWith('imp_media');
            expect(stylesServiceMock.load).toHaveBeenCalledTimes(1);
        }));

        it('should load not yet loaded scripts with media when it starts to match', fakeAsync(() => {
            init();

            scriptsServiceMock.load.resolve();
            scriptsServiceMock.load.resolve();
            tick();

            scriptsServiceMock.load.calls.reset();

            mediaObserverMock.isActive.withArgs('md').and.returnValue(true);
            mediaObserverMock.observe.next();

            expect(scriptsServiceMock.load).toHaveBeenCalledWith('sec_media.js');
            expect(scriptsServiceMock.load).toHaveBeenCalledTimes(1);
            scriptsServiceMock.load.calls.reset();

            mediaObserverMock.isActive.withArgs('xs').and.returnValue(true);
            mediaObserverMock.observe.next();

            expect(scriptsServiceMock.load).toHaveBeenCalledWith('imp_media.js');
            expect(scriptsServiceMock.load).toHaveBeenCalledTimes(1);
        }));
    });
});
