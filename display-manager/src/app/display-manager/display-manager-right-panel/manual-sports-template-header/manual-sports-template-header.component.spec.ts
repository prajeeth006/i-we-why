import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ManualSportsTemplateHeaderComponent } from './manual-sports-template-header.component';
import { ReactiveFormsModule, FormGroupDirective, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RightPanelTabControlService } from '../services/tab-control.service';
import { of } from 'rxjs';
import { ActionDialogComponent } from 'src/app/common/action-dialog/action-dialog.component';

describe('ManualSportsTemplateHeaderComponent', () => {
  let component: ManualSportsTemplateHeaderComponent;
  let fixture: any;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let tabControlServiceSpy: jasmine.SpyObj<RightPanelTabControlService>;

  beforeEach(() => {
    const dialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    const tabControlServiceMock = jasmine.createSpyObj('RightPanelTabControlService', ['multieventTabs']);

    TestBed.configureTestingModule({
      declarations: [ManualSportsTemplateHeaderComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: FormGroupDirective, useValue: { control: { get: () => ({}) } } },
        { provide: MatDialog, useValue: dialogMock },
        { provide: RightPanelTabControlService, useValue: tabControlServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ManualSportsTemplateHeaderComponent);
    component = fixture.componentInstance;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    tabControlServiceSpy = TestBed.inject(RightPanelTabControlService) as jasmine.SpyObj<RightPanelTabControlService>;
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(ManualSportsTemplateHeaderComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });


  it('should require valid sport name', () => {
    component.form = new FormGroup({
      sportName: new FormControl('', [Validators.required])
    });

    component.form.setValue({
      sportName: ''
    });

    expect(component.form.valid).toEqual(false);
  });


  it('should require valid event name', () => {
    component.form = new FormGroup({
      eventName: new FormControl('', [Validators.required])
    });

    component.form.setValue({
      eventName: ''
    });

    expect(component.form.valid).toEqual(false);
  });


});