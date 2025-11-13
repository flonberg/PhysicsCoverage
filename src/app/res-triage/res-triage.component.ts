import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MatSelectModule, MatSelect } from '@angular/material/select';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MyserviceService } from '../myservice.service';
import { FormsModule } from '@angular/forms';


interface TriageCoverer2 {
  value: number;
  viewValue: string;
}
interface CovByUserKey {
   [key: number]: string;
}

@Component({
  selector: 'app-res-triage',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatDatepickerModule, FormsModule],
  templateUrl: './res-triage.component.html',
  styleUrls: ['./res-triage.component.css'],
})
export class ResTriageComponent {
  loggedInUserLastName: string = ""
  loggedInUserKey: number = 0
  loggeInUserId: string = ""
  advance: number = 0;                                                          // how many months advanced from current month      
  theMonth: month2Class;
  TCs2: TriageCoverer2[] = []
  CbUK:CovByUserKey[] =[]                                                      // to hold coverers by userkey for display
  loggedInUserTC: TriageCoverer2[] = []                                             // the logged in user as coverer
  isUserTaker: boolean = false
  gotTCs: boolean = false
  covsFromTable: number[][] = []                                              // to hold userkeys from dataBase for each date in month for display
  fromTable: any[] = []                                                       // to hold  raw data duties from dataBase
  isPrivUser: boolean = false
  constructor(private myService: MyserviceService ) {
    this.theMonth = new month2Class(this.advance);
    this.loggeInUserId = this.myService.getUserId()
    this.loggedInUserLastName = this.myService.getUserLastName()
    this.loggedInUserKey = this.myService.getLoggedInUserKey()

    console.log("313131In ResTriageComponent  %o -- %o -- %o", this.loggeInUserId, this.loggedInUserLastName, this.loggedInUserKey)
    let loggedInUserTC: TriageCoverer2 = {value: this. loggedInUserKey, viewValue: this.loggedInUserLastName}
    this.myService.getFromAssets().subscribe((data: any) => {
      const privUsers: any = data.privUsers.privUser
      for (let i=0; i < privUsers.length; i++){
        if (privUsers[i].userid == this.loggeInUserId){                    // if logged in user is privileged user 
          this.isPrivUser = true                              // use all coverers    
          break
        }
      }
      this.loadTriageCoverers()
    })
  }
 
  advanceMonth(number: number) {                                            // used when user clicks on next or previous month button
    this.advance += number
    this.theMonth = new month2Class(this.advance)
        this.loadTriageCoverers()
  }

  loadTriageCoverers(){
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().slice(0,10);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().slice(0,10);
    this.myService.getTriageCoverers(firstDay, lastDay, this.myService.getUserId()).subscribe((data: any) => {
      const tCoverers: any = data.TCs
      console.log("656565 tCoverers %o", tCoverers)
      const assignedCoverers: any = data.Duties
      this.fromTable = data.Duties
      console.log("75757 %o fromTable %o", this.fromTable.length, this.fromTable)
      for (let i=0; i < tCoverers.length; i++){
        let tc2 : TriageCoverer2 = {value: tCoverers[i].UserKey, viewValue: tCoverers[i].FirstName + ' ' + tCoverers[i].LastName}
        this.TCs2.push(tc2)
        this.CbUK[tCoverers[i].UserKey] = tCoverers[i].FirstName + ' ' + tCoverers[i].LastName
      }

      this.putCovererInEachDate()
      this.isUserTaker = this.isLoggedInUserTaker(this.loggedInUserKey)

    })
  }
    /* Puts coverer in corresponding date in calendar */
  putCovererInEachDate(){
    for (let i=0; i < this.theMonth.weekDayForDuties.length; i++){          // for each week
      this.covsFromTable[i] = []                                            // initialize row in covsFromTable
      for (let j=0; j < this.theMonth.weekDayForDuties[i].length; j++){ 
           this.covsFromTable[i][j] = 0                                     // initialize col in covsFromTable
        for (let k=0; k < this.fromTable.length; k++){                      // for each duty from table
          if (this.fromTable[k]['day']['date'].includes(this.theMonth.weekDayForDuties[i][j])){ // if match the date of the day with date of the duty1
            this.covsFromTable[i][j] = this.fromTable[k].userkey            // put userkey in covsFromTable
            break
          }
          else {
            this.covsFromTable[i][j] = 0                                   // no coverer assigned         
          }
        }
      }
    }
     this.gotTCs = true
  } 
  takeCoverage(event: any, day: any, ind?:any, did?:any) {
    let toTakeUserKey: number = 0
    if (typeof event === 'number'){                                       // when coming from button click
      toTakeUserKey = this.loggedInUserKey
    }
    else if (typeof event === 'object' && 'value' in event){             // when coming from select change
      toTakeUserKey = event.value
    }
    const formattedDate = new Date(day).toISOString().split('T')[0]
    let dateString = formattedDate.slice(0,10)
    let message = "You are assuming coverage on " + dateString
        const userConfirmed = window.confirm(message);
    if (userConfirmed){   
    this.myService.enterTriageCov(toTakeUserKey, formattedDate).subscribe((data: any) => {
    })
    if (this.covsFromTable[ind])    
      this.covsFromTable[ind][did] = toTakeUserKey                        // update the table display immediately
  }
}
  enterCov(event: any, day: any, ind?:any, did?:any) {
    let toEnterUserKey: number = 0
    if (typeof event === 'number'){                                       // when coming from button click
      toEnterUserKey = this.loggedInUserKey
    }
    else if (typeof event === 'object' && 'value' in event){             // when coming from select change
      toEnterUserKey = event.value
    }
    const formattedDate = new Date(day).toISOString().split('T')[0]
    this.myService.enterTriageCov(toEnterUserKey, formattedDate).subscribe((data: any) => {
    })
    if (this.covsFromTable[ind])
      this.covsFromTable[ind][did] = toEnterUserKey                        // update the table display immediately
  }
  isLoggedInUserTaker(covUserKey: number){
    if (this.loggedInUserKey in  this.CbUK  && this.loggedInUserKey > 0)
      return true
    else
      return false
  }
}

/** Holds the */
class month2Class {
  dayNum: number = 0                                                    // used to index the days for loading of, and getting duties
  focusDate: Date = new Date()                            
  weeks:any = []
  weekDays: number[][] = []
  weekNum: number = 0
  monthName: string = ''
  monthNum: number = 0
  monthSQLstring: string = ''
  weekDayForDuties: any[][] = []
  datesWithCoverers: DateWithCoverer[] = []
  constructor(advance: number){
     const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 
      'November', 'December' ];

    this.focusDate = new Date(this.focusDate.getFullYear(), this.focusDate.getMonth() + advance, 1)  // first day of month
    this.monthSQLstring = this.focusDate.toISOString().slice(0,7)                                   // for use in SQL query e.g  LIKE '2-25-06%'
    this.monthNum = this.focusDate.getMonth()
    this.monthName = monthNames[this.monthNum]
    this.focusDate = this.moveToMonday(this.focusDate)                
    for (let i=0; i < 5; i++)                                                                       // make the 5 days of normal weeks                   
            this.weeks[i] = this.makeNormalWeek(this.focusDate)       
  }

  /** move forward to Monday is Weekend of BACK to Monday is Tues-Fri */
  moveToMonday(focusDate:Date){
      let test = focusDate.getDay()
      if (test == 0) 
          focusDate.setDate(focusDate.getDate()+1)
      if (test == 6) 
          focusDate.setDate(focusDate.getDate()+2)
      if (test >  0 && test < 6) 
          focusDate.setDate(focusDate.getDate() - (test - 1 ))  
    return focusDate
  }
  makeNormalWeek(fDate: Date){
      let dates:Date[] = []
      this.weekDays[this.weekNum] = []  
      for (let i= 0; i < 5; i++){
        dates[i] = new Date(fDate)
        this.datesWithCoverers[this.dayNum] = new DateWithCoverer(dates[i])
        this.dayNum++
        this.weekDays[this.weekNum][i] = dates[i].getDate()     // gets Day of Month
        if (i == 0){
          this.weekDayForDuties[this.weekNum] = []
          this.weekDayForDuties[this.weekNum][i] = []
        }
        this.weekDayForDuties[this.weekNum][i] = new Date(dates[i]).toISOString().slice(0,10)      // gets Day of Month  
        fDate.setDate(fDate.getDate()+1)
        }

        this.focusDate = new Date(this.focusDate.getFullYear(), this.focusDate.getMonth(), this.focusDate.getDate() + 2 ) // move FocusDate tp Monday
        this.weekNum++
        return dates
    }
    getMonthSQLstring(){
      return this.monthSQLstring
    }


}
class DateWithCoverer {
  theDate: Date = new Date()
  userkey: number = 0
  LastName: string = 'Unassigned'
  constructor(theDate: Date){
    this.theDate = theDate    
  }
}
