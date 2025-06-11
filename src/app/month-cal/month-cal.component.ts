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
  monthShownName: string='' // Name of the month shown in the calendar

  constructor(private route: ActivatedRoute, private myservice: MyserviceService) {}
   ngOnInit() {
       this.route.params.subscribe(params => {
        this.id = params['id'];
        console.log("MonthCalComponent ID: ", this.id); 
        this.myservice.setUserId(this.id); // This is the Entry component so Store the ID in the service for use by other components. 
       })
       this.monthShownName = this.getMonthName(this.advance); // Get the current month name
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
  }
}
