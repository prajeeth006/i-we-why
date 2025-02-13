import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { MainTreeNode } from 'src/app/display-manager/display-manager-left-panel/tree-view/models/main-tree-node.model';
import { DragService } from '../drag.service';

// 1
@Directive({
  selector: '[appIndividualDroppable]'
})
export class IndividualDroppableDirective implements OnInit, OnDestroy {
  private onDragEnter: Function;
  private onDragLeave: Function;
  private onDragOver: Function;
  private onDrop: Function;

  private currentZone: string;
  private screenName: string;
  private isSkyTv: boolean;
  private isTv: boolean;
  private isReadOnly: boolean;

  // Allow options input by using [appDroppable]='{}'
  // 2
  @Input()
  set appIndividualDroppable(currentZone: string|undefined) {
    if (currentZone) {
      this.currentZone = currentZone;
    }
  }

  @Input()
  set currentScreen(screenName: string) {
    this.screenName = screenName;
  }

  @Input()
  set IsSkyTv(isSkyTv: boolean) {
    this.isSkyTv = isSkyTv;
  }

  @Input()
  set IsTv(isTv: boolean) {
    this.isTv = isTv;
  }

  @Input()
  set IsReadOnly(isReadOnly: boolean) {
    this.isReadOnly = isReadOnly;
    this.initScreenDraggable();
  }

  // Drop Event Emitter
  @Output() public onDroppableComplete: EventEmitter<MainTreeNode> = new EventEmitter();

  // 3
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private dragService: DragService
  ) {
    this.renderer.addClass(this.elementRef.nativeElement, 'app-droppable');
  }

  // 4
  ngOnInit() {
    // Add available zone
    // This exposes the zone to the service so a draggable element can update it
    this.initScreenDraggable();
    this.addOnDragEvents();
  }


  initScreenDraggable(){
    this.dragService.addAvailableScreenZone(this.screenName, this.currentZone, {
      begin: () => {
        this.renderer.addClass(this.elementRef.nativeElement, 'js-app-droppable--target');
      },
      end: () => {
        this.renderer.removeClass(this.elementRef.nativeElement, 'js-app-droppable--target');
      }, 
      isSkyTv: this.isSkyTv,
      isTv:  this.isTv,
      isReadOnly: this.isReadOnly
    });
  }

  // 5
  ngOnDestroy() {
    // Remove zone
    this.dragService.removeAvailableScreenZones(this.screenName, this.currentZone);

    // Remove events
    this.onDragEnter();
    this.onDragLeave();
    this.onDragOver();
    this.onDrop();
  }

  /**
   * @desc responsible for adding the drag events
   */
  // 6
  private addOnDragEvents(): void {
    // Drag Enter
    this.onDragEnter = this.renderer.listen(
      this.elementRef.nativeElement
      , 'dragenter'
      , (event: DragEvent): void => {
        this.handleDragEnter(event);
      });
    this.onDragLeave = this.renderer.listen(
      this.elementRef.nativeElement
      , 'dragleave'
      , (event: DragEvent): void => {
        this.handleDragLeave(event);
      });
    // Drag Over
    this.onDragOver = this.renderer.listen(
      this.elementRef.nativeElement
      , 'dragover'
      , (event: DragEvent): void => {
        this.handleDragOver(event);
      });
    // Drag Drop
    this.onDrop = this.renderer.listen(
      this.elementRef.nativeElement
      , 'drop'
      , (event: DragEvent): void => {
        this.handleDrop(event);
      });
  }

  /**
   * @desc responsible for handling the dragenter event
   * @param event
   */
  // 7
  private handleDragEnter(event: DragEvent): void {
    if (this.dragService.accepts(this.screenName, this.currentZone)) {
      // Prevent default to allow drop
      event.preventDefault();
      // Add styling
      this.renderer.addClass(event.target, 'js-app-droppable--zone');
    }
  }

  /**
   * @desc responsible for handling the dragleave event
   * @param event
   */
  // 8
  private handleDragLeave(event: DragEvent): void {
    if (this.dragService.accepts(this.screenName, this.currentZone)) {
      // Remove styling
      this.renderer.removeClass(event.target, 'js-app-droppable--zone');
      this.renderer.removeClass(this.elementRef.nativeElement, 'dropping');
    }
  }

  /**
   * @desc responsible for handling the dragOver event
   * @param event
   */
  // 9
  private handleDragOver(event: DragEvent): void {
    if (this.dragService.accepts(this.screenName, this.currentZone)) {
      // Prevent default to allow drop
      event.preventDefault();
      this.renderer.addClass(this.elementRef.nativeElement, 'dropping');
    }
  }

  /**
   * @desc responsible for handling the drop event
   * @param event
   */
  // 10
  private handleDrop(event: DragEvent): void {
    // Remove styling
    this.dragService.removeHighLightedAvailableScreenZones();
    this.renderer.removeClass(event.target, 'js-app-droppable--zone');
    this.renderer.removeClass(this.elementRef.nativeElement, 'dropping');

    if (event?.dataTransfer) {
      // Emit successful event
      this.onDroppableComplete.emit(JSON.parse(event.dataTransfer.getData('Promotion')));
    }
  }
}