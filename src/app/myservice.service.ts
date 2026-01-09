import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {duty} from './models'
import { isDevMode } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MyserviceService {
  userid: string  = ''
  userkey: any = 0
  userLastName:string=''
  loggedInUserKey: number = 0
  loggedInUserid: string = '0'
  isDosimetrist: boolean = false
  gotData: boolean = false
  constructor(private HttpClient:HttpClient) { }
    setUserId(id: string) {
      this.userid = id;
    }
    getLoggedInUserKey(){
     //  console.log("212121 getting loggedInUserKey %o", this.loggedInUserKey)
      return this.loggedInUserKey
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
    getFromAssets(): Observable<any> {
      return this.HttpClient.get<any>('assets/config.json');
    }
    getFullNameFromUserKey(userkey: number){
      let url = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_prod_/getFullName.php?userkey="+userkey;      // 
      if (isDevMode())
        url = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_dev_/getFullName.php?userkey="+userkey+"&debug=1";			//  debug 
      return this .HttpClient.get<duty>(url)
    }
    enterTA(startDateString: string, endDateString: string, reason: string, coverer: any, userkey: number, userLastName: string,note:string, isDosimetrist: boolean){
      let url = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_prod_/enterTA.php?startDate="+startDateString+"&endDate="+endDateString+
      "&reason="+reason+"&coverer="+coverer+"&userkey="+this.loggedInUserKey +"&note="+this.sanitizeHtmlDisplay(note)+"&isDosimetrist="+isDosimetrist;      // 
      if (isDevMode())    
         url = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_dev_/enterTA.php?startDate="+startDateString+"&endDate="+endDateString+
            "&reason="+reason+"&coverer="+coverer+"&userkey="+this.loggedInUserKey + "&note="+this.sanitizeHtmlDisplay(note)+ "&isDosimetrist="+isDosimetrist;  
          console.log("30303 url %o", url)
      return this .HttpClient.get<duty>(url)
    }
    enterTriageCov(userkey:number,serviceid:number, date: string){
      let url = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_prod_/enterTriageCov.php?date="+date+"&userkey="+userkey+"&serviceid="+serviceid;      // 
      if (isDevMode())   
          url = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_dev_/enterTriageCov.php?date="+date+"&userkey="+userkey+"&serviceid="+serviceid+"&debug=1"; 
          console.log("30303 url %o", url)
      return this .HttpClient.get<duty>(url)
    }

    editTA(newValue: string | number, newValueName: string, vidx:number){
      let url = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_prod_/editTAs.php?newValue="+newValue+"&newValueName="+newValueName+"&vidx="+vidx;      // 
                 //https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_prod_/getPhysicsDuties.php
      if (isDevMode())   
          url = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_dev_/editTAs.php?newValue="+newValue+"&newValueName="+newValueName+"&vidx="+vidx+"&debug=1";
          console.log("30303 url %o", url)
      return this .HttpClient.get<duty>(url)
    }
  sanitizeHtmlDisplay(str: string): string {
  const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
      };
      const reg = /[&<>"'/]/ig;
      return str.replace(reg, (match) => map[match]);
  }
    getForMonth(monthString: string){
      const randomNumber: number = Math.random()
      let url = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_prod_/getPhysicsMonthlyDuties.php?MonthNum="+monthString+"&random="+randomNumber;			// 
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
      
      let url =  "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_prod_/takeDuty.php?idx="+idx+"&userkey="+this.loggedInUserKey+"+&debug=1";		// 
                 https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_prod_/getPhysicsDuties.php
      if (isDevMode())
       url =    "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_dev_/takeDuty.php?idx="+idx+"&userkey="+this.loggedInUserKey+"+&debug=1";       
      console.log("464646  url %o", url)
      return this .HttpClient.get<duty>(url)
    }
    setLoggedInUserKey(){
      let url = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_prod_/getLoggedInUserKey.php?userid="+this.userid;			// 
      if (isDevMode())
        url = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_dev_/getLoggedInUserKey.php?userid="+this.userid+"&debug=1";			//   
        this.HttpClient.get<any>(url).subscribe(res=>{
            const test = res
            this.loggedInUserKey = res['userkey']
            this.userLastName = res['lastName']
            this.isDosimetrist = res['isDosimetrist']
            this.gotData = true
          console.log("595959  userkey %o  ---LastName %o ---isDosimetrist %o", this.loggedInUserKey, this.userLastName, this.isDosimetrist)  
        })
    }
    getGotData(): boolean {
      return this.gotData;
    }

    get2loggedInUserKey(){
         let url = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_prod_/getLoggedInUserKey.php?userid="+this.userid;			// 
      if (isDevMode())
        url = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_dev_/getLoggedInUserKey.php?userid="+this.userid+"&debug=1";			//   
      return this .HttpClient.get<duty>(url)
    } 
    getMyduties(userkey:number){
      const todayStringForSQL = new Date().toISOString().slice(0, 10);
    }

    getForMyDuties(StartDateString: string, UserKey: number){
      let url = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_prod_/getMyDuties.php?Start="+StartDateString+"&userkey="+UserKey;			// 
                 https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_prod_/getPhysicsDuties.php
      if (isDevMode()){
       // StartDateString = '2025-06-30'
        url =    "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_dev_/getMyDuties.php?debug=1&Start="+StartDateString+"&userkey="+UserKey;	;	       
        }
       console.log("100100 getMyDuties url %o", url)
      return this .HttpClient.get<duty>(url)
    }  
    getTAs(endDateString: string, startDateString: string, which: number, loggedInUserid:string){
      if (loggedInUserid !== undefined && loggedInUserid !="0" )
          this.loggedInUserid = loggedInUserid
      console.log("157157 this.loggedInUserid %o", this.loggedInUserid)
      let url = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_prod_/getTAs.php?endDate="+endDateString + "&startDate=" + startDateString + "&loggedInUserId=" + loggedInUserid + "&which=" + which;  //       
      if (isDevMode())
        url =    "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_dev_/getTAs.php?debug=1&endDate="+endDateString+ "&startDate=" + startDateString + "&loggedInUserId=" + this.loggedInUserid + "&which=" + which;
        console.log("333 getTAs url %o", url)
        return this .HttpClient.get<duty>(url)
    }
    getDosims(){
      let url = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_prod_/getDosim.php"
      if (isDevMode())
        url =    "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_dev_/getDosim.php?debug=1";
        return this .HttpClient.get<duty>(url)
    }
    getTriageCoverers(startDate: string, endDate: string, loggedInUserId: string){
      let url = "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_prod_/getTriageCoverers.php?startDate="+startDate+"&endDate="+endDate + "&loggedInUserId="+loggedInUserId;  //
      if (isDevMode())
        url =    "https://whiteboard.partners.org/esb/FLwbe/APhysicsCov2025/_dev_/getTriageCoverers.php?debug=1&startDate="+startDate+"&endDate="+endDate + "&loggedInUserId="+loggedInUserId;
       console.log("333 getTriageCoverers url %o", url)
        return this .HttpClient.get<duty>(url)
    }
    getFirstDayOfNextMonth(currentDate: Date): Date {
      const nextMonthDate = new Date(currentDate);
      nextMonthDate.setDate(1);// Set the day to 1 to ensure it's the first of the current month
      nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);  // Increment the month by 1
      return nextMonthDate;
    }

}
