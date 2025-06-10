import { Component } from '@angular/core';
import { MyserviceService } from '../myservice.service';

@Component({
  selector: 'app-week-cal',
  standalone: true,
  imports: [],
  templateUrl: './week-cal.component.html',
  styleUrl: './week-cal.component.css'
})
export class WeekCalComponent {
id: string = '';
 constructor( private myservice:MyserviceService){
  this.id = this.myservice.getUserId(); // Retrieve the user ID from the service
  console.log("WeekCalComponent ID: ", this.id); // Log the ID for debugging
 }
}
