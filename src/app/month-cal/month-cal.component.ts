import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MyserviceService } from '../myservice.service';

@Component({
  selector: 'app-month-cal',
  standalone: true,
  imports: [],
  templateUrl: './month-cal.component.html',
  styleUrl: './month-cal.component.css'
})
export class MonthCalComponent {
  id: string  = ''
  constructor(private route: ActivatedRoute, private myservice: MyserviceService) {}
   ngOnInit() {
       this.route.params.subscribe(params => {
        this.id = params['id'];
        console.log("MonthCalComponent ID: ", this.id); 
        this.myservice.setUserId(this.id); // This is the Entry component so Store the ID in the service for use by other components. 
       })
    }
  }
