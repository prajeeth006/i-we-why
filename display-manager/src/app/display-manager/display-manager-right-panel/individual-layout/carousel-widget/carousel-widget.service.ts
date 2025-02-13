import { Injectable, Input, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export class SlideConfigI {
  component: Type<any> | null;
  id: string;
  data: any;
}
@Injectable({
  providedIn: 'root'
})

export class CarouselWidgetService {
  slides$ = new BehaviorSubject<SlideConfigI[]>([]);
  constructor() { }
}
