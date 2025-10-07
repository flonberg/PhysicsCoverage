import { Component, OnInit } from '@angular/core';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-angtimeaway',
  templateUrl: './angtimeaway.component.html',
  styleUrls: ['./angtimeaway.component.css'],
  standalone: true,
  imports: [CommonModule,  MatDatepickerModule, MatNativeDateModule]
})
export class AngtimeawayComponent implements OnInit {


  constructor() {

  }

  ngOnInit(): void {
    // Initialization logic here
  }
}