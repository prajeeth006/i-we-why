import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormGroup, FormGroupDirective } from '@angular/forms';
import { LabelSelectorService } from 'src/app/display-manager/display-manager-header/label-selector/label-selector.service';
import { Filters } from 'src/app/display-manager/display-manager-left-panel/generic-tab-service/model/filters.model';
import { ScItem, ScMultiEventItem } from 'src/app/sitecore/sc-models/sc-item.model';
import { MultieventService } from '../multi-event/services/multievent.service';
import { Event, RacingEvents } from '../../display-manager-left-panel/tree-view/models/event.model';

@Component({
  selector: 'app-racing-header',
  templateUrl: './racing-header.component.html',
  styleUrls: ['./racing-header.component.scss']
})
export class RacingHeaderComponent implements OnInit {
  datePipe: DatePipe = new DatePipe('en-US');
  todayDate: string | null = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  maxAllowDate: string | null = this.datePipe.transform(new Date(new Date().setDate(new Date().getDate() + 7)), 'yyyy-MM-dd');
  @Input() formGroupName: string;
  form!: UntypedFormGroup;
  @Input() selectedTabName: string | null;
  @Input() categories: any | Event[];
  @Input() competitions: any | Event[];
  @Input() regions: any | Event[];
  marketTemplates: ScMultiEventItem[] = [];
  filter: Filters = new Filters();
  events: Event[] = [];
  @Output() eventsChange = new EventEmitter();
  constructor(private multieventService: MultieventService,
    private labelSelectorService: LabelSelectorService, private rootFormGroup: FormGroupDirective) { }

  ngOnInit(): void {
    this.form = this.rootFormGroup.control.get(this.formGroupName) as UntypedFormGroup;
  }
  ngOnChanges(changes: SimpleChanges) {
    if ("categories" in changes) {
      if (changes.categories.currentValue && changes.categories.currentValue.length > 0) {
        changes.categories.currentValue.forEach((category: any) => {
          if (category?.categoryCode == this.form.value?.category?.categoryCode) {
            this.form.controls.category.setValue(category);
            this.setRegion();
            if(this.form.value?.date) {
              this.onDateChange();
            }
          }
        })
      }
    }
  }
  setRegion() {
      this.multieventService.loadItems(this.labelSelectorService.getCurrentLabel(), [this.form.value.category], new Filters(), true).subscribe((data: RacingEvents) => {
        this.regions = data?.content;
        this.competitions = [];
        this.events = [];
        this.marketTemplates = [];
        if (this.regions && this.regions.length > 0) {          
          this.form.controls.region.setValue(this.regions.filter((region: any) => region.name == this.form.value?.region?.name)[0]);
          this.setCompetion(this.form.controls?.region);
        }
        this.multieventService.loadTemplates(this.form.value.category.name).subscribe((item: ScItem) => {
          this.multieventService.loadMarketTemplates(item.ItemID).subscribe((marketTemplates: ScMultiEventItem[]) => {
            this.marketTemplates = marketTemplates;
            if (this.marketTemplates && this.marketTemplates.length > 0) {
              this.form.controls.market.setValue(this.marketTemplates.filter((market: any) => market.MultieventTemplateName == this.form.value.market.MultieventTemplateName)[0]);
              this.filter.markets = this.form.value.market?.Markets;
            }
          })
        })

      })
  }
  setCompetion(event: any) {
    this.multieventService.loadItems(this.labelSelectorService.getCurrentLabel(), [event.value], new Filters(), false).subscribe((data: RacingEvents) => {
      this.competitions = data?.content;
      if (this.competitions && this.competitions.length > 0) {
        this.form.controls.competition.setValue(this.competitions.filter((competition: any) => competition.name == this.form.value?.competition?.name)[0]);
      }
    })
  }
  onCategoryChange() {
    if (this.form.value.category)
      this.multieventService.loadItems(this.labelSelectorService.getCurrentLabel(), [this.form.value.category], new Filters(), true).subscribe((data: RacingEvents) => {
        this.regions = data?.content;
        this.competitions = [];
        this.events = [];
        this.marketTemplates = [];

        this.form.controls.region.reset();
        this.form.controls.competition.reset();
        this.form.controls.market.reset();

        this.multieventService.loadTemplates(this.form.value.category.name).subscribe((item: ScItem) => {
          this.multieventService.loadMarketTemplates(item.ItemID).subscribe((marketTemplates: ScMultiEventItem[]) => {
            this.marketTemplates = marketTemplates;
          })
        })

      })
  }
  onMarketChange() {
    this.filter.markets = this.form.value.market?.Markets;
    this.events = [];
  }
  classChanged(event: any) {
    this.multieventService.loadItems(this.labelSelectorService.getCurrentLabel(), [event.value], new Filters(), false).subscribe((data: RacingEvents) => {
      this.competitions = data?.content;
      this.form.controls.competition.reset();
      this.events = [];
    })
  }
  onDateChange() {
    if (this.form.valid) {
      const presentDate = new Date();
      const date1: any = new Date(presentDate.getFullYear(), presentDate.getMonth(), presentDate.getDate());
      const date2: any = new Date(this.form.value.date);
      const diffTime: any = Math.abs(date2 - date1);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      this.filter.dateTo = diffDays?.toString();
    } else if (!this.form.controls.date.valid) {
      this.form.controls.date.setValue(this.todayDate);
    }
  }
  resetForm() {
    this.form.reset();
    this.onMarketChange();
    this.events = [];
    this.eventsChange.emit(this.events);
    this.todayDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.datePipe = new DatePipe('en-US');
    this.form.controls.date.setValue(this.todayDate);
    this.maxAllowDate = this.datePipe.transform(new Date(new Date().setDate(new Date().getDate() + 7)), 'yyyy-MM-dd');
  }
  submitForm() {
    if (this.form.value.market?.IsPageDoesNotDependsOnEvents == "1") {
      this.events = JSON.parse(JSON.stringify(this.competitions));
      this.eventsChange.emit(this.events);
    } else {
      let competition = [];
        competition = [this.form.value.competition]

      this.multieventService.loadItems(this.labelSelectorService.getCurrentLabel(), competition, this.filter, false).subscribe((data: RacingEvents) => {
        data.content = data?.content?.filter(x => x.name != "MeetingResults");
        this.events = data?.content.filter(x => !(x.markets == undefined || x.markets?.length <= 0));
        this.eventsChange.emit(this.events);
      })
    }

  }
}