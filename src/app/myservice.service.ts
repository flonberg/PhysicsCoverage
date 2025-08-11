import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {duty} from './models'
import { isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class MyserviceService {
  userid: string  = ''
  userkey: any = 0
  userLastName:string=''
  constructor(private HttpClient:HttpClient) { }
    setUserId(id: string) {
      this.userid = id;
    }
    getLoggedInUserKey(){
      return this.userkey
    }
    getUserLastName(){
      return this.userLastName
    }
    getUserKey(){
      return this.userkey
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
      let url = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_prod_/getPhysicsMonthlyDuties.php?MonthNum="+monthString+"&debug=`";			// 
                 https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_prod_/getPhysicsDuties.php
      if (isDevMode())
       url =    "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_dev_/getPhysicsMonthlyDuties.php?debug=1&MonthNum="+monthString+"&debug=1";       
      console.log("30303 url %o", url)
      return this .HttpClient.get<duty>(url)
    }  
    getFromPhysicsDuty(monthAdvance: number){
      var monthNumOfToday = new Date().getMonth()
      let url = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_prod_/getPhysicsDuties.php";			// 
      if (isDevMode()){
        url ="https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_dev_/getPhysicsDuties.php";     
        }
      if (monthAdvance >= 0)  
         url +="?newDuties=1" 
      console.log("3939 this.advanceMonth %o", monthAdvance)
      return this .HttpClient.get<duty>(url)
    }
    takeAssignment(idx: number){
      let url =  "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_prod_/takeDuty.php?idx="+idx+"&userkey="+this.userkey+"+&debug=1";		// 
                 https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_prod_/getPhysicsDuties.php
      if (isDevMode())
       url =    "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_dev_/takeDuty.php?idx="+idx+"&userkey="+this.userkey+"+&debug=1";       
      console.log("464646  url %o", url)
      return this .HttpClient.get<duty>(url)
    }
    setLoggedInUserKey(){
      let url = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_prod_/getLoggedInUserKey.php?userid="+this.userid;			// 
      if (isDevMode())
        url = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_dev_/getLoggedInUserKey.php?userid="+this.userid+"&debug=1";			//     
      this.HttpClient.get<any>(url).subscribe(res=>{
          const test = res
          this.userkey = res['userkey']
          this.userLastName = res['lastName']
        console.log("595959  userkey %o  --- %o", this.userkey, this.userLastName)  
      })
    }
    getMyduties(userkey:number){
      const todayStringForSQL = new Date().toISOString().slice(0, 10);
    }

    getForMyDuties(StartDateString: string, UserKey: number){
      let url = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_prod_/getMyDuties.php?Start="+StartDateString+"&userkey="+this.userkey;			// 
                 https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_prod_/getPhysicsDuties.php
      if (isDevMode()){
       // StartDateString = '2025-06-30'
        url =    "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_dev_/getMyDuties.php?debug=1&Start="+StartDateString+"&userkey="+this.userkey;	;	       
        }
       console.log("100100 getMyDuties url %o", url)
      return this .HttpClient.get<duty>(url)
    }  

}
