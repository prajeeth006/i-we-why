import { Component, Input } from "@angular/core";
import { ToteDividend } from "../../models/general-codes-model";

@Component({
  selector: "gn-banner",
  templateUrl: "./banner.component.html",
  styleUrls: ["./banner.component.scss"],
})
export class BannerComponent {
  @Input() contentParameter: {
    [attr: string]: string;
  };

  @Input() leadTitle: string | null;
  @Input() title: string;
  @Input() subtitleLeft: string;
  @Input() subtitleRight: string | null;
  @Input() imageRight: string | null;
  @Input() nonImageTextRight: string | null;
  @Input() result: string | null;
  @Input() placePot: string | null;
  @Input() quadPot: string | null;
  @Input() jackPot: string | null;
  DividendValue = ToteDividend.DividendValue;

  jackPotIsNum = (jackPot: string) => {
    return Number(jackPot) ? true : false;
  };

  constructor() {}
}
