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
      let url = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_prod_/getPhysicsMonthlyDuties.php?MonthNum="+monthString;			// 
                 https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_prod_/getPhysicsDuties.php
      if (isDevMode())
       url =    "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_dev_/getPhysicsMonthlyDuties.php?debug=1&MonthNum="+monthString;       
      console.log("30303 url %o", url)
      return this .HttpClient.get<duty>(url)
    }  
    getFromPhysicsDuty(){
      let url = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_prod_/getPhysicsDuties.php";			// 
                 https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_prod_/getPhysicsDuties.php
      if (isDevMode())
       url =    "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_dev_/getPhysicsDuties.php?debug=1";       
      console.log("3939  url %o", url)
      return this .HttpClient.get<duty>(url)
    }
    takeAssignment(idx: number){
      let url = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_prod_/getPhysicsDuties.php";			// 
                 https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_prod_/getPhysicsDuties.php
      if (isDevMode())
       url =    "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_dev_/takeDuty.php?idx="+idx+"&userid="+this.userid+"+&debug=1";       
      console.log("464646  url %o", url)
      return this .HttpClient.get<duty>(url)
    }

}
