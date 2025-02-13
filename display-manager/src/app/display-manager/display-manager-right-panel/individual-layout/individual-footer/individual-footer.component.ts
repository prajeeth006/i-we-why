import { effect, inject, Injectable, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { SitecoreImageService } from 'src/app/display-manager/display-manager-left-panel/services/sitecore-image/sitecore-image.service';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { SequencencingHelperService } from 'src/app/display-manager/services/sequencencing-helper/sequencencing-helper.service';
import { SequenceModelPopUpComponent } from '../sequence-model-popup/sequence-popup.component';
import { IndividualConfigurationService } from '../services/individual-configuration.service';
import { GantryLayout } from '../models/individual-gantry-screens.model';
import { LabelSelectorService } from 'src/app/display-manager/display-manager-header/label-selector/label-selector.service';
import { ApiService } from 'src/app/common/api.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IndividualSaveService } from '../services/individual-save.service';

@Injectable()
@Component({
  selector: 'app-individual-footer',
  templateUrl: './individual-footer.component.html',
  styleUrls: ['./individual-footer.component.scss'],
  standalone: true,
  imports: [NgClass, MatButton]
})
export class IndividualFooterComponent implements OnInit {
  private sitecoreImageService = inject(SitecoreImageService);
  private dialog = inject(MatDialog);
  private sequencencingHelperService = inject(SequencencingHelperService);
  private individualConfigurationService = inject(IndividualConfigurationService);
  private individualSaveService = inject(IndividualSaveService);
  private labelSelectorService = inject(LabelSelectorService);
  private apiService = inject(ApiService);

  footerDefaultbuttons: boolean = true;
  sequenceIconPath: string;
  resetIconPath: string;
  currentLabel: string;
  haveGantryTouched: boolean = false;
  isGantryDirty: boolean = false;
  

  constructor() {
      effect(() => {
        this.haveGantryTouched = this.individualConfigurationService.isGantryTouched();
        this.isGantryDirty = this.individualConfigurationService.isGantryDirty();
      })
    }

    
  /**
   * @description initiate to apply sequence flow
   *
   */
  applySequence() {
    this.sequencencingHelperService._isLeftPannelInActive.set(true);
    this.sequencencingHelperService.setSequenceJourneyStatus(true);
    this.toggleSequence(false);
  }

  /**
   * @description reset to apply sequence flow
   *
   */
  resetSequence() {
    //implement reset sequence business logic
    this.individualConfigurationService.getAllIndividualTabGantryLayoutTypeDetails();
  }

  /**
   * @description publish to apply sequence flow
   *
   */
  publishSequence() {
    this.individualSaveService.save(this.labelSelectorService.getCurrentLabel());
  }

  /**
   * @description start over to apply sequence flow
   *
   */
  startOverSequence() {
    //implement start over sequence business logic
  }

  /**
   * @description cancel/discard apply sequence flow
   *
   */
  cancelSequence() {
    this.sequencencingHelperService._isLeftPannelInActive.set(false);
    this.sequencencingHelperService.setSequenceJourneyStatus(false);
    this.toggleSequence(true);
  }

  /**
   * @description continue apply sequence flow
   *
   */
  continueSequence() {
    var timeout = setTimeout(() => {
      this.dialog.open(SequenceModelPopUpComponent, {
        id: 'create-draggable-card',
        width: "1040px",
        disableClose: true,
        backdropClass: 'scope-to-right-pannel',
      });
      clearTimeout(timeout);
    }, 100);
  }

  toggleSequence(value: boolean = true) {
    this.footerDefaultbuttons = value;
  }
  saveSequence(label: string, individualProfile: GantryLayout): Observable<string> {
    let params = new HttpParams().append('label', label);
    return this.apiService.post('/sitecore/api/displayManager/individualGantryType/SaveSequences', individualProfile, params);
  }
  ngOnInit(): void {
    this.sitecoreImageService.mediaAssets$.subscribe((mediaAssets) => {
      this.sequenceIconPath = mediaAssets?.RightSequenceDefaultIcon ?? '';
      this.resetIconPath = mediaAssets?.ResetIcon ?? '';
      this.toggleSequence();
    });
  }
}
