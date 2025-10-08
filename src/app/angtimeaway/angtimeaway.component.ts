import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter } from '@angular/material/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MyserviceService } from '../myservice.service';

@Component({
  selector: 'app-angtimeaway',
  templateUrl: './angtimeaway.component.html',
  styleUrls: ['./angtimeaway.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  providers: [MatDatepickerModule, MatNativeDateModule]
})
export class AngtimeawayComponent implements OnInit {
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  remainingDaysInMonth: number = this.numberOfRemainingDaysInMonth();
  daysInNext28Days: number = 28 - this.remainingDaysInMonth + 2;
  numberOfDaysToShow: number = 28;
  justDatesInNext28Days: dateClass[] = [];
  nameOfCurrentMonth: string = new Date().toLocaleString('default', { month: 'long' });
  nameOfNextMonth: string = new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleString('default', { month: 'long' });
  TAs:any = []
  goAwayersWithTAs: goAwayerWithTAs[] = []
  constructor(private myservice: MyserviceService) {

  }
  ngOnInit(): void {
    this.makeAllDatesInNext28Days();
    console.log("Remaining days in month: ", this.remainingDaysInMonth);
    this.getTAs();
    this.makeGoAwayersWithTAs()
            console.log("1212 getTAs data %o", this.TAs)
  }
  makeGoAwayersWithTAs(){
    this.goAwayersWithTAs = []
    for (let i=0; i < this.TAs.length; i++){
      let found = false
      for (let j=0; j < this.goAwayersWithTAs.length; j++){
        if (this.goAwayersWithTAs[j].UserKey === this.TAs[i].UserKey){
          found = true
          break
        }
      }
      if (!found){
        let gawt = new goAwayerWithTAs()
        gawt.LastName = this.TAs[i].LastName
        gawt.UserKey = this.TAs[i].userid
        gawt.UserID = this.TAs[i].UserID
        this.goAwayersWithTAs.push(gawt)
      }
    }
    console.log("3434 goAwayersWithTAs %o", this.goAwayersWithTAs)
  }
  makeNext30Days(){
    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);
    this.range.setValue({start: today, end: next30Days});
  }
  makeAllDatesInNext28Days(){
    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 28);

    for (let d = new Date(today); d <= next30Days; d.setDate(d.getDate() + 1)) {
      let jsk = new Date(d);
      let dc = new dateClass(jsk);
      this.justDatesInNext28Days.push(dc);
    }
    console.log(this.justDatesInNext28Days);
  }
  numberOfRemainingDaysInMonth(): number {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const remainingDays = lastDayOfMonth.getDate() - today.getDate();
    return remainingDays;
  }
  getTAs(){
    let daysFromNow28 = new Date();
    daysFromNow28.setDate(daysFromNow28.getDate() + 28);
    let daysFromNow28String = daysFromNow28.toISOString().slice(0,10);
    console.log("1212 getTAs monthString %o", daysFromNow28String)
    this.myservice.getTAs(daysFromNow28String).subscribe({next: data => {
        this.TAs = data;

      },
      error: error => {
        console.error('There was an error!', error);
      }
    });
  }
}
  class dateClass {
    justdateL:string=''
    wholeDate:Date = new Date()
    isWeekendB:boolean = false
    class:string = ''
    constructor(public d: Date) {
      this.wholeDate = d
      this.justdateL = d.getDate().toString()
      if (this.isWeekend())
        this.class = 'weekend'
      else 
        this.class = 'weekday'
      this.isWeekendB = this.isWeekend()
    }
    isWeekend():boolean {
      if (this.wholeDate.getDay() === 0 || this.wholeDate.getDay() === 6)
        return true
      else 
        return false
    }
  
  }
 class goAwayerWithTAs {
    LastName: string = ''
    UserKey: number = 0
    UserID: string = ''
 }
