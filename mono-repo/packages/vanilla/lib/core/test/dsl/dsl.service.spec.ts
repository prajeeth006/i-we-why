import { TestBed } from '@angular/core/testing';

import { DslService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';
import { BehaviorSubject, Subject } from 'rxjs';

import { DslEnvExecutionMode } from '../../src/dsl/dsl.models';
import { DslEnvServiceMock } from './dsl-env.mock';

describe('DslService', () => {
    let service: DslService;
    let dslEnvServiceMock: DslEnvServiceMock;
    let observableSpy: jasmine.Spy;
    let content: any;
    let truthyExpression: string;
    let asyncExpressionReady: boolean;
    let action: jasmine.Spy;

    beforeEach(() => {
        dslEnvServiceMock = MockContext.useMock(DslEnvServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslService],
        });

        service = TestBed.inject(DslService);

        observableSpy = jasmine.createSpy('observableSpy');
        asyncExpressionReady = false;
        action = jasmine.createSpy();

        const stable: BehaviorSubject<null> = new BehaviorSubject(null);
        dslEnvServiceMock.whenStable.and.returnValue(stable);
        dslEnvServiceMock.run.and.callFake((expression: string, executionMode: DslEnvExecutionMode) => {
            if (executionMode === DslEnvExecutionMode.Expression) {
                if (expression === truthyExpression) {
                    return { result: true, deps: new Set(['dep']) };
                }

                if (expression === 'async' && !asyncExpressionReady) {
                    return { result: undefined, notReady: true, deps: new Set(['dep']) };
                }

                if (!expression || expression.startsWith('s')) {
                    return { result: 'eval_' + expression, deps: new Set(['dep']) };
                }

                return { result: false, deps: new Set(['dep']) };
            } else if (executionMode === DslEnvExecutionMode.Action) {
                if (expression === 'async' && !asyncExpressionReady) {
                    return { result: undefined, notReady: true, deps: new Set(['dep']) };
                }

                action();
                return { result: undefined, notReady: false, deps: new Set(['dep']) };
            }

            return;
        });

        truthyExpression = '456';
        content = [
            {
                text: 'hello',
                condition: '123',
            },
            {
                text: 'world',
                condition: '456',
            },
        ];
    });

    describe('evaluateContent()', () => {
        it('should filter content', () => {
            service.evaluateContent(content).subscribe((content) => {
                expect(content.length).toBe(1);
                expect(content[0].text).toBe('world');
            });
        });

        it('should stream content updates', () => {
            service.evaluateContent(content).subscribe(observableSpy);

            let result = observableSpy.calls.mostRecent().args[0];

            expect(result.length).toBe(1);
            expect(result[0].text).toBe('world');

            truthyExpression = '123';

            dslEnvServiceMock.change.next(new Set(['dep']));

            expect(observableSpy.calls.count()).toBe(2);
            result = observableSpy.calls.mostRecent().args[0];

            expect(result.length).toBe(1);
            expect(result[0].text).toBe('hello');
        });

        it('should not reevaluate if dependencies are not changed', () => {
            service.evaluateContent(content).subscribe(observableSpy);

            let result = observableSpy.calls.mostRecent().args[0];

            expect(result.length).toBe(1);
            expect(result[0].text).toBe('world');

            truthyExpression = '123';

            dslEnvServiceMock.change.next(new Set(['dep2']));

            result = observableSpy.calls.mostRecent().args[0];

            expect(result.length).toBe(1);
            expect(result[0].text).toBe('world');
        });

        it('should not reevaluate if content did not change', () => {
            service.evaluateContent(content).subscribe(observableSpy);
            dslEnvServiceMock.change.next(new Set(['dep']));

            expect(observableSpy.calls.count()).toBe(1);
        });

        it('should return undefined if no content is specified', () => {
            service.evaluateContent(undefined).subscribe((content) => {
                expect(content).not.toBeDefined();
            });
        });

        it('should support arbitrary structure', () => {
            service
                .evaluateContent<any>({
                    one: {
                        subone: {
                            condition: '123',
                        },
                    },
                    two: {
                        messages: {
                            abc: 'efg',
                        },
                        form: {
                            element1: {
                                condition: '456',
                            },
                            element2: {},
                            condition: '456',
                        },
                    },
                    three: [
                        { text: 'hello' },
                        { text: 'world', condition: '456' },
                        { text: 'doom', condition: '123' },
                        {
                            subthree: {
                                text: 'sub',
                                condition: '456',
                            },
                        },
                    ],
                })
                .subscribe((content) => {
                    expect(content).toEqual({
                        one: {},
                        two: {
                            messages: {
                                abc: 'efg',
                            },
                            form: {
                                element1: {
                                    condition: '456',
                                },
                                element2: {},
                                condition: '456',
                            },
                        },
                        three: [
                            { text: 'hello' },
                            { text: 'world', condition: '456' },
                            {
                                subthree: {
                                    text: 'sub',
                                    condition: '456',
                                },
                            },
                        ],
                    });
                });
        });

        it('should evaluate proxy items', () => {
            service
                .evaluateContent<any>({
                    isProxy: true,
                    rules: [
                        { condition: '123', document: { text: 'curak' } },
                        { condition: '456', document: { text: 'hello' } },
                    ],
                })
                .subscribe((content) => {
                    expect(content).toEqual({ text: 'hello' });
                });
        });

        it('should fallback to default proxy rule without condition', () => {
            service
                .evaluateContent<any>({
                    isProxy: true,
                    rules: [{ condition: '123', document: { text: 'curak' } }, { document: { text: 'hello' } }],
                })
                .subscribe((content) => {
                    expect(content).toEqual({ text: 'hello' });
                });
        });

        it('should evaluate nested proxy items', () => {
            service
                .evaluateContent<any>({
                    isProxy: true,
                    rules: [
                        {
                            condition: '456',
                            document: {
                                isProxy: true,
                                rules: [
                                    { condition: '123', document: { text: 'curak' } },
                                    { condition: '456', document: { text: 'hello' } },
                                ],
                            },
                        },
                    ],
                })
                .subscribe((content) => {
                    expect(content).toEqual({ text: 'hello' });
                });
        });

        it('should return null if no condition of proxy matches', () => {
            service
                .evaluateContent<any>({
                    isProxy: true,
                    rules: [
                        { condition: '123', document: { text: 'curak' } },
                        { condition: '123', document: { text: 'hello' } },
                    ],
                })
                .subscribe((content) => {
                    expect(content).toBeNull();
                });
        });

        it('should evaluate proxy items in array', () => {
            service
                .evaluateContent<any>([
                    {
                        isProxy: true,
                        rules: [
                            { condition: '123', document: { text: 'curak' } },
                            { condition: '456', document: { text: 'hello' } },
                        ],
                    },
                    { text: 'world' },
                ])
                .subscribe((content) => {
                    expect(content).toEqual([{ text: 'hello' }, { text: 'world' }]);
                });
        });

        it('should evaluate proxy items in objects', () => {
            service
                .evaluateContent<any>({
                    one: {
                        subone: {
                            isProxy: true,
                            rules: [
                                { condition: '123', document: { text: 'curak' } },
                                { condition: '456', document: { text: 'hello' } },
                            ],
                        },
                    },
                })
                .subscribe((content) => {
                    expect(content).toEqual({ one: { subone: { text: 'hello' } } });
                });
        });

        it('should evaluate proxy items with items that have condition', () => {
            service
                .evaluateContent<any>({
                    isProxy: true,
                    rules: [
                        { condition: '123', document: { text: 'curak' } },
                        {
                            condition: '456',
                            document: {
                                text: 'hello',
                                array: [
                                    { condition: '123', text: 'LUL' },
                                    { condition: '456', text: 'ResidentSleeper' },
                                ],
                            },
                        },
                    ],
                })
                .subscribe((content) => {
                    expect(content).toEqual({ text: 'hello', array: [{ condition: '456', text: 'ResidentSleeper' }] });
                });
        });

        it('should remove proxy from array if no condition matches', () => {
            service
                .evaluateContent<any>([
                    {
                        isProxy: true,
                        rules: [
                            { condition: '123', document: { text: 'curak' } },
                            { condition: '123', document: { text: 'hello' } },
                        ],
                    },
                    { text: 'world' },
                ])
                .subscribe((content) => {
                    expect(content).toEqual([{ text: 'world' }]);
                });
        });

        it('should remove proxy from array if matched document is null', () => {
            service
                .evaluateContent<any>([
                    {
                        isProxy: true,
                        rules: [{ condition: '456', document: null }],
                    },
                    { text: 'world' },
                ])
                .subscribe((content) => {
                    expect(content).toEqual([{ text: 'world' }]);
                });
        });

        it('should remove proxy property from object if no condition matches', () => {
            service
                .evaluateContent<any>({
                    one: {
                        subone: {
                            isProxy: true,
                            rules: [
                                { condition: '123', document: { text: 'curak' } },
                                { condition: '123', document: { text: 'hello' } },
                            ],
                        },
                        subtwo: {
                            text: 'LUL',
                        },
                    },
                })
                .subscribe((content) => {
                    expect(content).toEqual({ one: { subtwo: { text: 'LUL' } } });
                });
        });

        it('should evaluate placeholders items', () => {
            service
                .evaluateContent<any>({
                    text: 'dsl:///sroot',
                    one: {
                        text: 'hello',
                        subone: {
                            text: 'dsl:///sexpr',
                        },
                    },
                    two: [{ text: 'dsl:///sarr' }],
                })
                .subscribe((content) => {
                    expect(content).toEqual({
                        text: 'eval_sroot',
                        one: {
                            text: 'hello',
                            subone: {
                                text: 'eval_sexpr',
                            },
                        },
                        two: [{ text: 'eval_sarr' }],
                    });
                });
        });

        it('should return the same content if without conditions', () => {
            const noConditionsContent = {
                one: {
                    subone: {
                        text: 'aa',
                    },
                },
            };

            service.evaluateContent(noConditionsContent).subscribe((content) => {
                expect(content).toEqual(noConditionsContent);
            });
        });

        it('should filter on root level', () => {
            service
                .evaluateContent<any>({
                    condition: '123',
                    one: {
                        text: 'aa',
                    },
                })
                .subscribe((content) => {
                    expect(content).toEqual({});
                });
        });

        it('should wait with first evaluation for stable', () => {
            const stable = new Subject<void>();

            dslEnvServiceMock.whenStable.and.returnValue(stable);
            service.evaluateContent(content).subscribe(observableSpy);

            expect(dslEnvServiceMock.run).not.toHaveBeenCalled();
            expect(observableSpy).not.toHaveBeenCalled();

            stable.next();

            expect(observableSpy).toHaveBeenCalled();
        });

        it('should unsubscribe from dsl env changes', () => {
            const sub = service.evaluateContent(content).subscribe(observableSpy);

            expect(dslEnvServiceMock.run).toHaveBeenCalledTimes(2);
            expect(observableSpy).toHaveBeenCalledTimes(1);

            sub.unsubscribe();
            dslEnvServiceMock.run.calls.reset();
            observableSpy.calls.reset();

            dslEnvServiceMock.change.next(new Set());

            expect(dslEnvServiceMock.run).not.toHaveBeenCalled();
            expect(observableSpy).not.toHaveBeenCalled();
        });
    });

    describe('evaluateExpression()', () => {
        it('should evaluate expression', () => {
            service.evaluateExpression('456').subscribe((result) => {
                expect(result).toBeTrue();
            });
        });

        it('should stream result updates', () => {
            service.evaluateExpression('456').subscribe(observableSpy);

            let result = observableSpy.calls.mostRecent().args[0];

            expect(result).toBeTrue();

            truthyExpression = '123';

            dslEnvServiceMock.change.next(new Set(['dep']));

            expect(observableSpy.calls.count()).toBe(2);
            result = observableSpy.calls.mostRecent().args[0];

            expect(result).toBeFalse();
        });

        it('should not reevaluate if dependencies are not changed', () => {
            service.evaluateExpression('456').subscribe(observableSpy);

            let result = observableSpy.calls.mostRecent().args[0];

            expect(result).toBeTrue();

            truthyExpression = '123';

            dslEnvServiceMock.change.next(new Set(['dep2']));

            result = observableSpy.calls.mostRecent().args[0];

            expect(result).toBeTrue();
        });

        it('should wait with first evaluation for stable', () => {
            const stable = new Subject<void>();

            dslEnvServiceMock.whenStable.and.returnValue(stable);
            service.evaluateExpression('456').subscribe(observableSpy);

            expect(dslEnvServiceMock.run).not.toHaveBeenCalled();
            expect(observableSpy).not.toHaveBeenCalled();

            stable.next();

            expect(observableSpy).toHaveBeenCalled();
        });

        it('should unsubscribe from dsl env changes', () => {
            const sub = service.evaluateExpression('456').subscribe(observableSpy);

            expect(dslEnvServiceMock.run).toHaveBeenCalledTimes(1);
            expect(observableSpy).toHaveBeenCalledTimes(1);

            sub.unsubscribe();
            dslEnvServiceMock.run.calls.reset();
            observableSpy.calls.reset();

            dslEnvServiceMock.change.next(new Set());

            expect(dslEnvServiceMock.run).not.toHaveBeenCalled();
            expect(observableSpy).not.toHaveBeenCalled();
        });

        it('should wait until providers are ready before emitting', () => {
            service.evaluateExpression('async').subscribe(observableSpy);

            expect(observableSpy).not.toHaveBeenCalled();

            asyncExpressionReady = true;

            dslEnvServiceMock.change.next(new Set(['dep']));

            expect(observableSpy).toHaveBeenCalled();
        });
    });

    describe('executeAction()', () => {
        it('should evaluate expression', () => {
            service.executeAction('action').subscribe(() => {
                expect(action).toHaveBeenCalled();
            });
        });

        it('should stream executions', () => {
            service.executeAction('action').subscribe(observableSpy);

            dslEnvServiceMock.change.next(new Set(['dep']));

            expect(observableSpy).toHaveBeenCalledTimes(2);
            expect(action).toHaveBeenCalledTimes(2);
        });

        it('should not reevaluate if dependencies are not changed', () => {
            service.executeAction('action').subscribe(observableSpy);

            dslEnvServiceMock.change.next(new Set(['dep2']));

            expect(observableSpy).toHaveBeenCalledTimes(1);
            expect(action).toHaveBeenCalledTimes(1);
        });

        it('should wait with first evaluation for stable', () => {
            const stable = new Subject<void>();

            dslEnvServiceMock.whenStable.and.returnValue(stable);
            service.executeAction('action').subscribe(observableSpy);

            expect(dslEnvServiceMock.run).not.toHaveBeenCalled();
            expect(observableSpy).not.toHaveBeenCalled();

            stable.next();

            expect(observableSpy).toHaveBeenCalled();
        });

        it('should unsubscribe from dsl env changes', () => {
            const sub = service.executeAction('action').subscribe(observableSpy);

            expect(dslEnvServiceMock.run).toHaveBeenCalledTimes(1);
            expect(observableSpy).toHaveBeenCalledTimes(1);

            sub.unsubscribe();
            dslEnvServiceMock.run.calls.reset();
            observableSpy.calls.reset();

            dslEnvServiceMock.change.next(new Set());

            expect(dslEnvServiceMock.run).not.toHaveBeenCalled();
            expect(observableSpy).not.toHaveBeenCalled();
        });

        it('should wait until providers are ready before emitting', () => {
            service.executeAction('async').subscribe(observableSpy);

            expect(observableSpy).not.toHaveBeenCalled();

            asyncExpressionReady = true;

            dslEnvServiceMock.change.next(new Set(['dep']));

            expect(observableSpy).toHaveBeenCalled();
        });
    });
});
