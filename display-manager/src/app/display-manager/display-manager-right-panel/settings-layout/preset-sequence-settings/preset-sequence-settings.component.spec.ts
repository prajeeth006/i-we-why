import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SequencePresetService } from '../services/sequence-preset.service';
import { DialogueComponent } from 'src/app/common/dialogue/dialogue.component';
import { PresetSequenceSettingsComponent } from './preset-sequence-settings.component';
import { SequencePresetModelPopUpComponent } from '../screen-settings/sequence-popup/sequence-popup.component';
import { ConfirmationDialogComponent } from 'src/app/common/confirmation-dialog/confirmation-dialog.component';
import { FormControl, FormGroup } from '@angular/forms';
import { PresetData } from '../models/sequence-preset.model';

describe('PresetSequenceSettingsComponent', () => {
  let component: PresetSequenceSettingsComponent;
  let fixture: ComponentFixture<PresetSequenceSettingsComponent>;
  let sequencePresetService: jasmine.SpyObj<SequencePresetService>;
  let matDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    const sequencePresetServiceSpy = jasmine.createSpyObj('SequencePresetService', [
      'getPresetList',
      'deleteSequencePreset',
      'getSequencePreset',
      'populateForm',
    ]);

    const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const dialogRefMock = {
      beforeClosed: jasmine.createSpy('beforeClosed').and.returnValue(of('btn_delete')),
      afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of('some_value')), // Add this mock
    };
    matDialogSpy.open.and.returnValue(dialogRefMock as any);

    await TestBed.configureTestingModule({
      imports: [HttpClientModule, PresetSequenceSettingsComponent],
      providers: [
        { provide: SequencePresetService, useValue: sequencePresetServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PresetSequenceSettingsComponent);
    component = fixture.componentInstance;
    sequencePresetService = TestBed.inject(SequencePresetService) as jasmine.SpyObj<SequencePresetService>;
    matDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getPresetList when deletion is successful', () => {
    const mockResponse = { IsSuccess: true };
    sequencePresetService.deleteSequencePreset.and.returnValue(of(mockResponse));
    spyOn(component, 'getPresetList');

    component.deleteSequencePreset('123');

    expect(sequencePresetService.deleteSequencePreset).toHaveBeenCalledWith(component.currentLabel, '123');
    expect(component.getPresetList).toHaveBeenCalled();
  });


    it('should open DialogueComponent with response message when deletion fails', () => {
      const mockResponse = { IsDeleted: false, ErrorMessage: 'Deletion failed' };
      sequencePresetService.deleteSequencePreset.and.returnValue(of(mockResponse));

      component.deleteSequencePreset('123');

      expect(sequencePresetService.deleteSequencePreset).toHaveBeenCalledWith(component.currentLabel, '123');
      expect(matDialog.open).toHaveBeenCalledWith(DialogueComponent, { data: { message: mockResponse.ErrorMessage } });
    });


    it('should open DialogueComponent with error message when an error occurs', () => {
      const mockError = 'Network error';
      sequencePresetService.deleteSequencePreset.and.returnValue(throwError(() => mockError));

      component.deleteSequencePreset('123');

      expect(sequencePresetService.deleteSequencePreset).toHaveBeenCalledWith(component.currentLabel, '123');
      expect(matDialog.open).toHaveBeenCalledWith(DialogueComponent, { data: { message: mockError } });
    });


  describe('getPresetList', () => {
    it('should fetch preset settings and assign to presetSettings', () => {
      const mockPresetSettings = [{ id: '1', name: 'Preset 1' }, { id: '2', name: 'Preset 2' }];
      sequencePresetService.getPresetList.and.returnValue(of(mockPresetSettings));
      component.currentLabel = 'TestLabel';

      component.getPresetList();

      expect(sequencePresetService.getPresetList).toHaveBeenCalledWith('TestLabel');
      expect(component.presetSettings).toEqual(mockPresetSettings);
    });
  });

  describe('newSequencePreset', () => {
    it('should open SequencePresetModelPopUpComponent with the correct configuration', () => {
      component.presetSettings = [{ id: 1, Name: 'Preset 1' }, { id: 2, Name: 'Preset 2' }];
      const expectedConfig = {
        id: 'new-preset-modal-popup-card',
        width: '1024px',
        height: '820px',
        disableClose: true,
        backdropClass: 'scope-to-right-pannel',
        data: { presetNames: ['Preset 1', 'Preset 2'] },
      };

      jasmine.clock().install();
      component.newSequencePreset();
      jasmine.clock().tick(100);
      jasmine.clock().uninstall();

      expect(matDialog.open).toHaveBeenCalledWith(SequencePresetModelPopUpComponent, expectedConfig);
    });
  });

  describe('editSequencePreset', () => {
    it('should fetch sequence preset data, populate form, and open the edit dialog', () => {
      const mockPresetData: PresetData = {
        Assets: ['Asset1', 'Asset2'],
        Name: 'Test Preset',
        OrderId: 123,
        TotalAssets: 2,
      };
      const populatedForm = new FormGroup({
        id: new FormControl(mockPresetData.OrderId),
        name: new FormControl(mockPresetData.Name),
        stage: new FormControl('edit'),
        disableType: new FormControl(false),
      });

      sequencePresetService.getSequencePreset.and.returnValue(of(mockPresetData));
      sequencePresetService.populateForm.and.returnValue(populatedForm);
      component.currentLabel = 'TestLabel';

      const expectedDialogConfig = {
        id: 'edit-preset-modal-popup-card',
        width: '1024px',
        height: '820px',
        disableClose: true,
        backdropClass: 'scope-to-right-pannel',
        data: populatedForm,
      };

      component.editSequencePreset('123', 'Test Preset', 'custom');

      expect(sequencePresetService.getSequencePreset).toHaveBeenCalledWith('TestLabel', '123');
      expect(sequencePresetService.populateForm).toHaveBeenCalledWith(mockPresetData);
      expect(matDialog.open).toHaveBeenCalledWith(SequencePresetModelPopUpComponent, expectedDialogConfig);
      expect(component.disableEdit).toBeFalse();
    });
  });

  describe('openDeleteConfirmationPopup', () => {
    it('should open delete confirmation dialog with correct data', () => {
      const sequencePresetId = '123';
      const name = 'Test Preset';
      const expectedDialogData = {
        dialog_title: component.manualConstants.delete_preset,
        dialog_msg: `Are you sure you want to delete '${name}'?`,
        dialog_btn_cancel: component.manualConstants.btn_cancel,
        dialog_btn_delete: component.manualConstants.btn_delete
      };

      const expectedDialogConfig = {
        id: 'delete-modal',
        hasBackdrop: true,
        width: '40%',
        panelClass: 'modern-dialog',
        data: expectedDialogData
      };

      const dialogRefMock = {
        beforeClosed: jasmine.createSpy('beforeClosed').and.returnValue(of('btn_delete'))
      };
      matDialog.open.and.returnValue(dialogRefMock as any);

      component.openDeleteConfirmationPopup(sequencePresetId, name);

      expect(matDialog.open).toHaveBeenCalledWith(ConfirmationDialogComponent, expectedDialogConfig);
    });

    it('should handle cancellation correctly when dialog is closed with cancel button', () => {
      const sequencePresetId = '123';
      const name = 'Test Preset';
      const dialogRefMock = {
        beforeClosed: jasmine.createSpy('beforeClosed').and.returnValue(of('btn_cancel'))
      };
      matDialog.open.and.returnValue(dialogRefMock as any);

      component.openDeleteConfirmationPopup(sequencePresetId, name);

      expect(matDialog.open).toHaveBeenCalled();
      expect(dialogRefMock.beforeClosed).toHaveBeenCalled();
    });
  });
});
