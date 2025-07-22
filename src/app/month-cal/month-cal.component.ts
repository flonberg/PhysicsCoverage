import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MyserviceService } from '../myservice.service';
  import { FormsModule } from '@angular/forms';
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
  dutyNames: any = []
  id: string  = ''
  advance: number = 0;                              // 0 for current month, 1 for next month, -1 for previous month
  numRows:number = 5                                // 5 rows for the month calendar  
  monthShownName: string=''                         // Name of the month shown in the calendar
  forSQLmonthString:string= ''
  theDuties:any
  monthStringForSQL:string = ''
  dayBucket:any[] = []
  numAssignments:number = 0
  gotData: boolean = false
  takers:number[] = []                              // physicists who have duties and can therefore swap
  isCheckedBool: boolean = false
  legendColors: Record<number, string> = {
  10: '#FFE4C4',
  20: '#b3ffec',
  21: 'yellow',
  22: '#ffa366',
  25: '#e6ccff',
  28: '#FFE4C4',
  29: '#b3ffec',
  30: 'yellow',
  31: '#ffa366',
  32: '#e6ccff',
  33: '#99ff99',
  34: '#cccc00'
};
  

  // This component is the entry point for the month calendar, it will show the current month and allow the user to advance to the next or previous month.
  constructor(private route: ActivatedRoute, private myservice: MyserviceService,private http: HttpClient) {
    this.forSQLmonthString =  new Date().toISOString().slice(0,7)     
    this.theMonth = new month2Class(0)
  }
   ngOnInit() {
    this.getDuties()
    this.getDutyNames()
    }
    getColor(idx:number){
      return this.legendColors[idx  ]
    }

  /** Add duties to days.  theMonth.datesWithDuties is 2d array of with top key is one of the dateStrings eg 2025-09-02, for each day in the month shown  */  
  addDutiesToDays(){
 //   this.theMonth.datesWithDuties = []
    let ind = 0
    this.theMonth.weekDayForDuties.forEach((elem=>{         // weekDayForDuties if array of dateString e.g. 2025-06-02 grouped into weeks
      elem.forEach((elem2=>{                                // go through each week of dateStrings
        if (this.dayBucket[elem2] )
          this.theMonth.datesWithDuties[ind++] = this.dayBucket[elem2]  // foreach dateString {dS} put the dutiesArray with key = dS into that bucket
        else {
          let test:number[] = [0,0,0,0,0,]
          if (this.theMonth.monthNum > 6)
            test = [0,0,0,0,0,0,0]
          this.theMonth.datesWithDuties[ind++] = test  // foreach dateString {dS} put the dutiesArray with key = dS into that bucket
        }
       }))
      })) 
    }
  getDutyNames(){
        this.myservice.getFromPhysicsDuty(this.advance).subscribe(res=>{
        this.dutyNames = res  
        var temp: any[] = []
        if  (this.theMonth.monthSQLstring == '2025-07'){
                  console.log("858585 %o == %o", this.dutyNames, this.theMonth.monthSQLstring)
                  temp.push( this.dutyNames[1])
                  temp.push( this.dutyNames[0])
                  temp.push( this.dutyNames[2])
                  temp.push( this.dutyNames[3])
                  temp.push( this.dutyNames[4])
            }
            this.dutyNames = temp
        })
  }  
  getDuties(){
    let dString = new Date().toISOString().slice(0,7)
    this.dayBucket = []
    let today = new Date() 
      let advancedToday = new Date(today.getFullYear(), today.getMonth() +this.advance, 1)
      let monthSQLstring = advancedToday.toISOString().slice(0,7)  
      this.myservice.getForMonth(monthSQLstring).subscribe(res=>{
        this.theDuties = res
        this.numAssignments =this.theDuties.length
        for (let i=0; i < this.theDuties.length; i++){
          if (this.theDuties[i]){
            this.takers[this.theDuties[i].UserKey] = 1          // create 'takers' array to det. if 'take' button should be shown 
            let justDate = this.theDuties[i]['day']['date'].slice(0,10)
            if (!this.dayBucket[justDate])                      // this is where dayBucket is created
              this.dayBucket[justDate] = []
            this.dayBucket[justDate].push(this.theDuties[i]) 
          }
        }  
        this.addDutiesToDays()
        this.gotData = true
    })
  }
  /** is loggedInUser a physicist who has duties */
  isUserTaker(){
    const test = this.myservice.getLoggedInUserKey()
    if (test in this.takers)
      return true
    else 
      return false
  }
   advanceMonth(number: number) {
    this.advance += number
    this.theMonth = new month2Class(this.advance)
    this.myservice.getFromPhysicsDuty(this.advance).subscribe(res=>{
       this.dutyNames = res
       console.log("125125 %o", this.dutyNames)
    })
    this.getDuties()
   // this.makeMonth(this.advance); // Call the makeMonth function with the number passed in
    this.addDutiesToDays()
    this.myservice.getFromPhysicsDuty(this.advance)
  }

    /** Make dS with a instande of dateWithData class for each day of the month. 
     * Include dates from last month in first week if needed and dates for next month in last week if needed.
     */
  makeMonth(advance:number){
      this.advance = advance; 
      let today = new Date() 
      let advancedToday = new Date(today.getFullYear(), today.getMonth() + advance, 1)
      let monthSQLstring = advancedToday.toISOString().slice(0,7)   
                                            // Set the advance value to the number passed in
      this.myservice.getForMonth(monthSQLstring).subscribe(res=>{
        this.theDuties = res
        this.theMonth = new month2Class(this.advance)      
      })
    }
  hasAssignments(assign: any){
   // if (assign == 0)
  //    return false
  //  else
     {
      if (this.isUserTaker())
        return true
      else
        return false
    }
  }  
 isAssigned(duty:any){
  if (duty && duty.userkey > 0)
    return true
  else 
    return false
 } 
 getColorFromServiceid(duty: any){
  if (duty)
    return (this.legendColors[duty.serviceid])
  else
    return 'green'
 }
 getLastName(duty:any){
  if (duty ){
    if (duty.UserKey > 0)
      return duty.LastName
  else 
    return ''
  }
 }
 takeDuty(assign: any, xnum:number, ynum: number){
  let message: string = ""
  for (let i=0; i < this.dutyNames.length; i++){
    if (this.dutyNames[i]){
    console.log("143143 %o -- %o", this.dutyNames[i].Idx, assign.serviceid)
    if (this.dutyNames[i].Idx ==assign.serviceid){
      let dateString = assign.day.date.slice(0,10)
      message = "You are assuming "+ this.dutyNames[i]['name'] + " on " + dateString
        }
      }
    }
    const userConfirmed = window.confirm(message);
    if (userConfirmed){
      this.theMonth.datesWithDuties[xnum][ynum].LastName = this.myservice.getUserLastName()
      this.gotData = false
      this.myservice.takeAssignment(assign.idx).subscribe(res=>{
        let rest = res
        } ) 
      }
    this.isCheckedBool = false
  }
  doesLoggedInUserHaveThis(duty: any){
    const test = this.myservice.getLoggedInUserKey()
    let takerUserKey = 0
    if (duty)
      takerUserKey = duty.UserKey
    if (duty && duty.phys2)
      takerUserKey = duty.phys2
    if (takerUserKey == this.myservice.getLoggedInUserKey())
      return 'takee'
    else
      return 'normal'
  }
  isChecked(){
    return false
  }
   confirmAction(): void {
        const userConfirmed = window.confirm('Are you sure you want to proceed?');

        if (userConfirmed) {
          // User clicked "OK"
          console.log('Action confirmed!');
          // Perform the desired action here
        } else {
          // User clicked "Cancel"
          console.log('Action cancelled.');
          // Handle cancellation or do nothing
        }
      }
  isToday(monthNum: number, monthItem:any){
    const test = monthItem
    const todayDate = new Date()
    const todayDay = todayDate.getDate()
    const todayMonthNum  = todayDate.getMonth()
     
    if (monthItem == todayDay && monthNum == todayMonthNum)
      return 'today'
    else
      return 'notToday'
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

  


