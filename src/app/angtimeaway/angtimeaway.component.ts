import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter, MatOption } from '@angular/material/core';
import { FormGroup, FormControl, ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MyserviceService } from '../myservice.service';
import { MatSelectModule, MatSelect } from '@angular/material/select';


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
    ReactiveFormsModule,
    FormsModule,
    MatOption,
    MatSelectModule,
],
  providers: [MatDatepickerModule, MatNativeDateModule]
})
export class AngtimeawayComponent implements OnInit {

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
     mySelectControl: new FormControl('option2')
  });
  reason = new FormGroup({
      choice: new FormControl(),
  });
  
    // To get the value:
  onSubmit() {
    const startDate = this.range.value.start;
    const endDate = this.range.value.end;
    console.log('Selected Start Date:', startDate);
    console.log('Selected End Date:', endDate);
  }
  numberOfDaysToShow: number = 32;                                          // number of days to show on Calendar
  remainingDaysInMonth: number = this.numberOfRemainingDaysInMonth();
  lastDateOnCalendar: Date = new Date(new Date().setDate(new Date().getDate() + this.numberOfDaysToShow - 1));
  daysInNext28Days: number = this.numberOfDaysToShow - this.remainingDaysInMonth + 2;
  justDatesInNext28Days: dateClass[] = [];
  nameOfCurrentMonth: string = new Date().toLocaleString('default', { month: 'long' });
  nameOfNextMonth: string = new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleString('default', { month: 'long' });
  TAs:any = []
  TAclasses: TAclass[] = []
  goAwayersWithTAs: goAwayerWithTAs[] = []
  selectedDate: Date | null = null;
  goAwayerClass:string = 'goAwayer'
  reasonValue: string = ''
  covererValue: string = ''
  constructor(private myservice: MyserviceService) {

  }
  ngOnInit(): void {
    this.makeAllDatesInNext28Days();
    this.getDosims();
    this.getTAs();
  }
  getTAs(){
    let daysFromNow28 = new Date();
    daysFromNow28.setDate(daysFromNow28.getDate() + this.numberOfDaysToShow);
    let daysFromNow28String = daysFromNow28.toISOString().slice(0,10);
    this.myservice.getTAs(daysFromNow28String).subscribe({next: data => {
      this.TAs = data;
      this.makeTAsIntoTAclasses()
      this.makeGoAwayersList()
      },
      error: error => {
        console.error('There was an error!', error);
      }
    });
  }
  getDosims(){
    this.myservice.getDosims().subscribe({next: data => {
      console.log("818181 dosims %o", data)
      },
      error: error => {
        console.error('There was an error!', error);
      }
    });
  }
  submit(){
    console.log("123123 %o", this.range.value)
  }
  selectDates(event: any) {
    console.log("Selected date: ", event);
  }
  /** Load parameters into TAclasses and calculate the number of days in the TA */
  makeTAsIntoTAclasses(){
    for (let i=0; i < this.TAs.length; i++){
      let ta = new TAclass()
      ta.idx = this.TAs[i].idx
      ta.userid = this.TAs[i].userid
      ta.UserID = this.TAs[i].UserID
      ta.LastName = this.TAs[i].LastName
      ta.startDate = this.createDateFromString(this.TAs[i].startDate.date.slice(0,10))
      ta.endDate = this.createDateFromString(this.TAs[i].endDate.date.slice(0,10))
      ta.lengthOfTA = this.getNumberOfDaysInTA(new Date(this.TAs[i].startDate.date), new Date(this.TAs[i].endDate.date))
      this.TAclasses.push(ta)
    }
    console.log("3434 TAclasses %o", this.TAclasses)
  }
  /**Assuming the input format is 'YYYY-MM-DD' avoid time zone issues*/
  createDateFromString(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // Month is 0-indexed in JavaScript Date
  }
  /** Make goAwayersWithTAs class for each goAwayer and then put each TA in the proper goAwayerWithTAs class */
  makeGoAwayersList(){
    this.goAwayersWithTAs = []
    for (let i=0; i < this.TAs.length; i++){
      let found = false                                                 // assume that the goAwayer is not yet in the list
      for (let j=0; j < this.goAwayersWithTAs.length; j++){             // go thru each goAwayer already in the list  
        if (this.goAwayersWithTAs[j].UserKey == this.TAs[i].userid){   // If 
          found = true
          break                                                     // go to the next TA
        }
      }
      if (!found){                                                   // if the goAwayer is not yet in the list, then add them         
        let gawt = new goAwayerWithTAs()                            // make a new goAwayerWithTAs class
        gawt.LastName = this.TAs[i].LastName                        // load parameters from the TA
        gawt.UserKey = this.TAs[i].userid                           // mm
        gawt.UserID = this.TAs[i].UserID                            // mm
        this.goAwayersWithTAs.push(gawt)                            // add to list
      }
    }
      this.putTAsWithGoAwayers()
    console.log("3434 goAwayersWithTAs %o", this.goAwayersWithTAs)
  }
  /** Go thru the TAs and put each on in the proper goAwayerWithTAs class */
  putTAsWithGoAwayers(){
      for (let j = 0; j < this.TAclasses.length; j++)
      {
        for (let i=0; i < this.goAwayersWithTAs.length; i++)
        {
        if (this.TAclasses[j].userid == this.goAwayersWithTAs[i].UserKey)         // find TA entry for this goAwayer
          this.goAwayersWithTAs[i].myTAs.push(this.TAclasses[j])    
        }
      }
      for (let i=0; i < this.goAwayersWithTAs.length; i++){
        this.goAwayersWithTAs[i].makeDaysTillStart()
        this.goAwayersWithTAs[i].makeDaysTillEndOfCalendar(this.lastDateOnCalendar)
      }
  }

  makeAllDatesInNext28Days(){
    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() +  this.numberOfDaysToShow);

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
    return remainingDays+1;
  }


    getNumberOfDaysInTA(startDate: Date, endDate: Date): number {
      if (startDate < this.justDatesInNext28Days[0].wholeDate)
        startDate = this.justDatesInNext28Days[0].wholeDate
      if (this.areDatesOnSameDay(endDate,startDate))
          return 1
      else {
        endDate.setUTCHours(0, 0, 0, 0);
        startDate.setUTCHours(0, 0, 0, 0);
        var timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end dates
        return diffDays;
        }
    }
    areDatesOnSameDay(date1: Date, date2: Date): boolean {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
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
    myTAs: any[] = [] // all TA entries for this goAwayer     
    daysTillFirstTA: boolean[] = []
    lengthOfFirstTA: number = 0
    TAlength: number[] = []
    constructor() { 
      this.daysTillFirstTA = []
    }
    /** Make either days till start for first TA or days between TAs */
    makeDaysTillStart(){
      for (let i=0; i < this.myTAs.length; i++){
        /** This is first TA for this user. so need to calculate number of days from TODAY till TA.start*/
        if (i == 0){                                    
          if (this.myTAs[i].startDate <= new Date()){       // if the first TA.start is before or on today
            this.myTAs[i].daysTillTAstart = 0               // TA-display starts today so daysTillTAstart = 0
          }
          else {                                         // first TA is after today, so calculate days from today to TA start
            let today = new Date()
            var timeDiff = Math.abs(this.myTAs[i].startDate.getTime() - today.getTime());
            this.myTAs[i].daysTillTAstart = Math.ceil(timeDiff / (1000 * 3600 * 24)); // +1 to include both start and end dates
          }
        }
            /** This is NOT the first TA for this user. so need to calculate number of days from PREVIOUS TA.end till THIS TA.start*/
        else {                          
            let lastDate = new Date(this.myTAs[i-1].endDate)
                // Normalize to midnight UTC for accurate day difference calculation
          lastDate.setUTCHours(0, 0, 0, 0);
          this.myTAs[i].startDate.setUTCHours(0, 0, 0, 0);
            var timeDiff = Math.abs(this.myTAs[i].startDate.getTime() - lastDate.getTime());
            this.myTAs[i].daysTillTAstart = Math.ceil(timeDiff / (1000 * 3600 * 24))-1; // +1 to include both start and end dates 
       
        }
      }
    }
    /** calculate days from end of last TA to end of calendar */
    makeDaysTillEndOfCalendar(lastDate: Date){
      const numberOfTAs = this.myTAs.length               // number of TAs for this goAwayer     
      if (numberOfTAs > 0) {
        let lastTA = this.myTAs[numberOfTAs - 1];
        if (lastTA.endDate < lastDate) {
          var timeDiff = Math.abs(lastDate.getTime() - lastTA.endDate.getTime());
          this.myTAs[numberOfTAs - 1].daysTillEndOfCalendar = Math.ceil(timeDiff / (1000 * 3600 * 24)); // +1 to include both start and end dates
        } 
      }
    }
 }
 class TAclass {
    idx: number = 0
    userid: number = 0
    UserID: string = ''
    LastName: string = ''
    startDate: Date = new Date()
    endDate: Date = new Date()
    lengthOfTA: number = 0
    daysTillTAstart: number = 0
    numberOfDaysInTA: number = 0
    daysTillEndOfCalendar: number = 0
    constructor() {

     }
     makeNumbers(){
      var timeDiff = Math.abs(this.endDate.getTime() - this.startDate.getTime());
      this.lengthOfTA = Math.ceil(timeDiff / (1000 * 3600 * 24)) +1; // +1 to include both start and end dates
      let today = new Date()
      var timeDiff = Math.abs(this.startDate.getTime() - today.getTime());
      this.daysTillTAstart = Math.ceil(timeDiff / (1000 * 3600 * 24)); // +1 to include both start and end dates
     }

    makeDaysTillTAstart(lastDate: Date){
      let today = new Date()
      if (this.startDate < today)
        this.daysTillTAstart = 0
      else {
        var timeDiff = Math.abs(this.startDate.getTime() - lastDate.getTime());
        this.daysTillTAstart = Math.ceil(timeDiff / (1000 * 3600 * 24)); // +1 to include both start and end dates
        }
    }

}