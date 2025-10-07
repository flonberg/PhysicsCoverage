import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-angtimeaway',
  templateUrl: './angtimeaway.component.html',
  styleUrls: ['./angtimeaway.component.css']
})
export class AngtimeawayComponent implements OnInit {
  dateForm: FormGroup;

  constructor() {
    this.dateForm = new FormGroup({
      date: new FormControl(null)
    });
  }

  ngOnInit(): void {
  }

  onSubmit(form: FormGroup) {
    // handle form submission
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AngtimeawayComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ]
})
export class AngtimeawayModule { }