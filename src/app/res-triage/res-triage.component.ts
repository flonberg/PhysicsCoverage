import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MatSelectModule, MatSelect } from '@angular/material/select';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MyserviceService } from '../myservice.service';
import { FormsModule } from '@angular/forms';

interface Food {
  value: string;
  viewValue: string;
}
interface TriageCoverer {
  userkey: number;
  LastName: string;
  FirstName:  string;
  Email: string;
}
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
  selectedValue: number[] = [735,980,980,1038,735]; // Set the desired default or initial value
  //selectedValue: string[] = ['option2','option1', 'option3','option4','option5']; // Set the desired default or initial value
  options = [
    { value: 'option1', viewValue: 'VOption 1' },
    { value: 'option2', viewValue: 'VOption 2' },
    { value: 'option3', viewValue: 'Option 3' },
    { value: 'option4', viewValue: 'Option 4' },
    { value: 'option5', viewValue: 'Option 5' }
  ];
 index = [0,1,2,3,4]


theMonth: month2Class = new month2Class(0);

  advance: number = 0;                                   // how many months to advance from current month
  TCs: TriageCoverer[] = []
  TCs2: TriageCoverer2[] = []
  gotTCs: boolean = false

  selectedValues: { userkey: number, LastName: string, FirstName: string } = {userkey: 1, LastName: 'Abid', FirstName: 'Abid'};
  selectedTCs2: TriageCoverer2[] = []

  coverersFromInterface: TriageCoverer[] = []

 

  constructor(private myService: MyserviceService ) {
    this.loadTriageCoverers()

   }
  advanceMonth(number: number) {                                                           // used when user clicks on next or previous month button
    this.advance += number
    console.log("advance to month %o", this.advance)
    this.theMonth = new month2Class(this.advance)
    console.log("theMonth initialized %o", this.theMonth) 
  }
  loadTriageCoverers(){
    this.myService.getTriageCoverers().subscribe((data: any) => {
      const tCoverers: any = data.TCs
      const assignedCoverers: any = data.Duties
      console.log("44444 tCoverers %o assignedDuties --- %o", tCoverers, assignedCoverers)
      for (let i=0; i < tCoverers.length; i++){
        let tc: TriageCoverer = {userkey: tCoverers[i].UserKey, LastName: tCoverers[i].LastName, FirstName: tCoverers[i].FirstName, Email: tCoverers[i].Email }
        let tc2 : TriageCoverer2 = {value: tCoverers[i].UserKey, viewValue: tCoverers[i].LastName }
        this.TCs2.push(tc2)
        this.TCs.push(tc)
      }
      console.log("44444 TCs %o", this.TCs)
      this.gotTCs = true
    })
  }
      compareFn(obj1: any, obj2: any): boolean {
        return obj1 && obj2 ? obj1.id === obj2.id : obj1 === obj2;
    }
  onChange(event: any, day: any) {
    const formattedDate = new Date(day).toISOString().split('T')[0]
    console.log("onchange event %o for day %o", event.value, formattedDate )
    console.log("SelectedValue %o", this.selectedValue)
   
    this.myService.enterTiageCov(event.value, formattedDate).subscribe((data: any) => {
      console.log("Response from enterTriageCov %o", data)
    })
  }
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
  doesDateHaveDuties(date: any){
    if (date.userkey)
      return true
    else 
      return
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
