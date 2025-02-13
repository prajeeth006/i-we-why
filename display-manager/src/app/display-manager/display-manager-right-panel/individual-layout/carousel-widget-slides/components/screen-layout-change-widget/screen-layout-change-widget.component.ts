import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, effect, inject, Input, input, output} from '@angular/core';
import { ScreenLayoutChangeWidgetService } from './screen-layout-change-widget.service';
import { RangePipe } from 'src/app/common/pipes/range-pipe.pipe';
import { ScreenData } from '../../../models/individual-gantry-screens.model';
import { Constants } from '../../../../../display-manager-right-panel/constants/constants';
import { MatDialog } from '@angular/material/dialog';
import { ActionDialogComponent } from '../../../../../../common/action-dialog/action-dialog.component';
import { SequencencingHelperService } from 'src/app/display-manager/services/sequencencing-helper/sequencencing-helper.service';
import { LabelSelectorService } from '../../../../../display-manager-header/label-selector/label-selector.service';
@Component({
  selector: 'screen-layout-change-widget',
  standalone: true,
  imports: [NgClass, NgTemplateOutlet, RangePipe],
  templateUrl: './screen-layout-change-widget.component.html',
  styleUrl: './screen-layout-change-widget.component.scss'
})
export class ScreenLayoutChangeWidgetComponent {
  layoutConstants = Constants;
  screenLayoutChangeWidgetService = inject(ScreenLayoutChangeWidgetService);
  sequencencingHelper = inject(SequencencingHelperService);

    labelSelectorService = inject(LabelSelectorService);
  @Input() screenData: ScreenData;
  onToggle = output<any>();

  showLayoutOptions: boolean = false;
  activeLayout = '';

  screenLayouts: Array<{ type: string; typeName: string;  class: string; widgets: number }> = [];

  constructor(public dialog: MatDialog) {
    this.screenLayoutChangeWidgetService.activeScreenNumber$.subscribe(screenNumber => {
      this.showLayoutOptions = this.screenData?.ScreenNumber === screenNumber;
    })
  }

  ngOnChanges() {
    this.setActiveLayut();
  }
  
  ngOnInit() {
    this.setActiveLayut();
  }

  setActiveLayut(){
    this.screenLayouts = [
      {
        type: 'screen-layout-single',
        typeName: 'SINGLE',
        class: 'screen-layout-single',
        widgets: 1
      },
      {
        type: 'screen-layout-duo1',
        typeName: 'DUO1',
        class: 'screen-layout-duo-1',
        widgets: 2,
      },
      {
        type: 'screen-layout-trio1',
        typeName: 'TRIO1',
        class: 'screen-layout-trio-1',
        widgets: 3
      },
      {
        type: 'screen-layout-trio2',
        typeName: 'TRIO2',
        class: 'screen-layout-trio-2',
        widgets: 3
      },
      {
        type: 'screen-layout-quad',
        typeName: 'QUAD',
        class: 'screen-layout-quad',
        widgets: 4
      },
    ];
    
    // initialize activeLayout with current screen layout type on widget load 
    this.activeLayout = `screen-layout-${this.screenData?.ScreenType?.toLowerCase()}`;
  }

  checkLayoutConfirmation(layoutName: string) {
    if (this.activeLayout != `screen-layout-${layoutName.toLowerCase()}`) {
      const layout_confirmation_msg = this.labelSelectorService?.configItemValues?.layout_confirmation_msg || '';

      const layout_confirmation_sub_msg = this.labelSelectorService?.configItemValues?.layout_confirmation_sub_msg || '';
      const confirmationDialogData = {
        dialog_title: this.layoutConstants.layout_confirmation_title,
        dialog_msg: `${layout_confirmation_msg}<br><br>${layout_confirmation_sub_msg}`,
        dialog_btn_cancel: this.layoutConstants.btn_cancel,
        dialog_btn_submit: this.layoutConstants.btn_continue,
      };
      const dialogRef = this.dialog.open(ActionDialogComponent, {
        id: 'confirm-change-modal',
        hasBackdrop: true,
        width: '40%',
        panelClass: 'modern-dialog',
        disableClose: true,
        data: { ...confirmationDialogData, change: false },
      });

      dialogRef.afterClosed().subscribe(isChange => {
        if (isChange) {
          this.changeScreenLayout(layoutName);
        }
      });
    }
  }

  seperateLayoutName(text: string): string {
    return text.replace('screen-layout-', '').toUpperCase()
  }

  changeScreenLayout(layoutName: string) {
    this.activeLayout = `screen-layout-${layoutName.toLowerCase()}`;
    this.onToggle.emit(layoutName);
  }

  handleScreenToggle() {
    if (this.showLayoutOptions) {
      this.screenLayoutChangeWidgetService.activeScreenNumber$.next(this.screenData?.ScreenNumber ?? null);
    } else {
      this.screenLayoutChangeWidgetService.activeScreenNumber$.next(null);
    }
  }

  handleScreenToggleClick(event: MouseEvent) {
    event.stopPropagation();
    this.showLayoutOptions = !this.showLayoutOptions;
    this.handleScreenToggle();
  }

}
