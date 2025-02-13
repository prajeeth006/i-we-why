import { OnlyNumber } from './only-number.directive';
import { ElementRef } from '@angular/core';

describe('OnlyNumber Directive', () => {
  let directive: OnlyNumber;
  let mockElementRef: ElementRef;

  beforeEach(() => {
    mockElementRef = { nativeElement: { value: '' } } as ElementRef;
    directive = new OnlyNumber(mockElementRef);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should allow numeric key input', () => {
    const event = new KeyboardEvent('keydown', { key: '1', keyCode: 49 });
    spyOn(event, 'preventDefault');
    directive.onKeyDown(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('should prevent non-numeric key input', () => {
    const event = new KeyboardEvent('keydown', { key: 'a', keyCode: 65 });
    spyOn(event, 'preventDefault');
    directive.onKeyDown(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should allow special keys like backspace, delete, and arrows', () => {
    const allowedKeys = [8, 46, 37, 39];
    allowedKeys.forEach((keyCode) => {
      const event = new KeyboardEvent('keydown', { keyCode });
      spyOn(event, 'preventDefault');
      directive.onKeyDown(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });

  it('should prevent input when maxlength is exceeded', () => {
    directive.maxlength = 5;
    mockElementRef.nativeElement.value = '12345';

    const event = new KeyboardEvent('keydown', { key: '6', keyCode: 54 });
    spyOn(event, 'preventDefault');
    directive.onKeyDown(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should not prevent input if maxlength is not exceeded', () => {
    directive.maxlength = 5;
    mockElementRef.nativeElement.value = '123';

    const event = new KeyboardEvent('keydown', { key: '4', keyCode: 52 });
    spyOn(event, 'preventDefault');
    directive.onKeyDown(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('should allow ctrl+A, ctrl+C, ctrl+V, ctrl+X', () => {
    const allowedKeys = [
      { keyCode: 65, ctrlKey: true },
      { keyCode: 67, ctrlKey: true },
      { keyCode: 86, ctrlKey: true },
      { keyCode: 88, ctrlKey: true },
    ];

    allowedKeys.forEach((key) => {
      const event = new KeyboardEvent('keydown', key);
      spyOn(event, 'preventDefault');
      directive.onKeyDown(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });
});
