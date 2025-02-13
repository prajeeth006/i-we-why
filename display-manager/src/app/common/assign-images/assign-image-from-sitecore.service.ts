import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GantryTab } from 'src/app/display-manager/display-manager-left-panel/product-tabs/product-tabs.component';
import { ScItemService } from 'src/app/sitecore/sc-item-service/sc-item.service';
import { Image } from '../../sitecore/sc-models/sc-image.model';

@Injectable({
  providedIn: 'root'
})
export class AssignImageFromSitecoreService {

  constructor(private scItemService: ScItemService) { }

  public assignImage(Item: GantryTab) : Observable<Image> {
    // var imageData : Observable<Image> = new Observable<Image>();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = Item?.Image;
    const imageMediaId = tempDiv.querySelector('img')?.getAttribute('mediaid');
    // if(!!imageMediaId)
    // {
    //   imageData= this.scItemService.getDataFromMasterDB<Image>('/sitecore/api/ssc/item/' + imageMediaId);
    // }
    return this.scItemService.getDataFromMasterDB<Image>('/sitecore/api/ssc/item/' + imageMediaId);
      // .subscribe((image: Image) => {
      //   Item.imageUrl = image.ItemMedialUrl;
      // });
  }

}
