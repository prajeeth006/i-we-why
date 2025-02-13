import { Component } from '@angular/core';
import { ProgressService } from '../common/progress-service/progress.service';

@Component({
  selector: 'base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.scss']
})
export class BaseLayoutComponent {

  showProgress: boolean;
  constructor(public progressService: ProgressService) {
    this.updateShowProgress();
  }

  updateShowProgress() {
    this.progressService.progress.subscribe((showProgress:boolean) => {
      //Settimeout is used because of below reason.
      //https://indepth.dev/posts/1001/everything-you-need-to-know-about-the-expressionchangedafterithasbeencheckederror-error
      setTimeout(()=> {
        this.showProgress = false;
      }, 0)
    });
  }
}
