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
@Component({
  selector: 'app-res-triage',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatDatepickerModule, FormsModule],
  templateUrl: './res-triage.component.html',
  styleUrls: ['./res-triage.component.css'],
})
export class ResTriageComponent {
  advance: number = 0;                                                          // how many months advanced from current month      
  theMonth: month2Class;
  TCs2: TriageCoverer2[] = []
  usedTCs2: TriageCoverer2[] = []                                             // the list of coverers used for DropDown
  gotTCs: boolean = false
  covsFromTable: number[][] = []                                              // to hold userkeys from dataBase for each date in month for display
  fromTable: any[] = []                                                       // to hold  raw data duties from dataBase
  isPrivUser: boolean = false
  constructor(private myService: MyserviceService ) {
    this.theMonth = new month2Class(this.advance);

    let loggeInUserId = this.myService.getUserId()
    this.myService.getFromAssets().subscribe((data: any) => {
      const privUsers: any = data.privUsers.privUser
      for (let i=0; i < privUsers.length; i++){
        if (privUsers[i].userid == loggeInUserId){                    // if logged in user is privileged user 
          this.isPrivUser = true                              // use all coverers    
          break
        }
      }
      this.loadTriageCoverers()
    })
    console.log("313131In ResTriageComponent constructor logged in user id %o", loggeInUserId)
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
      const assignedCoverers: any = data.Duties
      this.fromTable = data.Duties
      for (let i=0; i < tCoverers.length; i++){
        let tc2 : TriageCoverer2 = {value: tCoverers[i].UserKey, viewValue: tCoverers[i].FirstName + ' ' + tCoverers[i].LastName}
        this.TCs2.push(tc2)
      }
      this.gotTCs = true
      this.putCovererInEachDate()
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
  } 

  onChange(event: any, day: any) {
    const formattedDate = new Date(day).toISOString().split('T')[0]
    console.log("onchange event %o for day %o", event.value, formattedDate )
    this.myService.enterTiageCov(event.value, formattedDate).subscribe((data: any) => {
      console.log("Response from enterTriageCov %o", data)
    })
  }
}

/** Holds the */
class month2Class {
  dayNum: number = 0                                    // used to index the days for loading of, and getting dutile
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
