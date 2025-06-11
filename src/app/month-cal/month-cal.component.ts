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
      this.advance = advancd;                                                   // Set the advance value to the number passed in
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
class monthClass { 
  dateInMonth: Date = new Date(); // Date object for the month, initialized to the current date
  monthName: string = ''; // Name of the month, initialized to an empty string
  constructor(advance: number) {
    this.getNextMonthDate(advance); // Get the next month date based on the advance value
    }
    getNextMonthDate(advance: number) {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        let nextMonth = currentMonth + advance;
        let nextYear = currentDate.getFullYear();
        if (nextMonth > 11) {
          nextMonth = 0;
          nextYear++;
        }
        this.dateInMonth = new Date(nextYear, nextMonth, 1);
        this.monthName = monthNames[this.dateInMonth.getMonth()]; // Set the month name based on the date object
      }
}
  


