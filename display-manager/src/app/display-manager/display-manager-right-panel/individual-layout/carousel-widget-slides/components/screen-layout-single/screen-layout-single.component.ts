import { Component, effect, EventEmitter, inject, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { ScreenData, ScreenInfo } from '../../../models/individual-gantry-screens.model';
import { SharedModule } from 'src/app/shared-module';
import { CommonModule, NgClass, NgStyle } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SitecoreImageService } from 'src/app/display-manager/display-manager-left-panel/services/sitecore-image/sitecore-image.service';
import { IndividualSaveService } from '../../../services/individual-save.service';
import { BOMUtilities } from 'src/app/helpers/bom-utilities';
import { IndividualContextMenuGenerator } from '../../../screen-context-menu/screen-context-menu-generator';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { IndividualConfigurationService } from '../../../services/individual-configuration.service';
import { AssetInfoPipe } from 'src/app/display-manager/display-manager-right-panel/filters/assetinfo/asset-info.pipe';
import { SequencencingHelperService } from 'src/app/display-manager/services/sequencencing-helper/sequencencing-helper.service';

@Component({
  selector: 'app-screen-layout-single',
  standalone: true,
  imports: [SharedModule, NgClass, NgStyle, MatTooltipModule, CommonModule, MatMenuModule, AssetInfoPipe],
  templateUrl: './screen-layout-single.component.html',
  styleUrl: './screen-layout-single.component.scss',
})
export class ScreenLayoutSingleComponent {
  private sitecoreImageService = inject(SitecoreImageService);
  public individualSaveService = inject(IndividualSaveService);
  sequencencingHelper = inject(SequencencingHelperService);
  sequenceIcon: string | undefined;
  @Input() onRightClickOpenMenu: Function;
  @Output() onRightClick = new EventEmitter<any>();

  droppableContent: string;

  /**
   * @description `layoutStyle` property/input signal decides how the screen will appear on the Template.
   * options :  S || L || H || Q || ''
   * default value : Q
   * SP: special type of screen (114px * 69px)
   * L: large screen (228px * 170px)
   * H: Half screen (114px * 170px)
   * Q: Quad screen (114px * 64px)
   */
  @Input() layoutStyle: string;
  @Input() data:ScreenData | undefined;
  @Input() screenInfo: ScreenInfo;
  contextMenuPosition = BOMUtilities.getMousePosition();
  isReadOnly: boolean = false;
  haveTouched: boolean = false;
  IsScreenSelected: boolean = false;
  IsChangesApplied: boolean = false;
  gantryType?: string | undefined;
  private individualConfigurationService = inject(IndividualConfigurationService);
  
  @ViewChild(MatMenuTrigger)
  matMenuTrigger: MatMenuTrigger;

  isActiveScreensReset = false;

  constructor(
      private renderer: Renderer2) {
    this.renderer.listen('window', 'click', (e: Event) => {
      this.isActiveScreensReset = true;
      //this.matMenuTrigger.closeMenu();
    });


    this.sitecoreImageService.mediaAssets$.subscribe((mediaAssets) => {
      this.sequenceIcon = mediaAssets?.ChainIconWhite;
    })

    effect(() => {
      let gantryLayout = this.individualConfigurationService.getActiveGantryLayout()?.GantryType;
      this.gantryType = this.individualConfigurationService.getActiveGantryLayout()?.GantryType?.Name;
      this.isReadOnly = gantryLayout?.ReadOnlyView ?? false;
      this.haveTouched = gantryLayout?.ReadOnlyView ?? false;
    })
  }
  onRightClickEventScreenWrapper(event: MouseEvent) {
    event.preventDefault();
    // if (!this.data?.IsSkyTv) {//For Sky
      let contextMenuPosition = BOMUtilities.getMousePosition(event);
      let contextMenuItems = IndividualContextMenuGenerator.getRequiredOptions(this.screenInfo);
      if(contextMenuItems.length > 0){
        this.onRightClick.emit({ contextMenuPosition, contextMenuItems, profileScreen: this.data })
      }
    // }
  }
  
}
