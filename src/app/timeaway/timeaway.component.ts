import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MyserviceService } from '../myservice.service';
@Component({
  selector: 'app-timeaway',
  standalone: true,
  imports: [],
  templateUrl: './timeaway.component.html',
  styleUrl: './timeaway.component.css'
})
export class TimeawayComponent {
  id: string =''
  url: SafeResourceUrl | null = null;
  
  constructor(private route: ActivatedRoute, private sanitizer:DomSanitizer, private myservice:MyserviceService) {}
 ngOnInit() {
     this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id.length === 0) 
        this.id = this.myservice.getUserId()
      let url="https://whiteboard.partners.org/esb/FLwbe/vacation/vacmanWU.php?userid="+this.id+"&vidx=0&first=vM&func=0"
      this.sanitizeURL(url);
      console.log("2222 TimeawayComponent ID: ", this.id);
     }) 
  
  }
  sanitizeURL(url:string) {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
