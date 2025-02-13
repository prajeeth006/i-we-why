import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { ScreenData, ScreenInfo } from '../../../models/individual-gantry-screens.model';
import { ScreenLayoutSingleComponent } from '../screen-layout-single/screen-layout-single.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-screen-layout-trio',
  standalone: true,
  imports: [ScreenLayoutSingleComponent, NgClass],
  templateUrl: './screen-layout-trio.component.html',
  styleUrl: './screen-layout-trio.component.scss'
})
export class ScreenLayoutTrioComponent {
  @Input() onRightClickOpenMenu: Function;
  @Input() readOnlyView: boolean;
  @Input() data:  ScreenData | undefined;
  @Output() onRightClick = new EventEmitter<any>();
  _screens = signal<ScreenInfo[] | null>(null);
  isTrio1 = false;
  isTrio2 = false;

  ngOnChanges() {
    if (!!this.data) {
      this.isTrio1 = (this.readOnlyView && this.data?.PreviewScreenType ? this.data?.PreviewScreenType?.toLowerCase() : this.data?.ScreenType?.toLowerCase()) == 'trio1';
      this.isTrio2 = (this.readOnlyView && this.data?.PreviewScreenType ? this.data?.PreviewScreenType?.toLowerCase() : this.data?.ScreenType?.toLowerCase()) == 'trio2';
      this._screens.set(this.isTrio1 ? this.data?.ScreenDetails?.Trio1 : this.data?.ScreenDetails?.Trio2);
    }
  }

  getLayoutStyle(index: number) {
    /**
     * if trio1 the 1st screen will be half screen
     * if trio2 the 3rd screen will be half screen
     */
    if ((this.isTrio1 && index == 0) || (this.isTrio2 && index == 2)) {
      return 'H'
    } else {
      return ''
    }
  }
  
  singleLayoutRightClick($event: any){
    this.onRightClick.emit($event)
  }
}
