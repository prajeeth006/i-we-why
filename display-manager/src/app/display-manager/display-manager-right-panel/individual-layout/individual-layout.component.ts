import {
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { GantryTabsComponent } from './gantry-tabs/gantry-tabs.component';
import { IndividualFooterComponent } from './individual-footer/individual-footer.component';
import { EventlistTableComponent } from './eventlist-table/eventlist-table.component';
import { IndividualConfigurationService } from './services/individual-configuration.service';
import { GantryChangeIndicationComponent } from './gantry-change-indication/gantry-change-indication.component';
import { CarouselWidgetComponent } from './carousel-widget/carousel-widget.component';

@Component({
  selector: 'app-individual-layout',
  templateUrl: './individual-layout.component.html',
  styleUrls: ['./individual-layout.component.scss'],
  standalone: true,
  imports: [GantryTabsComponent, IndividualFooterComponent, EventlistTableComponent, GantryChangeIndicationComponent, CarouselWidgetComponent],
})
export class IndividualLayoutComponent implements OnInit {
  private individualConfigurationService = inject(IndividualConfigurationService);
  constructor() {
  }

  ngOnInit(): void {
    this.individualConfigurationService.initialize();
  }

  loadDynamicComponent() {
  }
}
