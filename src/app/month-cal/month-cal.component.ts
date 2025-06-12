import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MyserviceService } from '../myservice.service';
import { CommonModule } from '@angular/common'; 
import { NgModule } from '@angular/core';
import { MonthCalModule } from './month-cal.module';


@Component({
  selector: 'app-month-cal',
  standalone: false,
  templateUrl: './month-cal.component.html',
  styleUrl: './month-cal.component.css',
   host: { ngSkipHydration: 'true' },
})
export class MonthCalComponent {
  theMonth:month2Class
  numsWeeks: number[] = [0,1,2]; // 5 rows for the month calendar
  numForDays: number[] = [0,1,2,3,4]
  duties: number[] = [0,1,2,3,4,5,6]; // 7 days of the week
  id: string  = ''
  advance: number = 0;                              // 0 for current month, 1 for next month, -1 for previous month
  numRows:number = 5                                // 5 rows for the month calendar  
  monthShownName: string=''                         // Name of the month shown in the calendar

  // This component is the entry point for the month calendar, it will show the current month and allow the user to advance to the next or previous month.
  constructor(private route: ActivatedRoute, private myservice: MyserviceService) {
    this.theMonth = new month2Class(0)
    console.log("31313 theMonth %o", this.theMonth)
  }
   ngOnInit() {
       this.route.params.subscribe(params => {
        this.id = params['id'];
        this.myservice.setUserId(this.id);          // This is the Entry component so Store the ID in the service for use by other components. 
       })
     // this.makeMonth(0)
    }
    /** Make dS with a instande of dateWithData class for each day of the month. 
     * Include dates from last month in first week if needed and dates for next month in last week if needed.
     */
    makeMonth(advancd:number){
      this.advance = advancd;  
      this.theMonth = new month2Class(this.advance)                                                 // Set the advance value to the number passed in
      }

  advanceMonth(number: number) {
    this.advance += number
    this.makeMonth(this.advance); // Call the makeMonth function with the number passed in
  }


}



class month2Class {
  focusDate: Date = new Date()
  weeks:any = []
  weekDays: number[][] = []
  weekNum: number = 0
  monthName: string = ''
  constructor(advance: number){
     const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 
      'November', 'December' ];
    let focusDate = new Date()                              // today
    this.focusDate = new Date(this.focusDate.getFullYear(), this.focusDate.getMonth() + advance, 1)  // first day of month
    this.monthName = monthNames[this.focusDate.getMonth()]
    this.focusDate = this.moveToMonday(this.focusDate)                
      console.log("232232 %o", this.focusDate)    
    for (let i=0; i < 5; i++)                                  // make the 5 days of normal weeks                   
            this.weeks[i] = this.makeNormalWeek(this.focusDate)  
    for (let i = 0; i < this.weeks.length; i++){
      let theDate = new Date(this.weeks[i]) 
      let tst = +theDate.getDate()
    }
    console.log("220220 weeks %o", this.weeks)        
    console.log("`37`37`weekDays %o", this.weekDays)        

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
        this.weekDays[this.weekNum][i] = dates[i].getDate()
        fDate.setDate(fDate.getDate()+1)
        }
        this.focusDate = new Date(this.focusDate.getFullYear(), this.focusDate.getMonth(), this.focusDate.getDate() + 2 ) // move FocusDate tp Monday
        this.weekNum++
        return dates
    }
  getWeeks(){
    console.log("156156 weeks %o", this.weeks)
    return this.weeks
  }  
      
  


}
  


