import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DragService {
  private availableScreenZones: any = {};
  draggingAsset: any;

  /**
   * @desc responsible for storing the draggable elements
   * zone target.
   * @param {Array<string>} zoneIDs - the zoneIDs
   */
  public startDrag(dragging: any) {
    this.draggingAsset = dragging;
    this.highLightAvailableScreenZones();
  }

  /**
   * @desc responsible for matching the droppable element
   * with a draggable element
   * @param {string} zoneID - the zone ID to search for
   */
  public accepts(screenName: string, zone: string): boolean {
    return this.availableScreenZones[screenName] !== undefined && this.availableScreenZones[screenName][zone] !== undefined && !this.availableScreenZones[screenName][zone].pauseDrop;
  }

  /**
   * @desc responsible for removing highlighted available zones
   * that a draggable element can be added too.
   */
  public removeHighLightedAvailableScreenZones(): void {
    for (let screenName in this.availableScreenZones) {
      for (let zone in this.availableScreenZones[screenName]) {
        this.availableScreenZones[screenName][zone].end();
      }
    }
  }

  /**
   * @desc responsible for adding an available zone
   * @param {{ begin: Function, end: Function }} zoneID - zone key from DroppableOptions
   * @param {string} obj - reference to a start and stop object
   */
  public addAvailableScreenZone(screenName: string, zone: string, obj: { begin: Function, end: Function, isSkyTv: boolean, isTv?: boolean, isReadOnly?: boolean }): void {
    if (this.availableScreenZones[screenName] === undefined)
      this.availableScreenZones[screenName] = {};
    this.availableScreenZones[screenName][zone] = obj;
  }

  /**
   * @desc responsible for removing an available zone
   * @param {string} zoneID - the zone ID to search for
   */
  public removeAvailableScreenZones(screenName: string, zone: string): void {
    if(this.availableScreenZones[screenName] && this.availableScreenZones[screenName][zone])
    delete this.availableScreenZones[screenName][zone];
  }


  public pauseAvailableScreenZones(screenName: string, zone: string): void {
    if(this.availableScreenZones[screenName] && this.availableScreenZones[screenName][zone]){
      this.availableScreenZones[screenName][zone].pauseDrop = true;
    }
  }

  public resumeAvailableScreenZones(screenName: string, zone: string): void {
    if(this.availableScreenZones[screenName] && this.availableScreenZones[screenName][zone]){
      this.availableScreenZones[screenName][zone].pauseDrop = false;
    }
  }

  public resumeAllScreenZones(): void {
    for (const screenName in this.availableScreenZones) {
      for (const zone in this.availableScreenZones[screenName]) {
        this.resumeAvailableScreenZones(screenName, zone);
      }
    }
  }

  public pauseSkyScreenZones(isSkyChannel: boolean): void {
    for (const screenName in this.availableScreenZones) {
      for (const zone in this.availableScreenZones[screenName]) {
        if(zone == "undefined" || this.availableScreenZones[screenName][zone].isSkyTv == !isSkyChannel || this.availableScreenZones[screenName][zone].isTv || this.availableScreenZones[screenName][zone].isReadOnly ){
          this.pauseAvailableScreenZones(screenName, zone);
        }
      }
    }
  }

  /**
   * @desc responsible for highlighting available zones
   * that a draggable element can be added too.
   */
  private highLightAvailableScreenZones(): void {
    for (let screenName in this.availableScreenZones) {
      for (let zone in this.availableScreenZones[screenName]) {
        if(!this.availableScreenZones[screenName][zone].pauseDrop)
          this.availableScreenZones[screenName][zone].begin();
      }
    }
  }
}