import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LabelSelectorService } from './label-selector.service';

@Component({
  selector: 'label-selector',
  templateUrl: './label-selector.component.html',
  styleUrls: ['./label-selector.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LabelSelectorComponent implements OnInit {
  labels: string[];
  selectedVal: string;
  selectedLabelValue: string;

  constructor(public labelSelectorService: LabelSelectorService) { }

  ngOnInit(): void {
    this.labelSelectorService.loadLabels();
    this.selectedLabelValue = sessionStorage.getItem('selectedLabel') as string;
    this.labelSelectorService.currentLabel$.subscribe((currentLabel: string) => {
      this.selectedVal = currentLabel ? currentLabel : this.selectedLabelValue;
    });
  }

}
