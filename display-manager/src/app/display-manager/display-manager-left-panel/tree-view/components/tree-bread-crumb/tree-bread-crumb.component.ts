import { Component, OnDestroy, OnInit } from '@angular/core';
import { TreeBreadCrumb } from './../../models/tree-bread-crumb.model';
import { TreeBreadCrumbService } from '../../services/tree-bread-crumb-services/tree-bread-crumb.service'
import { MainTreeNode } from '../../models/main-tree-node.model';
import { CarouselService } from '../../services/carousel-service/carousel.service';
import { MatDialog } from '@angular/material/dialog';
import { CarouselComponent } from '../../../carousel/carousel.component';

@Component({
  selector: 'tree-bread-crumb',
  templateUrl: './tree-bread-crumb.component.html',
  styleUrls: ['./tree-bread-crumb.component.scss']

})
export class TreeBreadCrumbComponent implements OnInit {

  isArrowCollapsed = true;
  breadCrumbData$ = this.breadCrumbService.breadCrumbData$;
  breadCrumbArray$ = this.breadCrumbService.breadCrumbArray$;
  isCarouselTabSelecte$ = this.carouselService.isCarouselTabSelecte$;

  constructor(public breadCrumbService: TreeBreadCrumbService,
    public carouselService: CarouselService,
    public dialog: MatDialog) {
    this.breadCrumbData$ = this.breadCrumbService.breadCrumbData$;
    this.breadCrumbArray$ = this.breadCrumbService.breadCrumbArray$;
  }

  ngOnInit(): void {
    this.breadCrumbData$.subscribe((breadCrumb: TreeBreadCrumb) => {
      var breadcrumbArray: any[] = [];
      while (breadCrumb.child != null) {
        breadcrumbArray.push(breadCrumb.data);
        breadCrumb = breadCrumb.child!;
      }
      if (breadCrumb?.data != null) {//&& (element.data.level == 0 || element.data.level == 1)
        breadcrumbArray.push(breadCrumb.data);
        breadCrumb = breadCrumb.child!;
      }
      this.breadCrumbService.breadCrumbArray.next(breadcrumbArray);
    });

  }

  getPreviousCrumbNode() {
    this.isArrowCollapsed = true;
    let breadCrumbArray = this.breadCrumbService.breadCrumbArray.getValue() as MainTreeNode[];
    let id = breadCrumbArray[breadCrumbArray.length - 2]?.nodeProperties?.id;
    let name = breadCrumbArray[breadCrumbArray.length - 2]?.nodeProperties?.name;
    this.breadCrumbService.getBreadCrumbNode(id, name);
  }

  getBreadCrumbNode(id: string | undefined, name: string | undefined) {
    this.isArrowCollapsed = true;
    this.breadCrumbService.getBreadCrumbNode(id, name);
  }

  openCarousel(){
      const dialogRef = this.dialog.open(CarouselComponent, {
        hasBackdrop: false,
        width: '50%',
        height: '80vh',
      });

      this.carouselService.setCarouselPopupOpen();
  }
}
