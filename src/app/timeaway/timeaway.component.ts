import { Component } from '@angular/core';

@Component({
  selector: 'app-timeaway',
  standalone: true,
  imports: [],
  templateUrl: './timeaway.component.html',
  styleUrl: './timeaway.component.css'
})
export class TimeawayComponent {
  ngOnInit() {
    window.location.href = 'https://whiteboard.partners.org/esb/FLwbe/vacation/indexPHP.php?userid=fjl3&vidx=0&first=vM&func=0'
  }
}
