import { TestBed } from '@angular/core/testing';

import { DSL_NOT_READY, DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { UserServiceMock } from '../../../core/test/user/user.mock';
import { LoggerMock } from '../languages/logger.mock';

describe('DslRecorderService', () => {
    let dslRecorderService: DslRecorderService;
    let testRecordable: DslRecordable;
    let loggerMock: LoggerMock;
    let action: jasmine.Spy;

    beforeEach(() => {
        action = jasmine.createSpy();

        const userServiceMock = MockContext.createMock(UserServiceMock);
        loggerMock = MockContext.useMock(LoggerMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService],
        });
        dslRecorderService = TestBed.inject(DslRecorderService);

        testRecordable = dslRecorderService
            .createRecordable('test')
            .createSimpleProperty(userServiceMock, 'username', 'Name')
            .createSimpleProperty(userServiceMock, 'loyalty', 'Null')
            .createProperty({ get: () => 'prop1', name: 'Prop' })
            .createProperty({ get: () => DSL_NOT_READY, name: 'NotReadyProp' })
            .createProperty({ get: () => 'prop2', name: 'CustomKeyProp', deps: 'custom_key' })
            .createProperty({ get: () => 'prop3', name: 'MultiKey', deps: ['custom_key', 'custom_key2'] })
            .createFunction({ get: (arg: string) => `hi ${arg}`, name: 'Fn', deps: [{ key: 'test.Fn', args: 1 }] })
            .createFunction({ get: () => 'hello', name: 'NoArgFn', deps: [{ key: 'test.NoArgFn', args: 0 }] })
            .createFunction({
                get: (arg1: string, arg2: string) => `${arg1} ${arg2} world`,
                name: 'MultiArgFn',
                deps: [{ key: 'test.MultiArgFn', args: 2 }],
            })
            .createFunction({
                get: (arg1: string, arg2: string) => `${arg1} ${arg2} xx`,
                name: 'CustomDepFn',
                deps: (arg1: string, arg2: string) => [`dep1.${arg2}.${arg1}`, 'anotherDep'],
            })
            .createAction({ fn: (arg1: string, arg2: number) => action(arg1, arg2), name: 'Action' });

        testRecordable.providerName = 'Test';
    });

    function testRecording(title: string, fn: (r: any) => any, expectedValue: any, expectedRecording: string[]) {
        it(title, () => {
            dslRecorderService.beginRecording();
            const result = fn(testRecordable);

            const recording = dslRecorderService.endRecording();

            expect(result).toBe(expectedValue);
            expect(Array.from(recording.deps)).toEqual(expectedRecording);
        });
    }

    testRecording('Simple property', (r) => r.Name, 'user', ['test.username']);
    testRecording('Property', (r) => r.Prop, 'prop1', ['test.Prop']);
    testRecording('Property with custom key', (r) => r.CustomKeyProp, 'prop2', ['custom_key']);
    testRecording('Property with custom keys', (r) => r.MultiKey, 'prop3', ['custom_key', 'custom_key2']);
    testRecording('Property that returns undefined should be converted to empty string', (r) => r.Null, '', ['test.loyalty']);
    testRecording('Function', (r) => r.Fn('Mike'), 'hi Mike', ['test.Fn.Mike']);
    testRecording('Function with no args', (r) => r.NoArgFn(), 'hello', ['test.NoArgFn']);
    testRecording('Function with multiple', (r) => r.MultiArgFn('a', 'b'), 'a b world', ['test.MultiArgFn.a.b']);
    testRecording('Function with multiple', (r) => r.CustomDepFn('y', 'z'), 'y z xx', ['dep1.z.y', 'anotherDep']);

    it('should execute action', () => {
        dslRecorderService.beginRecording();

        const result = testRecordable['Action']('a', 7);

        const recording = dslRecorderService.endRecording();

        expect(action).toHaveBeenCalledWith('a', 7);
        expect(result).toBeUndefined();
        expect(Array.from(recording.deps)).toBeEmptyArray();
        expect(loggerMock.debug).toHaveBeenCalledWith(`DSL action: Test.Action('a', 7)`);
    });

    it('should throw when accessed if recording is not started', () => {
        expect(() => testRecordable['Name']).toThrowError(/recording/);
    });

    it('should throw when accessing non existent property', () => {
        dslRecorderService.beginRecording();

        expect(() => testRecordable['Bla']).toThrowError(/Bla is not defined/);
    });

    it('should throw endRecording is called but not started', () => {
        expect(() => dslRecorderService.endRecording()).toThrowError(/Recording/);
    });

    it('should throw error if provider is not ready', () => {
        dslRecorderService.beginRecording();

        expect(() => testRecordable['NotReadyProp']).toThrowError(DSL_NOT_READY);
    });
});
