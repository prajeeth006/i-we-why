import { Component, EventEmitter, Output } from '@angular/core';
import { CarouselService } from '../../services/carousel-service/carousel.service';
import { MatDialog } from '@angular/material/dialog';
import { TreeBreadCrumbService } from '../../services/tree-bread-crumb-services/tree-bread-crumb.service'
import { Filters } from 'src/app/display-manager/display-manager-left-panel/generic-tab-service/model/filters.model';
import { ProductTabService } from 'src/app/display-manager/display-manager-left-panel/product-tabs/services/product-tab.service';
import { ProductTabs } from 'src/app/display-manager/display-manager-left-panel/product-tabs/product-tab-names';
import { RightPanelTabControlService } from '../../../../display-manager-right-panel/services/tab-control.service';
import { SitecoreImageService } from 'src/app/display-manager/display-manager-left-panel/services/sitecore-image/sitecore-image.service';

@Component({
  selector: 'tree-controls',
  templateUrl: './tree-controls.component.html',
  styleUrls: ['./tree-controls.component.scss']
})
export class TreeControlsComponent {

  tabNamesEnum = ProductTabs;
  filters: Filters = new Filters();

  isCarouselTabSelecte$ = this.carouselService.isCarouselTabSelecte$;
  productTabService$ = this.productTabService.activeTab$;
  canHaveMultiEvent: boolean = false;
  breadCrumbArray$ = this.breadCrumbService.breadCrumbArray$;
  @Output() getPreviousCrumbNode = new EventEmitter;
  leftNavigationInActive: string| undefined;
  leftNavigationActive: string| undefined;
  rightNavigation: string| undefined;


  constructor(public breadCrumbService: TreeBreadCrumbService,
    public carouselService: CarouselService,
    public dialog: MatDialog,
    public productTabService: ProductTabService,
    public rightPanelTabControlService: RightPanelTabControlService,
    private sitecoreImageService: SitecoreImageService
    ) {
    this.breadCrumbArray$ = this.breadCrumbService.breadCrumbArray$;
  }

  ngOnInit() {
    this.sitecoreImageService.mediaAssets$.subscribe((mediaAssets) => {
      this.leftNavigationInActive = mediaAssets?.LeftNavigationInActive;
      this.leftNavigationActive = mediaAssets?.LeftNavigationActive;
      this.rightNavigation = mediaAssets?.RightNavigation;
    })
  }

  getPreviousNode() {
    this.getPreviousCrumbNode.emit();
  }

}
