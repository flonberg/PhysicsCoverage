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
  numsForTr: number[] = [0,1,2,3,4]; // 5 rows for the month calendar
  id: string  = ''
  advance: number = 0;                              // 0 for current month, 1 for next month, -1 for previous month
  numRows:number = 5                                // 5 rows for the month calendar  
  monthShownName: string=''                         // Name of the month shown in the calendar
  dateOfFirstWeekDay: Date = new Date();            // First weekday of the month, adjusted to Monday if it falls on Sunday or Saturday
  weekOfDates:dateWithData[]=[];                    // Array to hold the dates of each week ofthe month, each date will be an object with data
  // This component is the entry point for the month calendar, it will show the current month and allow the user to advance to the next or previous month.
  constructor(private route: ActivatedRoute, private myservice: MyserviceService) {}
   ngOnInit() {
       this.route.params.subscribe(params => {
        this.id = params['id'];
        console.log("MonthCalComponent ID: ", this.id); 
        this.myservice.setUserId(this.id); // This is the Entry component so Store the ID in the service for use by other components. 
       })
       this.monthShownName = this.getMonthName(this.advance); // Get the current month name
       let firstWeekday: Date = this.firstWeekdayOfMonth(this.advance); // Get the first weekday of the current month
       console.log("First weekday of the month: ", firstWeekday);
       let dayOfWeekOfFirstWeekday: number = firstWeekday.getDay(); // Get the day of the week (0-6, where 0 is Sunday)
       console.log("Day of the week of the first weekday: ", dayOfWeekOfFirstWeekday);
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
    this.advance += number; // Advance the month by the number passed in
    this.monthShownName = this.getMonthName(this.advance); // Update the month name shown
    console.log("Month shown: ", this.monthShownName);
    this.dateOfFirstWeekDay = this.firstWeekdayOfMonth(this.advance); // Get the first weekday of the month
    console.log("First weekday of the month after advancing: ", this.dateOfFirstWeekDay);
    let dayOfWeekOfFirstWeekday: number = this.dateOfFirstWeekDay.getDay(); // Get the day of the week (0-6, where 0 is Sunday)
    console.log("Day of the week of the first weekday: ", dayOfWeekOfFirstWeekday);
    let test = this.dateFromLastMonth(dayOfWeekOfFirstWeekday, this.dateOfFirstWeekDay); // Get the dates from the last month
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
  dateFromLastMonth(dayNum:number, firstWeekday: Date) {
    const datesArray: Date[] = [];
    for (let i = 0; i < dayNum; i++) {
       firstWeekday.setDate(firstWeekday.getDate() - 1);
       datesArray.push(new Date(firstWeekday));                 // Push a new date object to the array
    }
    return datesArray.reverse();                                 // Reverse the array to get the dates in the correct order
  }
}
class dateWithData {

}
