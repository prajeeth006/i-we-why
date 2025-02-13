import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { TreeNode } from 'src/app/display-manager/display-manager-left-panel/tree-view/models/tree-node.model';
import { CommonService } from 'src/app/display-manager/display-manager-left-panel/tree-view/services/common-service/common.service';
import { DragService } from '../drag.service';
import { AssetTypes } from '../../models/AssetTypes';
import { ScreenInfo } from 'src/app/display-manager/display-manager-right-panel/individual-layout/models/individual-gantry-screens.model';

@Directive({
  selector: '[appIndividualDraggable]'
})
export class IndividualDraggableDirective {

  // Events
  private onDragStart: Function;
  private onDragEnd: Function;
  private screenName: string;

  // Options for the directive
  private options: TreeNode | ScreenInfo | undefined;

  // 2
  @Input()
  set appIndividualDraggable(options: TreeNode | ScreenInfo | undefined) {
    this.options = options;
  }

  @Input()
  set currentScreen(screenName: string) {
    this.screenName = screenName;
  }

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private dragService: DragService,
    private commonService: CommonService
  ) {
    // 3
  }

  // 4
  ngOnInit() {
    this.AddOrRemoveDraggableClass();
  }

  ngOnChanges() {
    this.AddOrRemoveDraggableClass();
  }


  // 5
  ngOnDestroy() {
    // Remove events

    if (this.options) {
      try {
        this.onDragStart();
        this.onDragEnd();
      } catch (e) { }
    }
  }

  /**
   * @desc responsible for adding the drag events to the directive
   * @note transfers drag data using the Drag and Drop API (Browser)
   * @note known CSS issue where a draggable element cursor cant be set while dragging in Chrome
   */
  // 6
  private addDragEvents(): void {
    let ghostElement: HTMLElement;
    // 7
    this.onDragStart = this.renderer.listen(
      this.elementRef.nativeElement
      , 'dragstart'
      , (event: DragEvent): void => {
        // Create ghost element for image
        this.IsSkyChannelDroppable(this.options);
        ghostElement = document.createElement('div');
        ghostElement.classList.add('ghost-container');
        ghostElement.style.position = "absolute";
        ghostElement.style.top = "-1000px";
        ghostElement.style.backgroundColor = "white";
        ghostElement.style.padding = "0px";
        ghostElement.style.border = "2px dashed #037AFF";
        ghostElement.style.opacity = "1";

        // ghostElement.innerHTML = this.options?.name as string;

        let elm: ElementRef = this.elementRef;
        ghostElement.innerHTML = this.elementRef.nativeElement.outerHTML
        // Append ghost to body
        document.body.appendChild(ghostElement);
        this.dragService.pauseAvailableScreenZones(this.screenName, this.screenName);
        this.dragService.startDrag(this.options);
        // Transfer the data using Drag and Drop API (Browser)
        if (event?.dataTransfer != undefined) {
          event.dataTransfer
            .setDragImage(ghostElement, 0, 0);
          event.dataTransfer
            .setData('Promotion'
              , JSON.stringify(this.options));
        }
        this.renderer.addClass(this.elementRef.nativeElement, 'dragging');
      });

    // 8
    this.onDragEnd = this.renderer.listen(
      this.elementRef.nativeElement
      , 'dragend'
      , (event: DragEvent): void => {
        // Remove ghost element
        document.body.removeChild(ghostElement);
        this.dragService.removeHighLightedAvailableScreenZones();
        this.dragService.resumeAvailableScreenZones(this.screenName, this.screenName);
        this.commonService.isChannelDroppable.next(false);
        this.renderer.removeClass(this.elementRef.nativeElement, 'dragging');
      });
  }
  private IsSkyChannelDroppable(options: TreeNode | ScreenInfo | undefined) {
    this.dragService.resumeAllScreenZones();
    let isSkyChannel = false;
    if (options){
      if (!!options?.hasOwnProperty('nodeProperties')) {
        if (options as TreeNode){
          this.dragService.pauseSkyScreenZones((options as TreeNode).nodeProperties?.isSkyChannelTreeNode as boolean);
          isSkyChannel = (options as TreeNode).nodeProperties?.isSkyChannelTreeNode as boolean;
        }
      } else {
        let draggAsset = (options as ScreenInfo).NewAssetToSave ? (options as ScreenInfo).NewAssetToSave?.AssetToSave : (options as ScreenInfo)?.NowPlaying?? undefined
        this.dragService.pauseSkyScreenZones(draggAsset?.AssetType == AssetTypes.Sky);
        isSkyChannel = draggAsset?.AssetType == AssetTypes.Sky;
      }
    }

    if (options) {
      if (isSkyChannel) {
        this.commonService.isChannelDroppable.next(true);
      }
      else {
        this.commonService.isChannelDroppable.next(false);
      }
    }
  }

  AddOrRemoveDraggableClass() {
    if (this.options) {
      this.renderer.setProperty(this.elementRef.nativeElement, 'draggable', true);
      this.renderer.addClass(this.elementRef.nativeElement, 'app-draggable');
      this.addDragEvents();
    }
    else {
      this.renderer.setProperty(this.elementRef.nativeElement, 'draggable', false);
      this.renderer.removeClass(this.elementRef.nativeElement, 'app-draggable');
    }
  }
}
