import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ScreenData } from '../../../models/individual-gantry-screens.model';
import { ScreenLayoutSingleComponent } from '../screen-layout-single/screen-layout-single.component';

@Component({
  selector: 'app-screen-layout-duo-1',
  standalone: true,
  imports: [ScreenLayoutSingleComponent],
  templateUrl: './screen-layout-duo-1.component.html',
  styleUrl: './screen-layout-duo-1.component.scss'
})
export class ScreenLayoutDuo1Component {
  @Input() onRightClickOpenMenu: Function;
  @Output() onRightClick = new EventEmitter<any>();
  
  @Input() data: ScreenData | undefined;

  singleLayoutRightClick($event: any){
    this.onRightClick.emit($event)
  }
}
