import { TestBed } from '@angular/core/testing';
import { RightPanelTabControlService } from './tab-control.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LabelSelectorService } from '../../display-manager-header/label-selector/label-selector.service';
import { ApiService } from 'src/app/common/api.service';
import { MatDialogModule } from '@angular/material/dialog';
import { IMultiEventTabs } from '../multi-event/model/IMultiEventTabs';
import { MainTreeNode } from '../../display-manager-left-panel/tree-view/models/main-tree-node.model';

describe('RightPanelTabControlService', () => {
  let service: RightPanelTabControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule],
      providers: [
        RightPanelTabControlService,
        LabelSelectorService,
        ApiService
      ]
    });
    service = TestBed.inject(RightPanelTabControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a new tab when onNewSportclick is called', () => {
    const eventType = 'Football';
    const initialLength = service.multieventTabs.length;

    service.onNewSportclick(eventType);

    expect(service.multieventTabs.length).toBe(initialLength + 1);
    expect(service.multieventTabs[initialLength]).toEqual(
      jasmine.objectContaining({
        eventType: eventType,
        tabName: jasmine.any(String),
        eventFormData: jasmine.any(Object),
      })
    );
  });

  it('should change tab name and event type when changeTabName is called', () => {
    service.multieventTabs = [
      { eventType: 'Cricket', tabName: 'Old Tab', eventFormData: {} } as IMultiEventTabs
    ];

    const tabIndex = 0;
    const newTabName = 'New Tab Name';
    const newEventType = 'Football';

    spyOn(service.multieventTabsSubject, 'next');

    service.changeTabName(tabIndex, newTabName, newEventType);

    expect(service.multieventTabs[tabIndex].tabName).toBe(newTabName);
    expect(service.multieventTabs[tabIndex].eventType).toBe(newEventType);
    expect(service.multieventTabsSubject.next).toHaveBeenCalledWith(service.multieventTabs);
  });

  it('should remove the linked tab and emit removalProgress', () => {
    service.multieventTabs = [
      { savedData: { id: '{12345}' }, eventType: 'Football', tabName: 'Match 1' } as IMultiEventTabs,
      { savedData: { id: '{67890}' }, eventType: 'Cricket', tabName: 'Match 2' } as IMultiEventTabs
    ];

    const treeNode = {
      nodeProperties: { id: '{12345}' }
    } as MainTreeNode;

    spyOn(service.removalProgress, 'next');

    service.closeLinkedTab(treeNode);

    expect(service.multieventTabs.length).toBe(1);
    expect(service.multieventTabs[0].savedData.id).toBe('{67890}');
    expect(service.removalProgress.next).toHaveBeenCalledWith(true);
  });

  it('should emit removalProgress when no matching tab is found', () => {
    service.multieventTabs = [
      { savedData: { id: '{67890}' }, eventType: 'Cricket', tabName: 'Match 2' } as IMultiEventTabs
    ];

    const treeNode = {
      nodeProperties: { id: '{99999}' }
    } as MainTreeNode;

    spyOn(service.removalProgress, 'next');

    service.closeLinkedTab(treeNode);

    expect(service.multieventTabs.length).toBe(1);
    expect(service.removalProgress.next).toHaveBeenCalledWith(true);
  });

  it('should remove the tab at the given index and emit selectedTabSubject', () => {
    service.multieventTabs = [
      { eventType: 'Football', tabName: 'Match 1' } as IMultiEventTabs,
      { eventType: 'Cricket', tabName: 'Match 2' } as IMultiEventTabs
    ];

    const tabIndex = 0;

    spyOn(service.selectedTabSubject, 'next');

    service.closeTab(tabIndex);

    expect(service.multieventTabs.length).toBe(1);
    expect(service.multieventTabs[0].eventType).toBe('Cricket');
    expect(service.selectedTabSubject.next).toHaveBeenCalledWith(true);
  });
});
