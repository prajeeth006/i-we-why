import { DOCUMENT } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgComponent } from '@frontend/vanilla/features/svg';
import { MockContext } from 'moxxi';

import { HttpClientMock } from '../../../core/test/client-config/http-client.mock';

describe('SvgComponent', () => {
    let fixture: ComponentFixture<SvgComponent>;
    let doc: Document;
    const mockElementRef: any = {
        nativeElement: {},
    };
    beforeEach(() => {
        MockContext.useMock(HttpClientMock);

        TestBed.overrideComponent(SvgComponent, {
            set: {
                providers: [MockContext.providers],
                imports: [],
            },
        });

        doc = TestBed.inject(DOCUMENT);
        fixture = TestBed.createComponent(SvgComponent);
        fixture.componentInstance.svg = mockElementRef;
    });

    it('should set class to svg', () => {
        fixture.componentInstance.size = 'small';
        fixture.componentInstance.cssClass = 'abc';
        fixture.componentInstance.defaultAnimation = true;
        fixture.componentInstance.iconType = 'filled';
        const svgElement = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');

        fixture.componentInstance.setClass(svgElement);

        expect(svgElement.classList.toString()).toEqual('th-icon abc th-icon--fill th-icon-animate-fill th-icon--sm');
    });

    it('should set style to svg', () => {
        fixture.componentInstance.image = {
            src: 'https://scmedia.itsfogo.com/$-$/9531ecce418d4d1f86dad06e0db7f697.svg',
            height: 20,
            width: 50,
        };

        fixture.componentInstance.defaultAnimation = false;
        fixture.componentInstance.customAnimation = 'fill:white';
        const svgElement = doc.createElementNS('http://www.w3.org/2000/svg', 'svg');

        fixture.componentInstance.setStyle(svgElement);

        expect(svgElement.style.cssText).toEqual('height: 20px; width: 50px; fill: white;');
    });

    it('should add animation class to svg', () => {
        fixture.componentInstance.animationClass = 'test';
        const div = doc.createElement('div');
        fixture.componentInstance.svg.nativeElement = div;
        fixture.componentInstance.animate();
        expect(fixture.componentInstance.svg.nativeElement.classList.contains('test')).toBeTrue();
    });
});
