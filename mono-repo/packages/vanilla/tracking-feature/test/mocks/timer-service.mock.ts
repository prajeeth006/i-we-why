import { TimerService } from '@frontend/vanilla/core';
import { MockService } from 'ng-mocks';

export const TimerServiceMock = MockService(TimerService, {
    setIntervalOutsideAngularZone: jest.fn((operation: () => void, frequency: number = 0): NodeJS.Timeout => setInterval(operation, frequency)),
    setTimeoutOutsideAngularZone: jest.fn((operation: () => void, frequency: number = 0): NodeJS.Timeout => setInterval(operation, frequency)),
    scheduleIdleCallback: jest.fn(),
    setInterval: jest.fn((operation: () => void, frequency: number = 0): NodeJS.Timeout => setInterval(operation, frequency)),
    setTimeout: jest.fn((operation: () => void, timeout: number = 0): NodeJS.Timeout => setInterval(operation, timeout)),
    clearInterval: jest.fn((intervalId: string | number | NodeJS.Timeout | undefined) => clearInterval(intervalId)),
    clearTimeout: jest.fn((timeoutId: NodeJS.Timeout) => clearTimeout(timeoutId)),
});
