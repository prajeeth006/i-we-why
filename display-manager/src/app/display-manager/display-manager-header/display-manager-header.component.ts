import { Component, OnInit } from '@angular/core';
import { ScItemService } from '../../sitecore/sc-item-service/sc-item.service';
import { ScMediaItem } from '../../sitecore/sc-models/sc-item.model';
import { LabelSelectorService } from './label-selector/label-selector.service';

@Component({
  selector: 'display-manager-header',
  templateUrl: './display-manager-header.component.html',
  styleUrls: ['./display-manager-header.component.scss']
})
export class DisplayManagerHeaderComponent implements OnInit {

  logoImageUrl: string;

  constructor(
    private labelSelectorService: LabelSelectorService,
    private scItemService: ScItemService
  ) { }

  ngOnInit() {
    this.labelSelectorService.currentLabel$.subscribe((currentLabel: string) => {
      this.loadLogoImageUrl(currentLabel);
    });
  }

  private loadLogoImageUrl(currentLabel: string) {
    this.scItemService.getDataFromMasterDB<ScMediaItem>('/sitecore/api/ssc/item?path=/sitecore/media library/Vanilla.Mobile/Display_Manager/labels/' + currentLabel.toLocaleLowerCase() + '/brand-logo')
      .subscribe((logoItem: ScMediaItem) => {
        this.logoImageUrl = logoItem?.ItemMedialUrl;
        this.labelSelectorService.labelCssClass = currentLabel?.toLowerCase() + '-background-colour';
      });
  }

}
