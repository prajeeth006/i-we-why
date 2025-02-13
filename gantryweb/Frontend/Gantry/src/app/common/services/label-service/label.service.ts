import { Injectable } from '@angular/core';
import { Brands } from '../../constants/brands';

@Injectable({
  providedIn: 'root'
})
export class LabelService {
  isCoral: boolean; // if true its coral even otherwise its ladbrokes

  constructor() {
    const url = window.location.host;
    this.isCoral = url?.toLowerCase()?.includes(Brands.Coral);
  }

}
