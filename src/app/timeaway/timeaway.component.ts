import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-timeaway',
  standalone: true,
  imports: [],
  templateUrl: './timeaway.component.html',
  styleUrl: './timeaway.component.css'
})
export class TimeawayComponent {
  id: string | null = null;
  
  constructor(private route: ActivatedRoute) {}
 ngOnInit() {
     this.route.params.subscribe(params => {
      this.id = params['id'];
        window.location.href = 'https://whiteboard.partners.org/esb/FLwbe/vacation/indexPHPsmall.php?userid=' + this.id +'&vidx=0&first=vM&func=0'
     })
  
  }
  goToVacMan(){
      window.location.href = 'https://whiteboard.partners.org/esb/FLwbe/vacation/indexPHPsmall.php?userid=fjl3&vidx=0&first=vM&func=0'
  }
      
}
