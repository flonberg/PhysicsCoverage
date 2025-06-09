import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
  import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',

  
  
})
export class AppComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}
  title = 'PhysicsCoverage';
  id: string | null = 'fjl3'
     ngOnInit() {
          this.route.queryParams.subscribe(params => {
            console.log(params); // Log all query parameters
            this.id = params['userid']; // Access a specific query parameter
            console.log("2424 myParams %o",params);
          });
        }

}
