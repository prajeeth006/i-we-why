import { ContentItem } from '@frontend/vanilla/core';

import { ToastrOptionsBuilder } from '../../src/toastr/toastr-options-builder';

describe('ToastrOptionsBuilder', () => {
    let builder: ToastrOptionsBuilder;

    beforeEach(() => {
        builder = new ToastrOptionsBuilder();
    });

    it('should convert item parameters to toastr options', () => {
        const item: ContentItem = {
            name: 'toast1',
            templateName: 'pctext',
            class: 'cls',
            parameters: {
                closeButton: 'true',
                disableTimeOut: 'true',
                easeTime: '10',
                easing: 'east-out',
                extendedTimeOut: '50',
                messageClass: 'mcls',
                onActivateTick: 'false',
                positionClass: 'pcls',
                progressAnimation: 'decreasing',
                progressBar: 'true',
                tapToDismiss: 'true',
                timeOut: '70',
                titleClass: 'titcls',
                toastClass: 'tcls',
            },
        };

        expect(builder.build(item)).toEqual(
            <any>jasmine.objectContaining({
                closeButton: true,
                disableTimeOut: true,
                easeTime: 10,
                easing: 'east-out',
                extendedTimeOut: 50,
                messageClass: 'mcls',
                positionClass: 'pcls',
                progressAnimation: 'decreasing',
                progressBar: true,
                tapToDismiss: true,
                timeOut: 70,
                titleClass: 'titcls',
                toastClass: 'tcls cls has-close-icon',
            }),
        );
    });

    it('should add default class', () => {
        const item: ContentItem = {
            name: 'toast1',
            templateName: 'pctext',
            parameters: {},
        };

        expect(builder.build(item)).toEqual({
            toastClass: 'toast',
        });
    });

    it('should add icon class for toasts with type', () => {
        const item: ContentItem = {
            name: 'toast1',
            templateName: 'pctext',
            parameters: {
                type: 'info',
            },
        };

        expect(builder.build(item).toastClass).toBe('toast toast-icon');
    });
});
