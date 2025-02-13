import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/common/api.service';
import { ScreenRuleRequest } from 'src/app/display-manager/display-manager-right-panel/display-manager-screens/models/display-screen-rule.model';
import { Carousel } from './models/carousel';

@Injectable({
  providedIn: 'root'
})
export class CarouselContentService {

  constructor(private apiService: ApiService) { }

  createCaruouselRule(id: string, name: string, screenRuleRequest : ScreenRuleRequest){
    return this.apiService.post<Carousel>('/sitecore/api/displayManager/gantryTargetingCarousel/createCarouselRule', {
      Id: id,
      Name: name,
      GantryTargetingRules: screenRuleRequest
    });
  }

  getCarouselRules(carouselId?: string): Observable<Carousel>{
      let params = new HttpParams().append('carouselId', carouselId ? carouselId: "");
      return this.apiService.get('/sitecore/api/displayManager/gantryTargetingCarousel/getCarousel', params );
  }
}
