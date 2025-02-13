import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ScreenData } from '../../../models/individual-gantry-screens.model';
import { ScreenLayoutSingleComponent } from '../screen-layout-single/screen-layout-single.component';

@Component({
  selector: 'app-screen-layout-quad',
  standalone: true,
  imports: [ScreenLayoutSingleComponent],
  templateUrl: './screen-layout-quad.component.html',
  styleUrl: './screen-layout-quad.component.scss'
})
export class ScreenLayoutQuadComponent {

  @Input() onRightClickOpenMenu: Function;
  @Output() onRightClick = new EventEmitter<any>();
  @Input() data: ScreenData[];
  @Input() hasSubScreens: boolean = false;

  singleLayoutRightClick($event: any){
    this.onRightClick.emit($event)
  }
}
