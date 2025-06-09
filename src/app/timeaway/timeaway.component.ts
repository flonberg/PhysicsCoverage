import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-timeaway',
  standalone: true,
  imports: [],
  templateUrl: './timeaway.component.html',
  styleUrl: './timeaway.component.css'
})
export class TimeawayComponent {
  id: string | null = null;
  url: SafeResourceUrl | null = null;
  
  constructor(private route: ActivatedRoute, private sanitizer:DomSanitizer) {}
 ngOnInit() {
     this.route.params.subscribe(params => {
      this.id = params['id'];
      let url="https://whiteboard.partners.org/esb/FLwbe/vacation/vacmanWU.php?userid="+this.id+"&vidx=0&first=vM&func=0"
      this.sanitizeURL(url);
   //     window.location.href = 'https://whiteboard.partners.org/esb/FLwbe/vacation/indexPHPsmall.php?userid=' + this.id +'&vidx=0&first=vM&func=0'
     })
  
  }
  sanitizeURL(url:string) {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
