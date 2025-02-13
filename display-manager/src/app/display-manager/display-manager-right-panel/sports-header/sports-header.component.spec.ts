import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SportsHeaderComponent } from './sports-header.component';
import { MultieventService } from '../multi-event/services/multievent.service';
import { LabelSelectorService } from 'src/app/display-manager/display-manager-header/label-selector/label-selector.service';
import { FormGroupDirective } from '@angular/forms';
import { of } from 'rxjs';
import { ScItem, ScMultiEventItem } from 'src/app/sitecore/sc-models/sc-item.model';
import { Filters } from '../../display-manager-left-panel/generic-tab-service/model/filters.model';
import { SimpleChanges } from '@angular/core';

describe('SportsHeaderComponent', () => {
  let component: SportsHeaderComponent;
  let multieventServiceMock: jasmine.SpyObj<MultieventService>;
  let labelSelectorServiceMock: jasmine.SpyObj<LabelSelectorService>;

  const mockScItem: ScItem = {
    ItemID: '123',
    ItemName: 'Mock Item',
    Level: 1,
    TemplateName: 'Mock Template',
    TargetLink: 'https://example.com',
    HasChildren: ''
  };

  const mockMarketTemplates: ScMultiEventItem[] = [
    {
      ItemID: '456',
      MultieventTemplateName: 'Mock Template Name',
      ItemName: 'Mock Market Item',
      Level: 1,
      TemplateName: 'Mock Market Template',
      TargetLink: 'https://example.com',
      HasChildren: ''
    },
    {
      ItemID: '789',
      MultieventTemplateName: 'Another Template Name',
      ItemName: 'Another Mock Market Item',
      Level: 1,
      HasChildren: "",
      TemplateName: 'Another Mock Market Template',
      TargetLink: 'https://example.com',
    },
  ];

  beforeEach(async () => {
    multieventServiceMock = jasmine.createSpyObj('MultieventService', ['loadItems']);
    labelSelectorServiceMock = jasmine.createSpyObj('LabelSelectorService', ['getCurrentLabel']);

    await TestBed.configureTestingModule({
      declarations: [SportsHeaderComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: MultieventService, useValue: multieventServiceMock },
        { provide: LabelSelectorService, useValue: labelSelectorServiceMock },
        { provide: FormGroupDirective, useValue: { control: { get: () => ({}) } } },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(SportsHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should call setCompition and update form controls', () => {

    component.form = {
      value: {
        region: [{ name: 'Region 1' }],
        competition: [{ name: 'Competition 1' }],
      },
      controls: {
        competition: { setValue: jasmine.createSpy() },
      },
    } as any;

    const mockCompetitions = {
      content: [
        { id: '1', name: 'Competition 1' },
        { id: '2', name: 'Competition 2' },
      ],
    };

    multieventServiceMock.loadItems.and.returnValue(of(mockCompetitions));
    labelSelectorServiceMock.getCurrentLabel.and.returnValue('label1');

    component.setCompition();

    expect(component.form.controls.competition.setValue).toHaveBeenCalledWith([
      { id: '1', name: 'Competition 1' },
    ]);
  });
  it('should update filter.markets and reset events on market change', () => {
    component.form = {
      value: {
        market: { Markets: ['Market 1', 'Market 2'] },
      },
      controls: {
        market: { setValue: jasmine.createSpy() },
      },
    } as any;

    component.onMarketChange();

    expect(component.filter.markets).toEqual(['Market 1', 'Market 2']);
    expect(component.events).toEqual([]);
  });

  it('should load items and reset form controls when regionChanged is called with false', () => {
    component.form = {
      value: {
        region: [{ name: 'Region 1' }],
      },
      controls: {
        competition: { reset: jasmine.createSpy() },
      },
    } as any;

    const mockCompetitions = {
      content: [{ id: '1', name: 'Competition 1' }],
    };

    multieventServiceMock.loadItems.and.returnValue(of(mockCompetitions));
    labelSelectorServiceMock.getCurrentLabel.and.returnValue('label1');

    component.regionChanged(false);

    expect(component.form.controls.competition.reset).toHaveBeenCalled();

    expect(component.events).toEqual([]);
  });

  it('should update filter.dateTo when the form is valid and date is changed', () => {

    const today = new Date();
    component.form = {
      value: {
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3),
      },
      controls: {
        date: { valid: true, setValue: jasmine.createSpy() },
      },
      valid: true,
    } as any;

    component.onDateChange();

    const expectedDiffDays = 3;

    expect(component.filter.dateTo).toBe(expectedDiffDays.toString());
  });


  it('should submit form and update events when market IsPageDoesNotDependsOnEvents is 1', () => {
    component.form = {
      value: {
        market: { IsPageDoesNotDependsOnEvents: '1' },
        competition: [],
      },
      controls: {
        competition: { setValue: jasmine.createSpy() },
      },
    } as any;

    component.competitions = [
      { id: '1', name: 'Competition 1' },
      { id: '2', name: 'Competition 2' },
    ];

    const eventsChangeEmitSpy = spyOn(component.eventsChange, 'emit');

    component.submitForm();

    expect(component.events).toEqual(component.competitions);
    expect(eventsChangeEmitSpy).toHaveBeenCalledWith(component.competitions);
  });

  it('should throw an error when todayDate is called', () => {

    const todayDateSpy = spyOn(component, 'todayDate').and.callThrough();


    expect(() => component.todayDate(new Date())).toThrowError('Method not implemented.');
    expect(todayDateSpy).toHaveBeenCalled();
  });

  it('should update form controls and call setRegion when categories input changes', () => {

    component.form = {
      value: {
        category: { categoryCode: '123' },
      },
      controls: {
        category: { setValue: jasmine.createSpy() },
      },
    } as any;


    const mockCategories = [
      { categoryCode: '123', name: 'Category 1' },
      { categoryCode: '456', name: 'Category 2' },
    ];


    const changes: SimpleChanges = {
      categories: {
        currentValue: mockCategories,
        previousValue: null,
        firstChange: true,
        isFirstChange: function (): boolean {
          throw new Error('Function not implemented.');
        }
      },
    };

    spyOn(component, 'setRegion');

    component.ngOnChanges(changes);

    expect(component.form.controls.category.setValue).toHaveBeenCalledWith(mockCategories[0]);

    expect(component.setRegion).toHaveBeenCalled();

    if (component.form.value.date) {
      spyOn(component, 'onDateChange');
      component.ngOnChanges(changes);
      expect(component.onDateChange).toHaveBeenCalled();
    }
  });

});
