import { Component, effect, inject } from '@angular/core';
import { IndividualConfigurationService } from '../services/individual-configuration.service';
import { SitecoreImageService } from '../../../display-manager-left-panel/services/sitecore-image/sitecore-image.service';
import { SequencencingHelperService } from '../../../../display-manager/services/sequencencing-helper/sequencencing-helper.service';
import { Constants } from '../../constants/constants';
import { LabelSelectorService } from '../../../display-manager-header/label-selector/label-selector.service';
@Component({
  selector: 'app-gantry-change-indication',
  standalone: true,
  imports: [],
  templateUrl: './gantry-change-indication.component.html',
  styleUrl: './gantry-change-indication.component.scss',
})
export class GantryChangeIndicationComponent {
  haveTouched = true;
  readOnlyView = true;

  private individualConfigService = inject(IndividualConfigurationService);
  private sitecoreImageService = inject(SitecoreImageService);
  private sequencencingHelper = inject(SequencencingHelperService);
  private labelSelectorService = inject(LabelSelectorService);
  warningIcon: string;
  isSequenceDisrupted: boolean = false;
  stateChange: boolean = this.haveTouched && !this.sequencencingHelper.sequenceJourneyStatus();
  headerTitle: string = Constants.new_preset;
  screenDisruptedMsg: string = this.labelSelectorService?.configItemValues?.individual_screen_disruptedMsg ?? '';
  constructor() {
    effect(() => {
      let gantryLayout = this.individualConfigService.getActiveGantryLayout()?.GantryType;
      this.haveTouched = gantryLayout?.HaveTouched ?? false;
      this.readOnlyView = gantryLayout?.ReadOnlyView ?? false;
      this.stateChange = this.haveTouched && !this.sequencencingHelper.sequenceJourneyStatus();
      this.isSequenceDisrupted = this.sequencencingHelper.sequenceJourneyStatus();
      this.sitecoreImageService.mediaAssets$.subscribe((mediaAssets) => {
        this.warningIcon = mediaAssets?.WarningIcon ?? '';
      });
    })
  }

  changeView(isReadOnly: boolean){
    this.individualConfigService.gantryLayoutReadOnlyView(isReadOnly);
  }

}


