import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter, MatOption } from '@angular/material/core';
import { FormGroup, FormControl, ReactiveFormsModule,FormsModule  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MyserviceService } from '../myservice.service';
import { MatSelectModule, MatSelect } from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import { NgForm } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { start } from 'repl';
import {MatDialog,MatDialogActions,MatDialogClose,MatDialogContent,MatDialogRef, MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-angtimeaway',
  templateUrl: './angtimeaway.component.html',
  styleUrls: ['./angtimeaway.component.css'],
  standalone: true,
  imports: [CommonModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule,
    ReactiveFormsModule, FormsModule, MatOption, MatSelectModule, MatInputModule
],
  providers: [MatDatepickerModule, MatNativeDateModule]
})
export class AngtimeawayComponent implements OnInit {
    readonly dialog = inject(MatDialog);
    range = new FormGroup({
      start: new FormControl(),
      end: new FormControl(),
    });
    reason = new FormGroup({
      choice: new FormControl(),
    });

  advance: number = 0;                                                      // number of months advanced from current month;
  firstDayOnCalendar: Date = new Date();
  numberOfDaysToShow: number = 40;                                          // number of days to show on Calendar
  remainingDaysInMonth: number = this.numberOfRemainingDaysInMonth();
  today: Date = new Date();
  lastDateOnCalendar: Date = new Date(new Date().setDate(new Date().getDate() + this.numberOfDaysToShow - 1));
  daysInNext28Days: number = this.numberOfDaysToShow - this.remainingDaysInMonth + 2;
  dateShownOnCalendar: dateClass[] = [];
  nameOfCurrentMonth: string = new Date().toLocaleString('default', { month: 'long' });
  nameOfNextMonth: string = new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleString('default', { month: 'long' });
  selectedDosim: Dosims | null = null;                                      // Dosim selected as coverer
  TAs:any = []                                                              // raw TA data from service
  TAclasses: TAclass[] = []                                                 // TAs as TAclass
  goAwayersWithTAs: goAwayerWithTAs[] = []                                  // list of goAwayers with their TAs  
  //selectedDate: Date | null = null;
  goAwayerClass:string = 'goAwayer'
      heading: string = 'Dosimetrist Time Away'
  noteValue: string = ''
  reasonValue: string = ''
  covererValue: string = '0'
  Dosims:Dosims[] = []
  DosismByUserKey:Dosims[] = []
  shownTa: shownTA | null = null  
    reasons: string[] = ['Vacation', 'Meeting', 'Other']
    test:boolean = true
      isDosimetrist:boolean = false
      isApprover:boolean = false
  showPhrase: string = 'Show Physicists';
  showWhich:number = 0;

  constructor(private myservice: MyserviceService) {
  }
  ngOnInit(): void {
    this.shownTa = null
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    this.lastDateOnCalendar = new Date(today.setDate(today.getDate() + this.numberOfDaysToShow ));
    this.makeAllDatesInNext28Days();
    this.getDosims();
    this.getTAs();
    this.getFromAssets();
  }
    showOther(){  
      if (this.showWhich === 1 || this.showWhich === 0) {      // if logged in user is dosimetrist
        this.showWhich = 2;                     // show physicists
        this.ngOnInit();
             console.log("9090 showWhich %o", this.showWhich);
        return
      }
      if (this.showWhich === 2){
        this.showWhich = 1;                     // show dosimetrists
        console.log("9090 showWhich %o", this.showWhich);
        this.ngOnInit();
      }
  }
  getFromAssets(){
    this.myservice.getFromAssets().subscribe((data: any) => {
      const Approvers: any = data.Approvers.Approver
      const userid = this.myservice.getUserId()
      for (let i=0; i < Approvers.length; i++){
        if (Approvers[i].userid == userid){                    // if logged in user is privileged user 
          this.isApprover = true                              // use all coverers    
          break
        }
      }
    })
  }

  getTAs(){
    let daysFromNow28 = new Date();
    let today = new Date();
    daysFromNow28.setDate(daysFromNow28.getDate() + this.numberOfDaysToShow);
    let endDateString = daysFromNow28.toISOString().slice(0,10);
    let startDateString = today.toISOString().slice(0,10);
    if (this.advance > 0){
      this.firstDayOnCalendar = this.firstDateOfMonthAdvancedByN(this.advance)
      if (this.advance == 0)
        this.firstDayOnCalendar = new Date();
      startDateString = this.firstDayOnCalendar.toISOString().slice(0,10);
      let endDateDate = this.firstDateOfMonthAdvancedByN(this.advance)
        endDateDate.setDate(endDateDate.getDate() + this.numberOfDaysToShow);
      endDateString = endDateDate.toISOString().slice(0,10);
    } 

    this.myservice.getTAs(endDateString, startDateString, this.showWhich).subscribe({next: data => {
      const resp: any = data;
      this.TAs = resp.tAs ?? [];
      if (resp.isDosimetrist == 1){                         // if logged in user is dosimetrist
        this.isDosimetrist = true;
        this.heading = 'Dosimetrist Time Away'
      }
      else {
        this.isDosimetrist = false;
        this.showPhrase = 'Show Dosimetrists ';
      }
      console.log("7575 TAs %o", this.TAs)
      this.makeTAsIntoTAclasses()
      this.makeGoAwayersList()
      },
      error: error => {
        console.error('There was an error!', error);
      }
    });
  }
  advanceMonth(n:number){
    this.advance = this.advance + n
      this.firstDayOnCalendar = this.firstDateOfMonthAdvancedByN(this.advance)
      if (this.advance == 0)
        this.firstDayOnCalendar = new Date();
    this.lastDateOnCalendar = new Date(this.firstDayOnCalendar);  
    this.lastDateOnCalendar = new Date(this.lastDateOnCalendar .setDate(this.lastDateOnCalendar .getDate() + this.numberOfDaysToShow ));
    this.remainingDaysInMonth = this.numberOfRemainingDaysInMonth();
    this.daysInNext28Days = this.numberOfDaysToShow - this.remainingDaysInMonth + 2;
    this.nameOfCurrentMonth = this.firstDateOfMonthAdvancedByN(this.advance).toLocaleString('default', { month: 'long' });
    this.nameOfNextMonth = this.firstDateOfMonthAdvancedByN(this.advance + 1).toLocaleString('default', { month: 'long' });
    this.makeAllDatesInNext28Days();
    this.getTAs();
  }
  firstDateOfMonthAdvancedByN(n:number): Date {
    const date = new Date();
    date.setMonth(date.getMonth() + n);
    date.setDate(1);
    date.setHours(0, 0, 0, 0); // Set to midnight to avoid time zone issues
    return date;
  }

  getDosims(){
    this.myservice.getDosims().subscribe({next: data => {
      const dosimData: any = data;  // Assuming 'data' is an array of objects
      for (let i=0; i < dosimData.length; i++){
        this.Dosims[i]= new Dosims(dosimData[i].UserKey, dosimData[i].LastName, dosimData[i].FirstName, dosimData[i].UserID)
        this.DosismByUserKey[dosimData[i].UserKey]= new Dosims(dosimData[i].UserKey, dosimData[i].LastName, dosimData[i].FirstName, dosimData[i].UserID)
      }
     //  this.selectedDosim = this.Dosims[3]
    },
    error: error => {
      console.error('There was an error!', error);
    }
    });
   
  }
  submit(form: NgForm){
    const startDate = this.range.value.start.toISOString().slice(0, 10);
    const endDate = this.range.value.end.toISOString().slice(0, 10);
    const reason = this.reasonValue;
    const coverer = this.covererValue
    const note = this.noteValue
    var canEnterTA = false
    var loggedInUserKey: number = this.myservice.getLoggedInUserKey();
    var test = this.isDosimetrist
    var test2 = (loggedInUserKey == 0 || loggedInUserKey === null)
    var test3 = (this.selectedDosim == null || this.selectedDosim.UserKey == 0)
    if ((test2)){
      alert("UserKey not set - cannot enter TA")  
      return
    }
    if (this.isDosimetrist){
      if (this.selectedDosim == null || this.selectedDosim.UserKey == 0){
        alert("Please select a coverer - cannot enter TA")
        return
      }
    }
    if (this.myservice.getLoggedInUserKey() > 0){
      this.myservice.enterTA(startDate, endDate, reason, this.selectedDosim, this.myservice.loggedInUserKey,
        this.myservice.getUserLastName(),note, this.isDosimetrist).subscribe({next: data => {
        console.log("3434 enterTA data %o", data)
      this.range.reset(); 
      form.resetForm(); 
      this.ngOnInit();
      }})
  }
}
isUserApprover(): boolean {
  const userKey = this.myservice.getLoggedInUserKey();
 // return this.config.Approvers.some(approver => approver.userid === userKey);
 return false
} 
showTa(tA:any){   
  
  if (tA.CoverageA) {                                           // called when user clicks on a TA to show details
    this.selectedDosim = this.DosismByUserKey[tA.CoverageA]
  }
  this.shownTa = new shownTA(tA)
  console.log("3434 shownTa %o", this.shownTa)

}
selectDates(event: any) {
    console.log("Selected date: ", event);
  }
  /** Load parameters into TAclasses and calculate the number of days in the TA */
  makeTAsIntoTAclasses(){
    this.TAclasses = []; // Initialize the TAclasses array
    for (let i=0; i < this.TAs.length; i++){
      let ta = new TAclass(this.lastDateOnCalendar)
      ta.vidx = this.TAs[i].vidx
      ta.userid = this.TAs[i].userid
      ta.UserID = this.TAs[i].UserID
      ta.LastName = this.TAs[i].LastName
      ta.FirstName = this.TAs[i].FirstName
      ta.reason = this.TAs[i].reason
      ta.note = this.TAs[i].note
      ta.CoverageA = this.TAs[i].coverageA
      ta.startDateYMD = this.TAs[i].startDate.date.slice(0,10)
      ta.endDateYMD = this.TAs[i].endDate.date.slice(0,10)
      ta.startDate = this.createDateFromString(this.TAs[i].startDate.date.slice(0,10))
      ta.endDate = this.createDateFromString(this.TAs[i].endDate.date.slice(0,10))
      ta.lengthOfTA = this.getNumberOfDaysInTA(new Date(this.TAs[i].startDate.date), new Date(this.TAs[i].endDate.date))
      ta.approved = this.TAs[i].approved
      ta.allAccepted = this.TAs[i].allAccepted
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
        let gawt = new goAwayerWithTAs(this.firstDayOnCalendar, this.lastDateOnCalendar)                            // make a new goAwayerWithTAs class
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
    for (let i=0; i < this.goAwayersWithTAs.length; i++){
      this.goAwayersWithTAs[i].myTAs = []                            // initialize the myTAs array for each goAwayer
    }
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
 isUserGoAwayerForThisTA(goAwayerUserkey:number): boolean {
    if (goAwayerUserkey == this.myservice.getLoggedInUserKey())
      return true
    else
      return false
  }
 lastDateInMonthAdvancedByN(n:number): Date {
    const date = new Date();
    date.setMonth(date.getMonth() + n + 1);
    date.setDate(0); // Setting date to 0 gives the last day of the previous month
    date.setHours(0, 0, 0, 0); // Set to midnight to avoid time zone issues
    return date;
  }
  firstDateInMonthAdvancedByN(n:number): Date {
    const date = new Date();
    date.setMonth(date.getMonth() + n);
    date.setDate(1); // Setting date to 1 gives the first day of the month
    date.setHours(0, 0, 0, 0); // Set to midnight to avoid time zone issues
    return date;
  }
  makeAllDatesInNext28Days(){
    this.dateShownOnCalendar.length = 0
    let firstDateOnCalendar = new Date();
    var lastDateOnCalendar = new Date();
    lastDateOnCalendar.setDate(firstDateOnCalendar .getDate() +  this.numberOfDaysToShow);
    if (this.advance > 0){
      firstDateOnCalendar = this.firstDateInMonthAdvancedByN(this.advance)
      lastDateOnCalendar = this.firstDateInMonthAdvancedByN(this.advance)
      lastDateOnCalendar.setMonth(lastDateOnCalendar.getMonth())
      lastDateOnCalendar.setFullYear(lastDateOnCalendar.getFullYear())
      lastDateOnCalendar.setDate(lastDateOnCalendar.getDate() + this.numberOfDaysToShow -1)
      this.lastDateOnCalendar = lastDateOnCalendar
    }

    for (let d = firstDateOnCalendar; d <=lastDateOnCalendar; d.setDate(d.getDate() + 1)) {
      let jsk = new Date(d);
      let dc = new dateClass(jsk);
      this.dateShownOnCalendar.push(dc);
    }
    console.log("173173 %o", this.dateShownOnCalendar);
  }
  numberOfRemainingDaysInMonth(): number {
    if (this.advance > 0){                          // lines 264-267 written by CoPilot
      const lastDayOfMonth = this.lastDateInMonthAdvancedByN(this.advance);
      const firstDayOfMonth = this.firstDateInMonthAdvancedByN(this.advance);
      const remainingDays = lastDayOfMonth.getDate() - firstDayOfMonth.getDate() + 1;
      return remainingDays;
    }
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const remainingDays = lastDayOfMonth.getDate() - today.getDate();
    return remainingDays+1;
  }


  getNumberOfDaysInTA(startDate: Date, endDate: Date): number {
      if (startDate < this.dateShownOnCalendar[0].wholeDate)                // if TA starts before calendar start date, set to calendar start date
        startDate = this.dateShownOnCalendar[0].wholeDate
      if (this.areDatesOnSameDay(endDate,startDate))                    
          return 1                                                          // set length to 1 day if start and end dates are the same
      else {
        let effEndDate = new Date(endDate)                                  // clone the endDate
        if (endDate >= this.lastDateOnCalendar){                            // if TA ends after calendar end date,         
          effEndDate = new Date(this.lastDateOnCalendar)                   // set effective end date to calendar end date
          effEndDate.setUTCHours(0, 0, 0, 0);
          effEndDate.setDate(effEndDate.getDate() );                   // add one day to include the last date on calendar 
        }
        effEndDate.setUTCHours(0, 0, 0, 0);
        startDate.setUTCHours(0, 0, 0, 0);
        var timeDiff = Math.abs(effEndDate.getTime() - startDate.getTime());
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
    isToday(num:number): string {
      if (num == 0 ) 
        return 'today'
      else
        return ' '
      }
     hideForm(){
      this.shownTa = null
     } 
    editTa(event:any, whatIs:string, ta:shownTA){
      let changeValue:string | number = ''
      if (event.target)
        changeValue = event.target.value
      else if (event.value)
        changeValue = event.value
      else
        changeValue = event
      this.myservice.editTA(changeValue, whatIs, ta.vidx).subscribe({next: data => {
        console.log("3434 editTA url %o", data)
      }})
      this.ngOnInit();
   //   this.shownTa = null
    }
    /** Return the proper class for a goAwayer depending on approval status */
    goAwayerClassFunc(tA:TAclass): string {
  //    console.log("3434 isDosimetrist %o tA.approved %o tA.CoverageA %o", this.isDosimetrist, tA.approved, tA.CoverageA)
      var ret = 'goAwayer'
      if (this.isDosimetrist && (tA.approved == 0 || tA.approved === null))
        ret = 'notApproved';
      else if (this.isDosimetrist && tA.CoverageA ===null)
        ret = 'noCoverage';
      else if (this.isDosimetrist && tA.CoverageA > 0 && tA.allAccepted == 1)
        ret = 'hasCoverage';
      else if (!this.isDosimetrist )
        ret =  'goAwayer';
      return ret;
    }
  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(DialogAnimationsExampleDialog, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
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
    myTAs: any[] = [] // all TA entries for this goAwayer     
    daysTillFirstTA: boolean[] = []
    lengthOfFirstTA: number = 0
    TAlength: number[] = []
    constructor(public firstDayOnCalendar: Date, public lastDateOnCalendar: Date) { 
      this.daysTillFirstTA = []
    }
    /** Make either days till start for first TA or days between TAs */
    makeDaysTillStart(){
      for (let i=0; i < this.myTAs.length; i++){
        /** This is first TA for this user. so need to calculate number of days from TODAY till TA.start*/
        if (i == 0){                                    
          if (this.myTAs[i].startDate <= this.firstDayOnCalendar){       // if the first TA.start is before or on today
            this.myTAs[i].daysTillTAstart = 0               // TA-display starts today so daysTillTAstart = 0
          }
          else {                                         // first TA is after today, so calculate days from today to TA start
            let today = this.firstDayOnCalendar
            this.myTAs[i].startDate.setUTCHours(0, 0, 0, 0);
            this.firstDayOnCalendar.setUTCHours(0, 0, 0, 0);
            var timeDiff = Math.abs(this.myTAs[i].startDate.getTime() - this.firstDayOnCalendar.getTime());
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
        if (this.myTAs[i].daysTillTAstart < 0){
        console.log("3434 goAwayer %o TA %o daysTillTAstart %o", this.UserKey, this.myTAs[i], this.myTAs[i].daysTillTAstart)
        this.myTAs[i].daysTillTAstart = 0
      }
      }
    }
    /** calculate days from end of last TA to end of calendar */
    makeDaysTillEndOfCalendar(lastDateOnCalendar: Date){
      const numberOfTAs = this.myTAs.length               // number of TAs for this goAwayer     
      if (numberOfTAs > 0) {
        let lastTA = this.myTAs[numberOfTAs - 1];         
        if (lastTA.endDate < lastDateOnCalendar){                            // if last TA ends before end of calendar{
          var timeDiff = Math.abs(lastDateOnCalendar.getTime() - lastTA.endDate.getTime());
          this.myTAs[numberOfTAs - 1].daysTillEndOfCalendar = Math.ceil(timeDiff / (1000 * 3600 * 24)); // days till start of next TA
          this.myTAs[numberOfTAs - 1].daysTillEndOfCalendar = this.getDaysBetweenDatesUTC(lastTA.endDate, lastDateOnCalendar); // add one to include last date on calendar
        } 
      }
    }
    getDaysBetweenDatesUTC(date1: Date, date2: Date): number {
          const MS_PER_DAY = 1000 * 60 * 60 * 24;
          const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
          const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
          return Math.floor((utc2 - utc1) / MS_PER_DAY);
}
 }
 class TAclass {
    vidx: number = 0
    userid: number = 0
    UserID: string = ''
    LastName: string = ''
    FirstName: string = ''
    CoverageA: number = 0
    CovererLastName: string = ''
    CovererFirstName: string = ''
    startDate: Date = new Date()
    startDateYMD: string = ''

    endDate: Date = new Date()
    endDateYMD: string = ''
    reason: number = 0
    note: string = ''
    lengthOfTA: number = 0
    daysTillTAstart: number = 0
    numberOfDaysInTA: number = 0
    daysTillEndOfCalendar: number = 0
    lastDateOnCalendar: Date = new Date()
    approved: number = 0
    allAccepted: number = 0
  
    constructor(lastDateOnCalendar: Date) {

     }
     makeNumbers(){
      let effEndDate = new Date(this.endDate)
      if (this.endDate > this.lastDateOnCalendar){
        effEndDate = new Date(this.lastDateOnCalendar)
      }
      var timeDiff = Math.abs(effEndDate.getTime() - this.startDate.getTime());
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
class Dosims{
    UserKey: number = 0
    LastName: string = ''
    FirstName: string = ''
    UserID: string = ''
    NameWithInitial: string = ''
    WholeName: string = ''
    constructor(UserKey: number, LastName: string, FirstName: string, UserID: string){
      this.UserKey = UserKey
      this.LastName = LastName
      this.FirstName = FirstName
      this.UserID = UserID
      this.NameWithInitial = this.LastName + ',' + this.FirstName.charAt(0)
      this.WholeName = this.LastName + ', ' + this.FirstName
    }  
  }
class shownTA{
  vidx: number = 0
  userid: number = 0
  UserID: string = ''
  LastName: string = ''
  FirstName: string = ''
  startDateYMD: string = ''
  endDateYMD: string = ''
  startDate: Date = new Date()
  endDate: Date = new Date()
  reason: number = 0
  note: string = ''
  CoverageA: number = 0
  covererFullName: string = ''
  lengthOfTA: number = 0  
  daysTillTAstart: number = 0
  numberOfDaysInTA: number = 0
  daysTillEndOfCalendar: number = 0
  approved: number = 0
  constructor(ta: TAclass) {
    this.vidx = ta.vidx
    this.userid = ta.userid
    this.UserID = ta.UserID
    this.FirstName = ta.FirstName
    this.LastName = ta.LastName
    this.startDate = ta.startDate
    this.startDateYMD = ta.startDateYMD
    this.endDateYMD = ta.endDateYMD
    this.endDate = ta.endDate
    this.reason = ta.reason
    this.note = ta.note
    this.CoverageA = ta.CoverageA
    this.lengthOfTA = ta.lengthOfTA
    this.daysTillTAstart = ta.daysTillTAstart
  } 
}

@Component({
  selector: 'dialog-animations-example-dialog',
  standalone: true,
  templateUrl: 'dialog-animations-example-dialog.html',
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAnimationsExampleDialog {
  readonly dialogRef = inject(MatDialogRef<DialogAnimationsExampleDialog>);
}