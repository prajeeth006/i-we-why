import { ChangeDetectorRef, Component, signal, Input } from '@angular/core';
import { SortedScreensData } from '../../models/individual-gantry-screens.model';
import { ScreenLayoutSingleComponent } from '../components/screen-layout-single/screen-layout-single.component';

@Component({
  selector: 'app-peripheral-screens',
  standalone: true,
  templateUrl: './peripheral-screens.component.html',
  styleUrl: './peripheral-screens.component.scss',
  imports: [ScreenLayoutSingleComponent]
})
export class PeripheralScreensComponent {
  _peripheralScreens = signal<SortedScreensData | null>(null);
  @Input() set peripheralScreenData(value: any) {
    this._peripheralScreens.set(value);
  };

  constructor(private cdr: ChangeDetectorRef) {
  }
}
