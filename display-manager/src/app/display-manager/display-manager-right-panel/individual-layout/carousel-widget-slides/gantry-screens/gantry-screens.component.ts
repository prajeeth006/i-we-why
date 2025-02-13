import { Component, effect, ElementRef, HostListener, inject, Input, Renderer2, signal, ViewChild } from '@angular/core';
import { ScreenLayoutChangeWidgetComponent } from '../components/screen-layout-change-widget/screen-layout-change-widget.component';
import { ScreenLayoutChangeWidgetService } from '../components/screen-layout-change-widget/screen-layout-change-widget.service';
import { ScreenData, ScreenInfo, SortedScreensData } from '../../models/individual-gantry-screens.model';
import { ScreenLayoutSingleComponent } from "../components/screen-layout-single/screen-layout-single.component";
import { ScreenLayoutDuo1Component } from "../components/screen-layout-duo-1/screen-layout-duo-1.component";
import { ScreenLayoutTrioComponent } from "../components/screen-layout-trio/screen-layout-trio.component";
import { ScreenLayoutQuadComponent } from "../components/screen-layout-quad/screen-layout-quad.component";
import { CommonModule } from '@angular/common';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { ContextMenu } from 'src/app/common/models/ContextMenu';
import { IndividualScreenMenu } from '../../screen-context-menu/screen-context-menu.model';
import { BOMUtilities } from 'src/app/helpers/bom-utilities';
import { LabelSelectorService } from 'src/app/display-manager/display-manager-header/label-selector/label-selector.service';
import { MasterConfigurationService } from '../../../master-layout/services/master-configuration.service';
import { CarouselService } from 'src/app/display-manager/display-manager-left-panel/tree-view/services/carousel-service/carousel.service';
import { CarouselComponent } from 'src/app/display-manager/display-manager-left-panel/carousel/carousel.component';
import { MatDialog } from '@angular/material/dialog';
import { IndividualConfigurationService } from '../../services/individual-configuration.service';

@Component({
  selector: 'app-gantry-screens',
  templateUrl: './gantry-screens.component.html',
  styleUrls: ['./gantry-screens.component.scss'],
  standalone: true,
  imports: [ScreenLayoutChangeWidgetComponent, ScreenLayoutSingleComponent, ScreenLayoutDuo1Component, 
    ScreenLayoutTrioComponent, ScreenLayoutQuadComponent, CommonModule, MatMenuModule]
})
export class GantryScreensComponent {
  private screenLayoutChangeWidgetService = inject(ScreenLayoutChangeWidgetService);
  _gantryScreenData = signal<SortedScreensData | null>(null);
  @ViewChild('individualSlides') individualSlidesRef!: ElementRef;
  private individualConfigService = inject(IndividualConfigurationService);
  
  @ViewChild(MatMenuTrigger)
  matMenuTrigger: MatMenuTrigger;
  contextMenuPosition = BOMUtilities.getMousePosition();
  contextMenuOptions = ContextMenu;
  contextMenuItems: IndividualScreenMenu[] = [];
  readOnlyView:boolean = false;
  // isActiveScreensReset = false;

  constructor(
      private labelSelectorService: LabelSelectorService,
      private masterConfigService: MasterConfigurationService,
      public carouselService: CarouselService,
      public dialog: MatDialog,
      private renderer: Renderer2
    ) {
      this.renderer.listen('window', 'click', (e: Event) => {
        // this.isActiveScreensReset = true;
        this.matMenuTrigger.closeMenu();
      });

      effect(() => {
        let gantryLayout = this.individualConfigService.getActiveGantryLayout()?.GantryType;
        this.readOnlyView = gantryLayout?.ReadOnlyView ?? false;
      });
      
    }

  @Input() gantryScreenData: any;

  updateGantryScreensModelData(layout: any, screen?: ScreenData) {
    if(screen){
      if(!screen.PreviewScreenType){
        screen.PreviewScreenType = String(screen.ScreenType);
      }
      screen.ScreenType = layout;
      //NOTE: If Layout change have to reset existing drag n drop call bellow.
      this.resetExistingDragNDrops(screen.ScreenDetails.Single);
      this.resetExistingDragNDrops(screen.ScreenDetails.Duo1);
      this.resetExistingDragNDrops(screen.ScreenDetails.Trio1);
      this.resetExistingDragNDrops(screen.ScreenDetails.Trio2);
      this.resetExistingDragNDrops(screen.ScreenDetails.Quad);
      this.individualConfigService.gantryLayoutTouched();
    }
  }

  resetExistingDragNDrops(screenInfo: ScreenInfo[]){
    screenInfo.forEach(screen => {
      screen.NewAssetToSave = null;
      screen.IsTouched = true;
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(): void {
    this.screenLayoutChangeWidgetService.activeScreenNumber$.next(null);
  }


  onRightClickOpenMenu(contextMenuData: any) {
    const element = this.individualSlidesRef.nativeElement;
    const rect = element.getBoundingClientRect();
    console.log('Left position:', rect.left, rect.top);

    console.log('contextMenuData', contextMenuData)
    this.contextMenuPosition = contextMenuData.contextMenuPosition;
    
    this.contextMenuPosition.x = (parseInt(this.contextMenuPosition.x) - rect.left) + 'px';
    this.contextMenuPosition.y = (parseInt(this.contextMenuPosition.y) - rect.top) + 'px';

    console.log('left', (parseInt(this.contextMenuPosition.x) - rect.left) + 'px')

    this.contextMenuItems = contextMenuData.contextMenuItems;
    this.openScreenContextMenu();
  }

  openScreenContextMenu() {
    this.matMenuTrigger.closeMenu();
    // this.isActiveScreensReset = false;
    setTimeout(() => {
      this.matMenuTrigger.openMenu();
    }, 100);
  }

  scrollHandler(event: Event) {
    // this.isActiveScreensReset = true;
    this.matMenuTrigger.closeMenu();
  }

  
  
  onClickMenuOption(event: any, data: ScreenInfo) {
    console.log("Rightclick Data", data);

    if (!!event && !!event?.target?.parentElement) {
      if (event?.target?.parentElement?.id == ContextMenu.preview) {
        if (!data?.NewAssetToSave && !!data?.NowPlaying?.RuleId) {
          let ruleId = data?.NowPlaying?.RuleId

          if (this.labelSelectorService.configItemValues.IsNewRuleProcessFlow) {

            this.masterConfigService.getPreviewUrl(this.masterConfigService.currentLabel, ruleId).subscribe((url: string) => {
              if (url)
                BOMUtilities.openInNewTab(url);
            }, (err: string) => {
              console.error(err);
            })

          } else {

            let gantryUrl = this.labelSelectorService.getLabelUrls(this.masterConfigService.currentLabel) + 'getGantryUrlBasedOnDisplayRuleId?displayRuleItemId=';
            this.masterConfigService.getUrl(gantryUrl, ruleId).subscribe((url: string) => {
              if (url)
                BOMUtilities.openInNewTab(url);
            }, (err: string) => {
              console.error(err);
            });

          }

        }

      } else if (event?.target?.parentElement?.id == ContextMenu.createCarousel) {
        this.addEditCarousel();
      } else if (event?.target?.parentElement?.id == ContextMenu.editCarousel) {
        this.addEditCarousel(data.NowPlaying?.Target);
      }
    }
  }

  
    addEditCarousel(id?: any) {
  
      // this.carouselService.setScreenForCarousel(this.currentActiveScreen);
      this.dialog.open(CarouselComponent, {
        id: 'create-new-carousel',
        hasBackdrop: true,
        data: id ? id : undefined,
        width: '820px',
        height: '820px',
        backdropClass: 'scope-to-right-pannel',
      });
  
      this.carouselService.setCarouselPopupOpen();
    }
}
