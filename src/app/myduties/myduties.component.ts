import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MyserviceService } from '../myservice.service';
@Component({
  selector: 'app-myduties',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './myduties.component.html',
  styleUrl: './myduties.component.css'
})
export class MydutiesComponent {
  userkey:number = 0
  userLastName: string=''
  duties:any
  constructor(private myservice:MyserviceService){
    console.log("171717")
    this.userLastName = this.myservice.getUserLastName()
    const todayStr = new Date().toISOString().slice(0, 10)
    this.myservice.getForMyDuties(todayStr,this.myservice.getLoggedInUserKey()).subscribe(res=>{
      this.duties = res
          console.log("232323 %o", this.duties)
    })
  }

  getDateString(datum: any){
    return datum.date.slice(0,10)
  }
  getUser(){
    return this.userkey
  }
  getLastName(){
    return this.myservice.getUserLastName()
  }

  getLastDayOfNextMonth(): string {
      const today = new Date();
      let year = today.getFullYear();           // Year and month of the next month
      let month = today.getMonth() + 2;         // +1 for next month, +1 because getMonth() is 0-based
      if (month > 11) {                         // If month > 11, roll over to next year
        month = month % 12;
        year += 1;
      }
      const firstDayOfMonthAfterNext = new Date(year, month, 1);          // First day of the month after next month
      // Subtract one day to get last day of next month
      const lastDayOfNextMonth = new Date(firstDayOfMonthAfterNext.getTime() - 1 * 24 * 60 * 60 * 1000);
      return lastDayOfNextMonth.toISOString().slice(0, 10);;
    }
}
