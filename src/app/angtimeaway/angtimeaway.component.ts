import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter } from '@angular/material/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  constructor() {

  }

  ngOnInit(): void {
    this.makeAllDatesInNext28Days();
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
    const dates = [];
    for (let d = new Date(today); d <= next30Days; d.setDate(d.getDate() + 1)) {
      let jsk = new Date(d);
      dates.push(jsk.getDate());
    }
    console.log(dates);
  }
}