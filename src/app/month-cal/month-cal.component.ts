import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MyserviceService } from '../myservice.service';
import { CommonModule } from '@angular/common'; 
import { NgModule } from '@angular/core';
import { MonthCalModule } from './month-cal.module';
import { duty } from '../models'

  import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-month-cal',
  standalone: false,
  templateUrl: './month-cal.component.html',
  styleUrl: './month-cal.component.css',
   host: { ngSkipHydration: 'true' },
})
export class MonthCalComponent {
  theMonth:month2Class
  duties: number[] = [0,1,2,3,4,5,6]; // 7 days of the week
  id: string  = ''
  advance: number = 0;                              // 0 for current month, 1 for next month, -1 for previous month
  numRows:number = 5                                // 5 rows for the month calendar  
  monthShownName: string=''                         // Name of the month shown in the calendar
  theDuties:any
  monthStringForSQL:string = ''
  dayBucket:any[] = []
  

  // This component is the entry point for the month calendar, it will show the current month and allow the user to advance to the next or previous month.
  constructor(private route: ActivatedRoute, private myservice: MyserviceService,private http: HttpClient) {
        this.route.params.subscribe(params => {
        this.id = params['id'];
        this.myservice.setUserId(this.id);          // This is the Entry component so Store the ID in the service for use by other components. 
       })
    this.theMonth = new month2Class(0)
    console.log("31313 theMonth %o", this.theMonth)
  }
   ngOnInit() {
      this.getDuties()
    }
  
  getDuties(){
    let dString = new Date().toISOString().slice(0,7)
    this.myservice.getForMonth(dString).subscribe(res=>{
        this.theDuties = res
        for (let i=0; i < this.theDuties.length; i++){
          if (this.theDuties[i]){
            let justDate = this.theDuties[i]['day']['date'].slice(0,10)
            if (!this.dayBucket[justDate])
              this.dayBucket[justDate] = []
            this.dayBucket[justDate].push(this.theDuties[i]) 
          }
        }  
        console.log("505050 %o", this.dayBucket)
        this.theMonth.addDutiesToDays(this.dayBucket)
    })
  }
 
    /** Make dS with a instande of dateWithData class for each day of the month. 
     * Include dates from last month in first week if needed and dates for next month in last week if needed.
     */
  makeMonth(advancd:number){
      this.advance = advancd;  
                                            // Set the advance value to the number passed in
      this.myservice.getForMonth(this.theMonth.getMonthSQLstring()).subscribe(res=>{
 
        this.theDuties = res
        this.theMonth = new month2Class(this.advance)      
        console.log(this.theDuties)
      })
    }
  advanceMonth(number: number) {
    this.advance += number
    this.makeMonth(this.advance); // Call the makeMonth function with the number passed in
  }
}
class Duties{


}
class month2Class {
  dayNum: number = 0                                    // used to index the days for loading of, and getting dutile
  focusDate: Date = new Date()                            
  weeks:any = []
  weekDays: number[][] = []
  weekNum: number = 0
  monthName: string = ''
  monthSQLstring: string = ''
  weekDayWithDuties: any[][] = []
  datesWithDuties:any[]=[]
  constructor(advance: number){
     const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 
      'November', 'December' ];

    this.focusDate = new Date(this.focusDate.getFullYear(), this.focusDate.getMonth() + advance, 1)  // first day of month
    this.monthSQLstring = this.focusDate.toISOString().slice(0,7)      // for use in SQL query e.g  LIKE '2-25-06%'
    this.monthName = monthNames[this.focusDate.getMonth()]
    this.focusDate = this.moveToMonday(this.focusDate)                
    for (let i=0; i < 5; i++)                                  // make the 5 days of normal weeks                   
            this.weeks[i] = this.makeNormalWeek(this.focusDate)  

    console.log("220220 weeks %o", this.weeks)    
    console.log("105105 weekDayWithDuties %o", this.weekDayWithDuties)    
    console.log("`37`37`weekDays %o", this.weekDays)        
  }
  addDutiesToDays(dutiesInDayBuckets: any){
    this.weekDayWithDuties.forEach((elem:any)=>{
  //    let justDate = elem.toISOString().slice(0,10)
   //   console.log("113113 %o", justDate )

    })
    
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
 //   console.log("123123 %o", duties)
      let dates:Date[] = []
      this.weekDays[this.weekNum] = []
      for (let i= 0; i < 5; i++){
        dates[i] = new Date(fDate)
     //   this.weekDayWithDuties[i] = new Date(fDate)
        let tst = new Date(dates[i]).toISOString().slice(0,10) 
   //     this.datesWithDuties[i] = new dateWithDuties(tst, duties[tst])
        this.weekDays[this.weekNum][i] = dates[i].getDate()     // gets Day of Month
        if (i == 0){
          this.weekDayWithDuties[this.weekNum] = []
          this.weekDayWithDuties[this.weekNum][i] = []
        }
        this.weekDayWithDuties[this.weekNum][i] = new Date(dates[i]).toISOString().slice(0,10)      // gets Day of Month
      //  if (!this.weekDayWithDuties[i])
      //    this.weekDayWithDuties[tst] = duties[tst]     ///////////////
     //     this.datesWithDuties[i] = new dateWithDuties(tst, duties[tst])

     //   this.weekDayWithDuties[i][dates[i].getDate()] = dayBucket[dates[i].getDate()]
      
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
class dateWithDuties{
 dateString: string = ''
 duties:  any[] = []
  constructor(date:string, duties: any){
    this.dateString = new Date(date).toISOString().slice(8,10)
    this.duties = duties
  }
}
  


