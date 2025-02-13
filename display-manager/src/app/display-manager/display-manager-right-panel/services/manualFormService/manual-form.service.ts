import { Injectable } from '@angular/core';
import { DialogueComponent } from 'src/app/common/dialogue/dialogue.component';
import { Constants } from '../../constants/constants';
import { UntypedFormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ManualFormService {

  manualConstants = Constants;

  constructor(private matDialogue: MatDialog) { }

  finishedSortArray(runnersArray: UntypedFormArray) {
    runnersArray?.controls.sort((a, b) => {
      return <any>(a.value?.finished) - <any>(b.value?.finished);
    });
    runnersArray.markAsDirty();
  }

  payoutChange(index: number, runnersArray: UntypedFormArray) {
    runnersArray.controls[index].patchValue({ 'price_odds_sp': JSON.parse(JSON.stringify(runnersArray?.controls[index]?.value?.odds_sp_value)) });
    let newOddsSartPrice: string = runnersArray?.controls[index]?.value?.price_odds_sp;
    let breakchk: boolean = false;
    if (newOddsSartPrice && newOddsSartPrice?.length > 0) {
      if (newOddsSartPrice.includes(' ')) {
        breakchk = true;
      } else {
        for (let i = 0; i < newOddsSartPrice?.length; i++) {
          if ((i == 0 && newOddsSartPrice[i] == '/') || (isNaN(Number(newOddsSartPrice[i])) && newOddsSartPrice[i] != '/') || (newOddsSartPrice.split('/').length > 2) || (i == newOddsSartPrice?.length - 1 && newOddsSartPrice[i] == '/')) {
            breakchk = true;
          }
        }
      }
    }

    if (breakchk) {
      this.matDialogue.open(DialogueComponent, { data: { message: this.manualConstants.dialogue_error_odds_sp } });
      runnersArray?.controls[index]?.patchValue({ 'price_odds_sp': null, 'odds_sp_value': null });
    }
  }

  payoutChangeResult(index: number, runnersArray: UntypedFormArray) {
    runnersArray.controls[index].patchValue({ 'result_odds_sp': JSON.parse(JSON.stringify(runnersArray?.controls[index]?.value?.odds_sp_value)) });
  }
}
