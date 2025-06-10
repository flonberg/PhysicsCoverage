import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-month-cal',
  standalone: true,
  imports: [],
  templateUrl: './month-cal.component.html',
  styleUrl: './month-cal.component.css'
})
export class MonthCalComponent {
  id: string | null = null;
  constructor(private route: ActivatedRoute) {}
   ngOnInit() {
       this.route.params.subscribe(params => {
        this.id = params['id'];
        console.log("MonthCalComponent ID: ", this.id); 
       })
    }
  }
