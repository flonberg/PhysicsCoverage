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
  constructor(private myservice:MyserviceService){
    this.userkey = this.myservice.getLoggedInUserKey()
    this.userLastName = this.myservice.getUserLastName()
    console.log("1616 %o", this.userkey)
  }
  getUser(){
    return this.userkey
  }

}
