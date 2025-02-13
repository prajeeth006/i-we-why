import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, Renderer2, ElementRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[appDebounceClick]'
})
export class DebounceClickDirective implements OnInit, OnDestroy {
  @Input() debounceTime = 500;
  @Output() debounceClick = new EventEmitter();
  private clicks = new Subject();
  private subscription: Subscription;

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit() {
    this.subscription = this.clicks.pipe(debounceTime(this.debounceTime)).subscribe(e => {
      this.debounceClick.emit(e);
      this.addAndRemoveClass();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('click', ['$event'])
  clickEvent(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.clicks.next(event);
  }

  private addAndRemoveClass() {
    const className = 'disable--click';
    this.renderer.addClass(this.el.nativeElement, className); 

    setTimeout(() => {
      this.renderer.removeClass(this.el.nativeElement, className); 
    }, 2000);
  }
}
