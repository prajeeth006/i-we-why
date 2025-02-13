import { SecurityContext } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';

import { MockContext } from 'moxxi';

import { ActivatedRouteMock } from '../../common/mocks/activated-route.mock';
import { RouteDataService } from '../../common/services/route-data.service';
import { NrmComponent } from './nrm.component';

describe('NrmComponent', () => {
    let component: NrmComponent;
    let fixture: ComponentFixture<NrmComponent>;
    class RouteDataServicePrivateMock {
        getQueryParams() {
            return {
                xParam: '{%22sid%22:%22123%22,%22did%22:%22456%22,%22bid%22:%22678%22}',
                url: 'http%3A%2F%2F10.26.78.194%2FDisplay%2Findex.html%3FsId%3D%7Bsid%7D%26dId%3D%7Bdid%7D%26bId%3D%7Bbid%7D',
            };
        }

        getUrl() {
            return 'http://local.gantry.coral.co.uk/en/gantry/nrm';
        }
    }

    beforeEach(async () => {
        MockContext.useMock(ActivatedRouteMock);
        await TestBed.configureTestingModule({
            declarations: [NrmComponent],
            providers: [{ provide: RouteDataService, useValue: new RouteDataServicePrivateMock() }, MockContext.providers],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NrmComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should return correct url', () => {
        const domSanitizer = TestBed.inject(DomSanitizer);
        const url = domSanitizer.sanitize(SecurityContext.RESOURCE_URL, component.url);
        expect(url).toEqual('http://10.26.78.194/Display/index.html?sId=123&dId=456&bId=678');
    });
});
