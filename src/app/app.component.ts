import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MyserviceService } from './myservice.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl:  './app.component.html',
  styleUrl: './app.component.css',
     host: {
        '[attr.ngSkipHydration]': 'true'
      }
})
export class AppComponent implements OnInit {
  constructor(private route: ActivatedRoute,private router: Router, private myservice:MyserviceService) {}
  title = 'PhysicsCoverage';
  id: string = ''
 loggedInUserKey: number = 0
     ngOnInit() {
          this.route.queryParams.subscribe(params => {
            this.id = params['userid']; // Access a specific query parameter
            if (this.id){
              this.myservice.setUserId(this.id); // Store the ID in the service for use by other components.
                   this.myservice.getLoggedInUserKey().subscribe(res=>{
              this.loggedInUserKey = res
              console.log("34343 loggedInUserKey is %o", this.loggedInUserKey)
                   
            })
          }
            else {
              this.id = this.myservice.getUserId() 
            }
          });
          if (this.id){
     
          }
        }
    hasId(){
      if (this.id)
        return true
      else if  (this.id = this.myservice.getUserId()) {
        this.id = this.myservice.getUserId()
        return true
      }
      else 
        return false
    }    

}
