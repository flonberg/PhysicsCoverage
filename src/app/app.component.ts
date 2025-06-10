import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MyserviceService } from './myservice.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  constructor(private route: ActivatedRoute, private myservice:MyserviceService) {}
  title = 'PhysicsCoverage';
  id: string | null = 'fjl3'
     ngOnInit() {
          this.route.queryParams.subscribe(params => {
            console.log(params); // Log all query parameters
            this.id = params['userid']; // Access a specific query parameter
            console.log("appComp 2424 myParams %o",params);
            this.myservice.setUserId(this.id || ''); // Store the ID in the service for use by other components.
          });
        }

}
