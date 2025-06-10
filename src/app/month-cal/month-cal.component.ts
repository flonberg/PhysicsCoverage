import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MyserviceService } from '../myservice.service';
import { CommonModule } from '@angular/common'; 
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-month-cal',
  standalone: false,
  templateUrl: './month-cal.component.html',
  styleUrl: './month-cal.component.css'
})
export class MonthCalComponent {
  @NgModule({ 
    declarations: [MonthCalComponent],
    imports: [CommonModule], // Import modules this component needs
    exports: [MonthCalComponent] 

})
  id: string  = ''
  advance: number = 0;                              // 0 for current month, 1 for next month, -1 for previous month
  numRows:number = 5                                // 5 rows for the month calendar  
  numsForTr: number[] = [0,1,2,3,4];                // 5 rows for the month calendar  
  constructor(private route: ActivatedRoute, private myservice: MyserviceService) {}
   ngOnInit() {
       this.route.params.subscribe(params => {
        this.id = params['id'];
        console.log("MonthCalComponent ID: ", this.id); 
        this.myservice.setUserId(this.id); // This is the Entry component so Store the ID in the service for use by other components. 

       })
    }
  }

