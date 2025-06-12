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
 
  numsWeeks: number[] = [0,1,2]; // 5 rows for the month calendar
  numForDays: number[] = [0,1,2,3,4]
  duties: number[] = [0,1,2,3,4,5,6]; // 7 days of the week
  id: string  = ''
  advance: number = 0;                              // 0 for current month, 1 for next month, -1 for previous month
  numRows:number = 5                                // 5 rows for the month calendar  
  monthShownName: string=''                         // Name of the month shown in the calendar
  dateOfFirstWeekDay: Date = new Date();            // First weekday of the month, adjusted to Monday if it falls on Sunday or Saturday
  weekOfDates:dateWithData[]=[];                    // Array to hold the dates of each week ofthe month, each date will be an object with data
  firstWeekOfDates:any           // Array to hold the dates of the first week of the month, each date will be an object with data
  // This component is the entry point for the month calendar, it will show the current month and allow the user to advance to the next or previous month.
  constructor(private route: ActivatedRoute, private myservice: MyserviceService) {}
   ngOnInit() {
       this.route.params.subscribe(params => {
        this.id = params['id'];
        this.myservice.setUserId(this.id);          // This is the Entry component so Store the ID in the service for use by other components. 
       })
      this.makeMonth(0)
    }
    /** Make dS with a instande of dateWithData class for each day of the month. 
     * Include dates from last month in first week if needed and dates for next month in last week if needed.
     */
    makeMonth(advancd:number){
      this.advance = advancd;  
      new month2Class(this.advance)                                                 // Set the advance value to the number passed in
    let shownMonth: monthClass = new monthClass(this.advance); // Create a new monthClass instance with the advance value
      console.log("434343 Month Class: ", shownMonth);
      this.monthShownName = this.getMonthName(this.advance);                    // Update the month name shown
      this.dateOfFirstWeekDay = this.firstWeekdayOfMonth(this.advance);         // Get the first weekday of the month
      let dayOfWeekOfFirstWeekday: number = this.dateOfFirstWeekDay.getDay();   // Get the day of the week (0-6, where 0 is Sunday)
      let datesFromLastMonth = this.makeDatesFromLastMonth(dayOfWeekOfFirstWeekday, this.dateOfFirstWeekDay); // Get the dates from the last month
      console.log("Dates from the last month: ", datesFromLastMonth);
      if (datesFromLastMonth.length > 0)
        this.firstWeekOfDates =this.makeFirstWeekOfDates(datesFromLastMonth[0]);              // Call the makeWeekOfDates function with the first date of the last month
      else
        this.firstWeekOfDates =this.makeFirstWeekOfDates(this.dateOfFirstWeekDay); // If there are no dates from the last month, use the first weekday of the month
      console.log("494949 Week of Dates: ", this.weekOfDates);   
      }
  /** Make an array of dateWithData objects for each day of the week, starting from the first date passed in */
  makeFirstWeekOfDates(firstDate:Date) {                                      // firstDate is first MONDAY of the month
      let weekOfDates: dateWithData[] = [];                                   // Array to hold the dates of the week
      for (let i = 0; i < 5; i++) { 
        weekOfDates.push(new dateWithData(new Date(firstDate)));              // Push a new date object to the array
        firstDate.setDate(firstDate.getDate() + 1);                           // Increment the date by 1
      }
      return weekOfDates; // Return the array of dates
  }
  makeLastWeekOfDates(firstDate:Date) {
      let weekOfDates: dateWithData[] = [];                                   // Array to hold the dates of the week
  }
  makeMiddleWeeksOfDates(firstDate:Date) {
    let weekOfDates: dateWithData[] = []; // Array to hold the dates of the week
  }
  getMonthName(month: number): string {
    const currentDate: Date = new Date();
    const currentMonth: number = currentDate.getMonth();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
     ];
    return  monthNames[currentMonth + month]; // Adjust the month index by the advance value
  }
  advanceMonth(number: number) {
    this.advance += number
    this.makeMonth(this.advance); // Call the makeMonth function with the number passed in
  }
  firstWeekdayOfMonth(number:number): Date {
    const currentDate: Date = new Date();
    currentDate.setMonth(currentDate.getMonth() + this.advance);  // Adjust the month by the advance value
    currentDate.setDate(1);                                       // Set to the first day of the month
    if (currentDate.getDay() == 0)                                // If the first day is Sunday, we need to adjust it to Monday         
        currentDate.setDate(currentDate.getDate() + 1);
    if (currentDate.getDay() == 6)                                // If the first day is Sunday, we need to adjust it to Monday         
        currentDate.setDate(currentDate.getDate() + 2);
    return currentDate;                                  // Get the day of the week (0-6, where 0 is Sunday)
  }
  /** If first day of month is Tues - Fri, need to fill in with last dates of last month */
  makeDatesFromLastMonth(dayNum:number, firstWeekday: Date) {
    const datesArray: Date[] = [];
    for (let i = 0; i < dayNum; i++) {
       firstWeekday.setDate(firstWeekday.getDate() - 1);
       if (firstWeekday.getDay() !== 0 && firstWeekday.getDay() !== 6)  // If the date goes below 1, we need to go to the previous month
          datesArray.push(new Date(firstWeekday));                 // Push a new date object to the array
      }
    return datesArray.reverse();                                 // Reverse the array to get the dates in the correct order
  }
  getNumForBox(number: number): number {
    return number
  }
  getLastMondayOfMonth(d:Date): Date {
    let d1 = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    let wd = d1.getDay();
    d1.setDate(d1.getDate() - (wd < 1 ? 6 : wd - 1));
    return d1;
  }

}
class dateWithData {
  date: Date; // The date of the week
  data: any; // Data associated with the date, can be any type
  constructor(date: Date) {
    this.date = date;
  }
  getDay(): number {
    return this.date.getDate(); // Get the day of the month
  }
}
interface monthWeekDates {
  dates:Date[]
}
class monthClass { 
  focusDate:Date = new Date()                                       // this is the 'Pointer' dated which advances as the Date objects are created. 
  firstDateInMonth: Date 
  lastDateInMonth: Date
  firstWeekDayInMonth: Date 
  lastWeekDayInMonth: Date
  monthName: string 
  monthWeekDates:Date[] =[]
  monthWeeks:any[] = []
  
  constructor(advance: number) {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        let nextMonth = currentMonth + advance;
        let nextYear = currentDate.getFullYear();
        if (nextMonth > 11) {
          nextMonth = 0;
          nextYear++;
        }
        this.firstDateInMonth = new Date(nextYear, nextMonth, 1);
        this.firstWeekDayInMonth = this.makeFirstMondayOfMonth()
        this.lastDateInMonth =  new Date(this.firstDateInMonth.getFullYear(), this.firstDateInMonth.getMonth()+ 1, 0);
        this.lastWeekDayInMonth = this.makeLastWeekDayOfMonth()
        this.monthName = monthNames[this.firstDateInMonth.getMonth()]; // Set the month name based on the date object
   
        this.focusDate = new Date(this.firstWeekDayInMonth)
        let tst = +this.firstWeekDayInMonth.getDay() 
        let evalNum = 0
        let tst2 = 2
        if (tst2 === 0) {                                         // firstDayOfMonthe is Sunday
              this.focusDate.setDate(this.focusDate.getDate() + 1); // Move it to Monday
        }
        else if (tst == 6)                                          // firstDayOfMonth is Sunday
              this.focusDate.setDate(this.focusDate.getDate() + 2); // Move it to Monday
        else if (tst > 1 && tst < 6)   
              this.focusDate.setDate(this.focusDate.getDate() - tst ); // Move it to Monday
        for (let i=0; i < 5; i++)                                   // make the 5 days of normal weeks                   
            this.monthWeeks[i] = this.makeNormalWeek()
        
        console.log("159159 monthWeeds %o", this.monthWeeks)
      }
    makeFirstMondayOfMonth(){
      let currentDate = new Date(this.firstDateInMonth)             // clone the date
      if (currentDate.getDay() == 0)                                // If the first day is Sunday, we need to adjust it to Monday         
        currentDate.setDate(currentDate.getDate() + 1);
      if (currentDate.getDay() == 6)                                // If the first day is Sunday, we need to adjust it to Monday         
          currentDate.setDate(currentDate.getDate() + 2);
      return currentDate    
      }  
    makeLastWeekDayOfMonth(){
      let currentDate = new Date(this. lastDateInMonth)
      if (currentDate.getDay() == 0)                                // If the first day is Sunday, we need to adjust it to Monday         
        currentDate.setDate(currentDate.getDate() - 2);
      if (currentDate.getDay() == 6)                                // If the first day is Sunday, we need to adjust it to Monday         
          currentDate.setDate(currentDate.getDate() - 1);
      return currentDate   
    }  
       /** If first day of month is Tues - Fri, need to fill in with last dates of last month */
    makeDatesFromLastMonth(dayNum:number, firstWeekday: Date) {
      const datesArray: Date[] = [];
      for (let i = 0; i < dayNum; i++) {
        firstWeekday.setDate(firstWeekday.getDate() - 1);
        if (firstWeekday.getDay() !== 0 && firstWeekday.getDay() !== 6)  // If the date goes below 1, we need to go to the previous month
            datesArray.push(new Date(firstWeekday));                 // Push a new date object to the array
        }
      return datesArray.reverse();                                 // Reverse the array to get the dates in the correct order
    }
    makeNormalWeek(){
      let dates:Date[] = []
      for (let i= 1; i <= 5; i++){
        dates[i] = new Date(this.focusDate)
        this.focusDate = new Date(this.focusDate.getFullYear(), this.focusDate.getMonth(), this.focusDate.getDate() + 1 ) // increment FocusDate
      }
      console.log("186186 %o", dates)
        this.focusDate = new Date(this.focusDate.getFullYear(), this.focusDate.getMonth(), this.focusDate.getDate() + 2 ) // move FocusDate tp Monday
        return dates
    }

}
class month2Class {
  constructor(advance: number){
     const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 
      'November', 'December' ];

      console.log("212")
    let focusDate = new Date()
    focusDate = new Date(focusDate.getFullYear(), focusDate.getMonth() + advance, 1)
    this.moveToMonday(focusDate)

  }
  moveToMonday(focusDate:Date){
      let condition: boolean = false;
      if (condition) {
        this.myFunction(focusDate); // Calling the function inside the if block
      }
    //  if (this.isSunday(focusDate)) {
      let test = focusDate.getDay()
      if (test == 0) 
          focusDate.setDate(focusDate.getDate()+1)
      if (test == 6) 
          focusDate.setDate(focusDate.getDate()+2)
      if (test >  0 && test < 6) 
          focusDate.setDate(focusDate.getDate() - (test - 1 ))  
  console.log("232232 %o", focusDate)      
 
      
  }
      myFunction(fDate:Date): void {
        console.log("Function called!");
        fDate.setDate(fDate.getDate()+1)
      }
      isSunday(date: Date): boolean {
        return date.getDay() === 0;
}

}
  


