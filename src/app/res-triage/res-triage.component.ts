import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MatSelectModule, MatSelect } from '@angular/material/select';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MyserviceService } from '../myservice.service';

@Component({
  selector: 'app-res-triage',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatDatepickerModule],
  templateUrl: './res-triage.component.html',
  styleUrls: ['./res-triage.component.css'],
})
export class ResTriageComponent {
theMonth: month2Class = new month2Class(0);
  advance: number = 0;                                   // how many months to advance from current month
  TCs: triageCoverer[] = []
  gotTCs: boolean = false
  constructor(private myService: MyserviceService ) {
    this.loadTriageCoverers()
   }
  advanceMonth(number: number) {                                                           // used when user clicks on next or previous month button
    this.advance += number
    console.log("advance to month %o", this.advance)
    this.theMonth = new month2Class(this.advance)
  }
  loadTriageCoverers(){
    this.myService.getTriageCoverers().subscribe((data: any) => {

      this.TCs = data.TCs
            console.log("444 loadTriageCoverers data %o", this.TCs)
      this.gotTCs = true
    })
  }
}
class triageCoverer {
  userkey: number = 0
  LastName: string = ''
  FirstName: string = ''
  Email: string = ''
}

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
  datesWithDuties:any[]=[]
  constructor(advance: number){
     const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 
      'November', 'December' ];

    this.focusDate = new Date(this.focusDate.getFullYear(), this.focusDate.getMonth() + advance, 1)  // first day of month
    this.monthSQLstring = this.focusDate.toISOString().slice(0,7)      // for use in SQL query e.g  LIKE '2-25-06%'
    this.monthNum = this.focusDate.getMonth()
    this.monthName = monthNames[this.monthNum]
    this.focusDate = this.moveToMonday(this.focusDate)                
    for (let i=0; i < 5; i++)                                  // make the 5 days of normal weeks                   
            this.weeks[i] = this.makeNormalWeek(this.focusDate)  
   // console.log("105105 weekDayForDuties %o", this.weekDayForDuties)    
  //  console.log("`37`37`weekDays %o", this.weekDays)        
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
        this.weekDays[this.weekNum][i] = dates[i].getDate()     // gets Day of Month
        if (i == 0){
          this.weekDayForDuties[this.weekNum] = []
          this.weekDayForDuties[this.weekNum][i] = []
        }
        this.weekDayForDuties[this.weekNum][i] = new Date(dates[i]).toISOString().slice(0,10)      // gets Day of Month  
        fDate.setDate(fDate.getDate()+1)
        }

        this.focusDate = new Date(this.focusDate.getFullYear(), this.focusDate.getMonth(), this.focusDate.getDate() + 2 ) // move FocusDate tp Monday
        this.     weekNum++

        return dates
    }
    getMonthSQLstring(){
      return this.monthSQLstring
    }
  doesDateHaveDuties(date: any){
    if (date.userkey)
      return true
    else 
      return
  }  

}
