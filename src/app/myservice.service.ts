import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {duty} from './models'
import { isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class MyserviceService {
  userid: string  = ''

  constructor(private HttpClient:HttpClient) { }
    setUserId(id: string) {
      this.userid = id;
    }
    getUserId(): string  {
      return this.userid;
    }
    createDateFromMonth(year: number, month: number): Date {
      return new Date(year, month - 1, 1);
    }
    formatDateYYYYMMDD(date: Date): string {
      return date.toISOString().slice(0, 10);
    }
    getForMonth(monthString: string){
      let url = "https://whiteboard.partners.org/esb/FLwbe/_prod_/APhysicsCov2025/getPhysicDuties.php?.MonthNum="+monthString;			// 
      if (isDevMode())
       url =  "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_dev_/getPhysicsDuties.php?debug=1&MonthNum="+monthString;  
      console.log("30303 url %o", url)
      return this .HttpClient.get<duty>(url)
    }  

}
