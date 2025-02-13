import { CUSTOM_ELEMENTS_SCHEMA, ElementRef, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DroppableDirective } from './droppable.directive';
import { DragService } from '../../drag-and-drop/drag.service';
import { MainTreeNode } from 'src/app/display-manager/display-manager-left-panel/tree-view/models/main-tree-node.model';
import { of } from 'rxjs';

describe('DroppableDirective', () => {
  let directive: DroppableDirective;
  let elementRefMock: ElementRef;
  let rendererMock: Renderer2;
  let dragServiceMock: jasmine.SpyObj<DragService>;

  beforeEach(() => {
    elementRefMock = { nativeElement: document.createElement('div') } as ElementRef;
    rendererMock = jasmine.createSpyObj('Renderer2', ['addClass', 'removeClass', 'listen']);
    dragServiceMock = jasmine.createSpyObj('DragService', [
      'addAvailableScreenZone',
      'removeAvailableScreenZones',
      'accepts',
      'removeHighLightedAvailableScreenZones'
    ]);

    directive = new DroppableDirective(elementRefMock, rendererMock, dragServiceMock);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should initialize correctly and add event listeners', () => {
    spyOn(directive as any, 'addOnDragEvents');
    directive.ngOnInit();
    expect(directive['addOnDragEvents']).toHaveBeenCalled();
    expect(dragServiceMock.addAvailableScreenZone).toHaveBeenCalled();
  });


  it('should handle drag enter event', () => {
    dragServiceMock.accepts.and.returnValue(true);
    const event = new DragEvent('dragenter');
    directive['handleDragEnter'](event);
    expect(rendererMock.addClass).toHaveBeenCalledWith(event.target, 'js-app-droppable--zone');
  });

  it('should handle drag leave event', () => {
    dragServiceMock.accepts.and.returnValue(true);
    const event = new DragEvent('dragleave');
    directive['handleDragLeave'](event);
    expect(rendererMock.removeClass).toHaveBeenCalledWith(event.target, 'js-app-droppable--zone');
  });

  it('should handle drag over event', () => {
    dragServiceMock.accepts.and.returnValue(true);
    const event = new DragEvent('dragover');
    directive['handleDragOver'](event);
    expect(rendererMock.addClass).toHaveBeenCalledWith(elementRefMock.nativeElement, 'dropping');
  });
  it('should handle drop event and emit onDroppableComplete', () => {
    const mockPromotion = { id: 1, name: 'Promotion A' };
    const event = new DragEvent('drop', {
    });

    spyOn(directive.onDroppableComplete, 'emit');

    directive['handleDrop'](event);

    expect(dragServiceMock.removeHighLightedAvailableScreenZones).toHaveBeenCalled();
    expect(rendererMock.removeClass).toHaveBeenCalledWith(event.target, 'js-app-droppable--zone');
    expect(rendererMock.removeClass).toHaveBeenCalledWith(elementRefMock.nativeElement, 'dropping');
  });
});