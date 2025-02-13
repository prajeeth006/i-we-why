
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[OnlyNumber]'
})
export class OnlyNumber {

  private readonly regEx = new RegExp('^[0-9]*$');

  constructor(private el: ElementRef) { }

  @Input() OnlyNumber: boolean = true;
  @Input() maxlength: number;

  @HostListener('keydown', ['$event']) onKeyDown(event: any) {
    let e = <KeyboardEvent>event;
    if (this.OnlyNumber) {
      if ([46, 8, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode == 65 && e.ctrlKey === true) ||
        // Allow: Ctrl+C
        (e.keyCode == 67 && e.ctrlKey === true) ||
        // Allow: Ctrl+V
        (e.keyCode == 86 && e.ctrlKey === true) ||
        // Allow: Ctrl+X
        (e.keyCode == 88 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
        // let it happen, don't do anything
        return;
      }
      if (!this.isValid(event.key))
        e.preventDefault();

    }
  }

  private isValid(elegible: string): boolean {
    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(elegible);
    return this.regEx.test(elegible) && !this.isOverSize(next);
  }

  private isOverSize(str: string): boolean {
    if (this.maxlength && str) {
      return str.length > this.maxlength;
    }
    return false;
  }

}
